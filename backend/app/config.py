"""Settings read from the environment or from the `.env` file in the repository root."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Every setting the product reads. `.env.example` lists the same names."""

    model_config = SettingsConfigDict(env_file=REPOSITORY_ROOT / ".env", extra="ignore")

    llm_api_key: str = ""
    llm_model: str = ""
    llm_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    database_path: str = "data/cards.db"
    # The analytics backend (OpenObserve). Events are sent only when `analytics_enabled` is true.
    analytics_enabled: bool = False
    analytics_url: str = ""
    analytics_org: str = ""
    analytics_stream: str = "events"
    analytics_user: str = ""
    analytics_password: str = ""
    # The observability backend (OpenObserve, over OTLP). The signals are pushed only when `observability_enabled` is true.
    observability_enabled: bool = False
    observability_url: str = ""
    observability_org: str = ""
    observability_user: str = ""
    observability_password: str = ""
    # How often the histogram is exported, and how long the log lines wait to be sent in a batch, in seconds.
    observability_metric_interval_seconds: int = 10
    observability_log_batch_seconds: int = 1


def get_settings() -> Settings:
    return Settings()
