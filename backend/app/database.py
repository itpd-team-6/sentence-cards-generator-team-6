"""Storage of texts, marked words and cards in one SQLite file.

The tables are made by numbered migrations (`MIGRATIONS`): the database remembers the number of the last one it ran
(`PRAGMA user_version`), and `init_db` runs the ones after it, once each and in order. To change the tables, add a
function at the end of the list; never edit one that has been released.
"""

import sqlite3
from collections.abc import Callable, Iterator
from datetime import date, datetime, time, timedelta
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


def default_due_time(day: date, card_id: int) -> str:
    """The due time of a card that has not been moved: the start of its due day, plus a millisecond for its number.

    The number keeps two cards from having the same due time, so a card can always be put between two others, and
    cards due the same day come in the order they were made.
    """
    moment = datetime.combine(day, time.min) + timedelta(milliseconds=card_id)
    return moment.isoformat(timespec="microseconds")


def add_the_due_time(connection: sqlite3.Connection) -> None:
    """Give each card a due time, so cards due the same day can be put before each other (DEC-021).

    A card made before this migration gets the default due time of its due date, so the study list keeps its order.
    """
    connection.execute("ALTER TABLE cards ADD COLUMN due_at TEXT NOT NULL DEFAULT ''")
    for card in connection.execute("SELECT id, due_date FROM cards").fetchall():
        connection.execute(
            "UPDATE cards SET due_at = ? WHERE id = ?",
            (default_due_time(date.fromisoformat(card["due_date"]), card["id"]), card["id"]),
        )


# The migrations, in order. The number of a migration is its place in the list, starting at 1.
MIGRATIONS: list[Callable[[sqlite3.Connection], None]] = [create_the_first_tables, add_the_due_time]

# The card fields a caller may change with `update_card`.
CARD_FIELDS = {"sentence", "translation", "flagged", "due_date", "due_at", "interval_days"}



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
    card_id = cursor.lastrowid
    connection.execute("UPDATE cards SET due_at = ? WHERE id = ?", (default_due_time(today, card_id), card_id))
    connection.commit()
    return card_id


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

    The card with the earliest due time comes first, and cards with the same due time come in the order they were
    made. A card the model could not write a sentence for is left out until it has one.
    """
    rows = connection.execute(
        "SELECT * FROM cards WHERE due_date <= ? AND sentence IS NOT NULL AND translation IS NOT NULL"
        " ORDER BY due_at, id",
        (today.isoformat(),),
    ).fetchall()
    return [dict(row) for row in rows]


def list_queue(connection: sqlite3.Connection) -> list[dict]:
    """The study queue: every card that has a sentence and a translation to show, in the order they are studied.

    The card with the earliest due time comes first. The cards due today or earlier are the first ones of the queue
    (`list_due_cards` gives only those); the others follow, each with the date it is due.
    """
    rows = connection.execute(
        "SELECT * FROM cards WHERE sentence IS NOT NULL AND translation IS NOT NULL ORDER BY due_at, id"
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


class QueueOutOfDate(ValueError):
    """The cards that are due are not the cards the caller saw, so the order it sent does not fit them."""


class InvalidMove(ValueError):
    """The order sent changes the place of a card that is not listed as moved, or lists no moved card."""


def times_between(
    before: datetime | None, after: datetime | None, count: int, existing: list[datetime]
) -> list[datetime] | None:
    """`count` due times, increasing, that put cards between two cards; None when there is no room left.

    `before` and `after` are the due times of the cards next to the moved ones, or None at an end of the queue. When
    the moved cards are the whole queue, they get the due times they already had, in the new order.
    """
    if before is None and after is None:
        return sorted(existing)
    if before is None:
        return [after - timedelta(seconds=count - place) for place in range(count)]
    if after is None:
        return [before + timedelta(seconds=place + 1) for place in range(count)]
    step = (after - before) / (count + 1)
    times = [before + step * (place + 1) for place in range(count)]
    in_order = before < times[0] and all(a < b for a, b in zip(times, times[1:])) and times[-1] < after
    return times if in_order else None


def reorder_queue(
    connection: sqlite3.Connection, card_ids: list[int], moved: list[int], today_count: int, today: date
) -> None:
    """Save a new order of the study queue, and the cards that are due today in it (DEC-021).

    `card_ids` is the whole queue in the order the learner wants it, `moved` the cards the learner moved, and the first
    `today_count` cards of the order are the ones due today. Each run of moved cards that sit one after another gets
    due times between the cards on either side of it, evenly spaced, so the queue stays sorted by due time. A moved
    card in the first part is due today (it keeps its date when that is today or earlier); a moved card in the second
    part gets the date of the card above it, and at least tomorrow, so that moving a card changes its date to fit
    its place. The other cards, and the interval of every card, are not touched. When two cards are so close that
    there is no time left between them, the whole queue gets new due times one millisecond apart, in the new order.
    """
    queue = list_queue(connection)
    old_order = [card["id"] for card in queue]
    if len(set(card_ids)) != len(card_ids) or sorted(card_ids) != sorted(old_order):
        raise QueueOutOfDate("The cards in the queue are not the cards of this order.")
    moved_ids = set(moved)
    if not moved_ids or not moved_ids <= set(card_ids):
        raise InvalidMove("Name the cards that moved, and only cards of the queue.")
    place = {card_id: number for number, card_id in enumerate(old_order)}
    kept = [card_id for card_id in card_ids if card_id not in moved_ids]
    if any(place[a] > place[b] for a, b in zip(kept, kept[1:])):
        raise InvalidMove("A card that is not named as moved changed its place.")
    if not 0 <= today_count <= len(card_ids):
        raise InvalidMove("The number of cards due today does not fit the order.")
    today_iso = today.isoformat()
    tomorrow_iso = (today + timedelta(days=1)).isoformat()
    dates = {card["id"]: card["due_date"] for card in queue}
    for number, card_id in enumerate(card_ids):
        if card_id not in moved_ids and (dates[card_id] <= today_iso) != (number < today_count):
            raise InvalidMove("A card that is not named as moved changed from today to later, or the reverse.")

    current = {card["id"]: datetime.fromisoformat(card["due_at"]) for card in queue}
    new_times: dict[int, datetime] = {}
    first = 0
    while first < len(card_ids):
        if card_ids[first] not in moved_ids:
            first += 1
            continue
        last = first
        while last < len(card_ids) and card_ids[last] in moved_ids:
            last += 1
        run = card_ids[first:last]
        before = current[card_ids[first - 1]] if first > 0 else None
        after = current[card_ids[last]] if last < len(card_ids) else None
        times = times_between(before, after, len(run), [current[card_id] for card_id in run])
        if times is None:
            start = min(current.values())
            new_times = {card_id: start + timedelta(milliseconds=number) for number, card_id in enumerate(card_ids)}
            break
        new_times.update(zip(run, times))
        first = last

    new_dates: dict[int, str] = {}
    date_above = tomorrow_iso
    for number, card_id in enumerate(card_ids):
        if number < today_count:
            if card_id in moved_ids:
                new_dates[card_id] = min(dates[card_id], today_iso)
        else:
            date_above = max(date_above, dates[card_id]) if card_id not in moved_ids else date_above
            if card_id in moved_ids:
                new_dates[card_id] = date_above
    for card_id, moment in new_times.items():
        connection.execute(
            "UPDATE cards SET due_at = ? WHERE id = ?", (moment.isoformat(timespec="microseconds"), card_id)
        )
    for card_id, due_date in new_dates.items():
        connection.execute("UPDATE cards SET due_date = ? WHERE id = ?", (due_date, card_id))
    connection.commit()


def delete_card(connection: sqlite3.Connection, card_id: int) -> bool:
    """Delete one card. Returns False when the card does not exist."""
    cursor = connection.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    connection.commit()
    return cursor.rowcount == 1
