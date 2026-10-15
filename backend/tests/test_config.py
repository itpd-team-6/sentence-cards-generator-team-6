from pathlib import Path

from app.config import REPOSITORY_ROOT, Settings


def example_names() -> set[str]:
    lines = (REPOSITORY_ROOT / ".env.example").read_text(encoding="utf-8").splitlines()
    return {line.split("=", 1)[0].strip() for line in lines if "=" in line and not line.startswith("#")}


def test_env_example_lists_every_setting() -> None:
    settings_names = {name.upper() for name in Settings.model_fields}

    assert example_names() == settings_names


def test_settings_read_the_environment(monkeypatch) -> None:
    monkeypatch.setenv("LLM_MODEL", "some-model")

    assert Settings().llm_model == "some-model"


def test_env_file_is_not_tracked() -> None:
    gitignore = (REPOSITORY_ROOT / ".gitignore").read_text(encoding="utf-8").splitlines()

    assert ".env" in gitignore
    assert Path(REPOSITORY_ROOT / ".env.example").exists()
