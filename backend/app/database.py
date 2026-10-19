"""Storage of texts, marked words and cards in one SQLite file.

The tables are made by numbered migrations (`MIGRATIONS`): the database remembers the number of the last one it ran
(`PRAGMA user_version`), and `init_db` runs the ones after it, once each and in order. To change the tables, add a
function at the end of the list; never edit one that has been released.
"""

import sqlite3
from collections.abc import Callable, Iterator
from datetime import date
from pathlib import Path

from app.config import REPOSITORY_ROOT, get_settings


def create_the_first_tables(connection: sqlite3.Connection) -> None:
    """The tables of release `v0.1.0`. A database made by that release already has them, and keeps its rows."""
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS texts (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            text_language TEXT NOT NULL,
            first_language TEXT NOT NULL
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS marked_words (
            id INTEGER PRIMARY KEY,
            text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
            word TEXT NOT NULL,
            UNIQUE (text_id, word)
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY,
            text_id INTEGER NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
            word TEXT NOT NULL,
            sentence TEXT,
            translation TEXT,
            flagged INTEGER NOT NULL DEFAULT 0,
            due_date TEXT NOT NULL,
            interval_days INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    # A database made before `interval_days` existed keeps its cards: the column is added, at 0.
    columns = {row["name"] for row in connection.execute("PRAGMA table_info(cards)")}
    if "interval_days" not in columns:
        connection.execute("ALTER TABLE cards ADD COLUMN interval_days INTEGER NOT NULL DEFAULT 0")


# The migrations, in order. The number of a migration is its place in the list, starting at 1.
MIGRATIONS: list[Callable[[sqlite3.Connection], None]] = [create_the_first_tables]

# The card fields a caller may change with `update_card`.
CARD_FIELDS = {"sentence", "translation", "flagged", "due_date", "interval_days"}


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


def database_version(connection: sqlite3.Connection) -> int:
    """The number of the last migration the database has run; 0 for a file that has none."""
    return connection.execute("PRAGMA user_version").fetchone()[0]


def init_db(connection: sqlite3.Connection) -> None:
    """Bring the database to the latest version, running each migration it has not run yet, in order.

    A migration and the new version number are saved together: when a migration fails, the database stays at the
    version it had.
    """
    for number, migrate in enumerate(MIGRATIONS, start=1):
        if number <= database_version(connection):
            continue
        connection.execute("BEGIN")
        try:
            migrate(connection)
            connection.execute(f"PRAGMA user_version = {number}")
        except BaseException:
            connection.rollback()
            raise
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
    words = connection.execute("SELECT word FROM marked_words WHERE text_id = ? ORDER BY id", (text_id,)).fetchall()
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


def list_all_cards(connection: sqlite3.Connection) -> list[dict]:
    """Every card of every text: the newest text first, and the words of a text in the order they were marked."""
    rows = connection.execute("SELECT * FROM cards ORDER BY text_id DESC, id").fetchall()
    return [dict(row) for row in rows]


def list_due_cards(connection: sqlite3.Connection, today: date) -> list[dict]:
    """The cards to study on `today`: due today or earlier, and with a sentence and a translation to show.

    The oldest due date comes first. A card the model could not write a sentence for is left out until it has one.
    """
    rows = connection.execute(
        "SELECT * FROM cards WHERE due_date <= ? AND sentence IS NOT NULL AND translation IS NOT NULL"
        " ORDER BY due_date, id",
        (today.isoformat(),),
    ).fetchall()
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
