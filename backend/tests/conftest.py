import pytest


@pytest.fixture(autouse=True)
def database_in_a_temporary_folder(tmp_path, monkeypatch):
    """Keep every test away from the real database file."""
    monkeypatch.setenv("DATABASE_PATH", str(tmp_path / "data" / "cards.db"))
