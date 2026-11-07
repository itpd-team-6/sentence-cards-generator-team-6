import json
import logging
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest
from fastapi.testclient import TestClient

from app import database, observability
from app.config import get_settings
from app.main import app

MISSING_TEXT = 999999999


@pytest.fixture
def http():
    database._ready_libraries.clear()
    with TestClient(app) as client:
        yield client


def request_lines(caplog) -> list[dict]:
    return [
        json.loads(record.getMessage())
        for record in caplog.records
        if record.name == observability.LOGGER_NAME
    ]


def test_a_request_to_the_api_writes_one_log_line_with_its_labels(http, caplog):
    caplog.set_level(logging.INFO, logger=observability.LOGGER_NAME)

    response = http.get("/api/health")

    [line] = request_lines(caplog)
    assert response.headers["X-Request-ID"] == line["request_id"]
    assert line["route"] == "/api/health"
    assert line["method"] == "GET"
    assert line["status"] == 200
    assert line["outcome"] == "ok"
    assert line["duration_ms"] >= 0


def test_a_failed_request_of_the_core_task_is_labelled_with_its_failure(http, caplog):
    caplog.set_level(logging.INFO, logger=observability.LOGGER_NAME)

    response = http.post(f"/api/texts/{MISSING_TEXT}/cards", json={"deck_ids": [1]})

    assert response.status_code == 404
    [line] = request_lines(caplog)
    # The route is the path as written in the code, so the label does not carry the identifier of the text.
    assert line["route"] == "/api/texts/{text_id}/cards"
    assert line["outcome"] == "client_error"
    assert line["status"] == 404
    assert str(MISSING_TEXT) not in json.dumps(line)
    assert response.headers["X-Request-ID"] == line["request_id"]


def test_every_request_has_its_own_identifier(http, caplog):
    caplog.set_level(logging.INFO, logger=observability.LOGGER_NAME)

    http.get("/api/health")
    http.get("/api/health")

    first, second = request_lines(caplog)
    assert first["request_id"] != second["request_id"]


def test_a_request_that_is_not_for_the_api_writes_no_line(http, caplog):
    caplog.set_level(logging.INFO, logger=observability.LOGGER_NAME)

    http.get("/something-else")

    assert request_lines(caplog) == []


@pytest.mark.parametrize(
    ("status", "outcome"),
    [
        (200, "ok"),
        (204, "ok"),
        (302, "ok"),
        (404, "client_error"),
        (422, "client_error"),
        (500, "server_error"),
        (503, "server_error"),
    ],
)
def test_the_outcome_follows_the_status(status, outcome):
    assert observability.outcome_of(status) == outcome


class Receiver(BaseHTTPRequestHandler):
    """Stands for the observability backend: it keeps what the product pushes over OTLP."""

    received: list[tuple[str, dict, bytes]] = []

    def do_POST(self):  # noqa: N802
        body = self.rfile.read(int(self.headers["Content-Length"]))
        Receiver.received.append((self.path, {k.lower(): v for k, v in self.headers.items()}, body))
        self.send_response(200)
        self.send_header("Content-Type", "application/x-protobuf")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def log_message(self, *args):
        pass


@pytest.fixture
def backend(monkeypatch):
    Receiver.received = []
    server = HTTPServer(("127.0.0.1", 0), Receiver)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    monkeypatch.setenv("OBSERVABILITY_ENABLED", "true")
    monkeypatch.setenv("OBSERVABILITY_URL", f"http://127.0.0.1:{server.server_port}")
    monkeypatch.setenv("OBSERVABILITY_ORG", "staging_org")
    monkeypatch.setenv("OBSERVABILITY_USER", "operator@example.test")
    monkeypatch.setenv("OBSERVABILITY_PASSWORD", "not-a-secret")
    yield Receiver
    server.shutdown()


def test_the_signals_reach_the_backend_over_otlp(backend):
    from opentelemetry.proto.collector.logs.v1.logs_service_pb2 import ExportLogsServiceRequest
    from opentelemetry.proto.collector.metrics.v1.metrics_service_pb2 import (
        ExportMetricsServiceRequest,
    )

    observability.start(get_settings())
    try:
        with TestClient(app) as client:
            client.get("/api/health")
            client.post(f"/api/texts/{MISSING_TEXT}/cards", json={"deck_ids": [1]})
    finally:
        observability.stop()  # Sends what is waiting.

    paths = {path for path, _, _ in backend.received}
    assert paths == {"/api/staging_org/v1/metrics", "/api/staging_org/v1/logs"}
    for _, headers, _ in backend.received:
        assert headers["authorization"].startswith("Basic ")

    metrics = ExportMetricsServiceRequest()
    logs = ExportLogsServiceRequest()
    for path, headers, body in backend.received:
        if path.endswith("/v1/metrics"):
            metrics.MergeFromString(body)
        else:
            logs.MergeFromString(body)
            assert headers["stream-name"] == observability.LOG_STREAM

    histogram = next(
        metric
        for resource in metrics.resource_metrics
        for scope in resource.scope_metrics
        for metric in scope.metrics
        if metric.name == observability.METRIC_NAME
    )
    labels = {
        tuple(sorted((a.key, a.value.string_value) for a in point.attributes))
        for point in histogram.histogram.data_points
    }
    assert labels == {
        (("outcome", "ok"), ("route", "/api/health")),
        (("outcome", "client_error"), ("route", "/api/texts/{text_id}/cards")),
    }
    assert all(point.count == 1 for point in histogram.histogram.data_points)

    records = [
        {a.key: a.value for a in record.attributes}
        for resource in logs.resource_logs
        for scope in resource.scope_logs
        for record in scope.log_records
    ]
    failed = next(r for r in records if r["outcome"].string_value == "client_error")
    assert set(failed) >= {"request_id", "route", "outcome", "duration_ms", "status", "method"}
    assert failed["route"].string_value == "/api/texts/{text_id}/cards"
