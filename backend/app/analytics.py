"""The events the product records about its use, and how they are sent to the analytics backend.

The events are the ones in `docs/analytics.md#the-events`. An event carries an opaque learner identifier, never a text,
a word, a name or an e-mail address. Sending is off unless `ANALYTICS_ENABLED` is true, it never slows a request, and a
failure to send is dropped: the product works the same without the analytics backend.
"""

import hashlib
import threading
from typing import Any

import httpx2
from fastapi import Request

from app.config import Settings, get_settings
from app.database import LIBRARY_HEADER

SOURCE_HEADER = "X-Event-Source"
# What the traffic is: `smoke` is the team's own check of the pipeline, and a metric leaves it out.
SOURCES = ("web", "usability-test", "smoke")


def learner_id(code: str | None) -> str:
    """An identifier of the learner for the events. It is a one-way hash of the library code, so the analytics backend
    never holds the code that opens the library, and it cannot be turned back into the code or into a person."""
    if code is None:
        return "default"
    return hashlib.sha256(code.encode()).hexdigest()[:16]


def post_event(settings: Settings, row: dict[str, Any]) -> None:
    """Send one event to the analytics backend (OpenObserve JSON ingestion). A failure is dropped."""
    url = f"{settings.analytics_url.rstrip('/')}/api/{settings.analytics_org}/{settings.analytics_stream}/_json"
    try:
        httpx2.post(
            url, json=[row], auth=(settings.analytics_user, settings.analytics_password), timeout=3
        )
    except httpx2.HTTPError:
        pass


def deliver(settings: Settings, row: dict[str, Any]) -> None:
    """Send the event in a thread of its own, so the request that made it does not wait."""
    threading.Thread(target=post_event, args=(settings, row), daemon=True).start()


class Tracker:
    """Records the events of one request, for the learner and the traffic source the request carries."""

    def __init__(self, learner: str, source: str) -> None:
        self.learner = learner
        self.source = source

    def record(self, event: str, **fields: Any) -> None:
        settings = get_settings()
        if not settings.analytics_enabled or not settings.analytics_url:
            return
        deliver(
            settings, {"event": event, "learner_id": self.learner, "source": self.source, **fields}
        )


def get_tracker(request: Request) -> Tracker:
    """The tracker of a request. Use it with `Depends`."""
    source = request.headers.get(SOURCE_HEADER)
    return Tracker(
        learner_id(request.headers.get(LIBRARY_HEADER)),
        source if source in SOURCES else "web",
    )
