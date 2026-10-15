"""The API, and the built front end when it exists."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Sentence cards generator")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Serve the built front end from the same address as the API, so one command runs the product.
FRONTEND_BUILD = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if FRONTEND_BUILD.is_dir():
    app.mount("/", StaticFiles(directory=FRONTEND_BUILD, html=True), name="frontend")
