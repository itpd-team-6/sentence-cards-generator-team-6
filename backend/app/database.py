"""Storage of texts, marked words and cards in one SQLite file."""

import sqlite3
from collections.abc import Iterator
from datetime import date
from pathlib import Path

from app.config import REPOSITORY_ROOT, get_settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS texts (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    text_language TEXT NOT NULL,
    first_language TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS marked_words (
    id INTEGER PRIMARY KEY,
    text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    UNIQUE (text_id, word)
);

CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY,
    text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    sentence TEXT,
    translation TEXT,
    flagged INTEGER NOT NULL DEFAULT 0,
    due_date TEXT NOT NULL
);
"""

# The card fields a caller may change with `update_card`.
CARD_FIELDS = {"sentence", "translation", "flagged", "due_date"}


def database_file(path: str | None = None) -> Path:
    """The database file: `DATABASE_PATH`, relative to the repository root unless it is absolute."""
    file = Path(path if path is not None else get_settings().database_path)
    return file if file.is_absolute() else REPOSITORY_ROOT / file


def connect(path: str | None = None) -> sqlite3.Connection:
    """Open the database, creating its folder if needed. The tables are created by `init_db`."""
    file = database_file(path)
    file.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(file)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db(connection: sqlite3.Connection) -> None:
    connection.executescript(SCHEMA)
    connection.commit()


def get_connection() -> Iterator[sqlite3.Connection]:
    """A connection for one request, closed afterwards. Use it with `Depends`."""
    connection = connect()
    try:
        yield connection
    finally:
        connection.close()


def save_text(
    connection: sqlite3.Connection,
    text: str,
    text_language: str,
    first_language: str,
    words: list[str],
) -> int:
    """Save a text with its marked words, and return the text's id."""
    cursor = connection.execute(
        "INSERT INTO texts (text, text_language, first_language) VALUES (?, ?, ?)",
        (text, text_language, first_language),
    )
    text_id = cursor.lastrowid
    connection.executemany(
        "INSERT OR IGNORE INTO marked_words (text_id, word) VALUES (?, ?)",
        [(text_id, word) for word in words],
    )
    connection.commit()
    return text_id


def get_text(connection: sqlite3.Connection, text_id: int) -> dict | None:
    row = connection.execute("SELECT * FROM texts WHERE id = ?", (text_id,)).fetchone()
    if row is None:
        return None
    words = connection.execute(
        "SELECT word FROM marked_words WHERE text_id = ? ORDER BY id", (text_id,)
    ).fetchall()
    return {**dict(row), "words": [word["word"] for word in words]}


def add_card(
    connection: sqlite3.Connection,
    text_id: int,
    word: str,
    sentence: str | None,
    translation: str | None,
    today: date,
) -> int:
    """Add a card. A new card is due on `today`."""
    cursor = connection.execute(
        "INSERT INTO cards (text_id, word, sentence, translation, due_date) VALUES (?, ?, ?, ?, ?)",
        (text_id, word, sentence, translation, today.isoformat()),
    )
    connection.commit()
    return cursor.lastrowid


def get_card(connection: sqlite3.Connection, card_id: int) -> dict | None:
    row = connection.execute("SELECT * FROM cards WHERE id = ?", (card_id,)).fetchone()
    return dict(row) if row else None


def list_cards(connection: sqlite3.Connection, text_id: int) -> list[dict]:
    rows = connection.execute("SELECT * FROM cards WHERE text_id = ? ORDER BY id", (text_id,)).fetchall()
    return [dict(row) for row in rows]


def update_card(connection: sqlite3.Connection, card_id: int, **fields) -> bool:
    """Change fields of one card. Returns False when the card does not exist."""
    unknown = set(fields) - CARD_FIELDS
    if unknown:
        raise ValueError(f"Cannot update: {', '.join(sorted(unknown))}")
    if not fields:
        return get_card(connection, card_id) is not None
    assignments = ", ".join(f"{name} = ?" for name in fields)
    cursor = connection.execute(
        f"UPDATE cards SET {assignments} WHERE id = ?",
        (*fields.values(), card_id),
    )
    connection.commit()
    return cursor.rowcount == 1


def delete_card(connection: sqlite3.Connection, card_id: int) -> bool:
    """Delete one card. Returns False when the card does not exist."""
    cursor = connection.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    connection.commit()
    return cursor.rowcount == 1
