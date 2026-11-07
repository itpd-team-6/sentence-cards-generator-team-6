"""What the product reports about its own operation, and how it reaches the observability backend.

Every request to the API produces one structured log line, the point of that request, and one observation of the request
duration histogram, the aggregate. The log line carries `request_id`, `route`, `outcome` and `duration_ms`
(`docs/observability.md`). Neither carries a text, a word, a library code or any other personal data, and the histogram
has no `request_id` label, so it does not make one series for each request.

The log line is always written to the standard output of the service. The signals are pushed to the observability
backend (OpenObserve, over OTLP) only when `OBSERVABILITY_ENABLED` is true. Exporting happens in threads of its own, so
it never slows a request, and a failure to export is dropped: the product works the same without the backend.
"""

import json
import logging
import sys
import time
import uuid
from base64 import b64encode
from typing import Any

from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.config import Settings

REQUEST_ID_HEADER = "X-Request-ID"
LOGGER_NAME = "sentence_cards.requests"
SERVICE_NAME = "sentence-cards-backend"
# The name of the histogram in the backend, and the stream the log lines go to.
METRIC_NAME = "backend_request_duration_ms"
LOG_STREAM = "backend_requests"
# The upper bounds of the histogram buckets, in milliseconds. The core task waits for the language model, so they reach
# 32 seconds.
BUCKETS = [10, 25, 50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000]

logger = logging.getLogger(LOGGER_NAME)


def outcome_of(status: int) -> str:
    """The failure label of a response: `ok`, `client_error` (4xx) or `server_error` (5xx)."""
    if status >= 500:
        return "server_error"
    if status >= 400:
        return "client_error"
    return "ok"


class Telemetry:
    """The OpenTelemetry providers that push the histogram and the log lines to the backend."""

    def __init__(self, settings: Settings) -> None:
        # The OpenTelemetry packages are imported here, so the product starts without them when the backend is off.
        from opentelemetry.exporter.otlp.proto.http._log_exporter import OTLPLogExporter
        from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
        from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
        from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
        from opentelemetry.sdk.metrics import MeterProvider
        from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
        from opentelemetry.sdk.resources import Resource

        resource = Resource.create({"service.name": SERVICE_NAME})
        credential = b64encode(
            f"{settings.observability_user}:{settings.observability_password}".encode()
        ).decode()
        headers = {"Authorization": f"Basic {credential}"}
        base = f"{settings.observability_url.rstrip('/')}/api/{settings.observability_org}"

        reader = PeriodicExportingMetricReader(
            OTLPMetricExporter(endpoint=f"{base}/v1/metrics", headers=headers, timeout=3),
            export_interval_millis=settings.observability_metric_interval_seconds * 1000,
        )
        self.meter_provider = MeterProvider(resource=resource, metric_readers=[reader])
        self.histogram = self.meter_provider.get_meter(SERVICE_NAME).create_histogram(
            METRIC_NAME,
            unit="ms",
            description="Duration of an API request, from receiving it to completing the response.",
            explicit_bucket_boundaries_advisory=BUCKETS,
        )

        self.logger_provider = LoggerProvider(resource=resource)
        self.logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(
                OTLPLogExporter(
                    endpoint=f"{base}/v1/logs",
                    headers={**headers, "stream-name": LOG_STREAM},
                    timeout=3,
                ),
                schedule_delay_millis=settings.observability_log_batch_seconds * 1000,
            )
        )
        self.handler = LoggingHandler(level=logging.INFO, logger_provider=self.logger_provider)
        logger.addHandler(self.handler)

    def record(self, route: str, outcome: str, duration_ms: float) -> None:
        self.histogram.record(duration_ms, {"route": route, "outcome": outcome})

    def stop(self) -> None:
        """Send what is waiting and stop the exporters."""
        logger.removeHandler(self.handler)
        self.meter_provider.shutdown()
        self.logger_provider.shutdown()


_telemetry: Telemetry | None = None
_console: logging.Handler | None = None


def start(settings: Settings) -> None:
    """Write the log lines to the standard output, and push the signals to the backend when it is turned on."""
    global _telemetry, _console
    if _console is None:
        _console = logging.StreamHandler(sys.stdout)
        _console.setFormatter(logging.Formatter("%(message)s"))
        logger.addHandler(_console)
        logger.setLevel(logging.INFO)
    if settings.observability_enabled and settings.observability_url and _telemetry is None:
        _telemetry = Telemetry(settings)


def stop() -> None:
    global _telemetry
    if _telemetry is not None:
        _telemetry.stop()
        _telemetry = None


def route_of(scope: Scope) -> str:
    """The path of the route that handled the request, as written in the code (`/api/texts/{text_id}/cards`), so the
    label has a few values and never an identifier. A request no route handled is `unmatched`."""
    route = scope.get("route")
    return getattr(route, "path", None) or "unmatched"


class RequestObservation:
    """A pure ASGI middleware, so the duration ends when the last part of the response has been sent."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or not scope["path"].startswith("/api/"):
            await self.app(scope, receive, send)
            return

        request_id = uuid.uuid4().hex
        started = (
            time.perf_counter()
        )  # A monotonic clock, so a change of the system time cannot bend the duration.
        status = 500
        finished = False

        def finish() -> None:
            nonlocal finished
            if finished:
                return
            finished = True
            duration_ms = round((time.perf_counter() - started) * 1000, 3)
            route = route_of(scope)
            outcome = outcome_of(status)
            fields: dict[str, Any] = {
                "request_id": request_id,
                "method": scope["method"],
                "route": route,
                "status": status,
                "outcome": outcome,
                "duration_ms": duration_ms,
            }
            logger.info(json.dumps(fields), extra=fields)
            if _telemetry is not None:
                _telemetry.record(route, outcome, duration_ms)

        async def send_with_id(message: Message) -> None:
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
                headers = [*message.get("headers", []), (b"x-request-id", request_id.encode())]
                message = {**message, "headers": headers}
            await send(message)
            if message["type"] == "http.response.body" and not message.get("more_body", False):
                finish()

        try:
            await self.app(scope, receive, send_with_id)
        except Exception:
            status = 500
            finish()
            raise
        finish()
