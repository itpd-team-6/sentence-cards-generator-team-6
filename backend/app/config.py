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


def get_settings() -> Settings:
    return Settings()
