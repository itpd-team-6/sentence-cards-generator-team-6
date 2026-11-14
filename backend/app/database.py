"""Storage of texts, marked words, cards and decks in one SQLite file.

The tables are made by numbered migrations (`MIGRATIONS`): the database remembers the number of the last one it ran
(`PRAGMA user_version`), and `init_db` runs the ones after it, once each and in order. To change the tables, add a
function at the end of the list; never edit one that has been released.
"""

import re
import sqlite3
import threading
from collections.abc import Callable, Iterator
from datetime import date, datetime, time, timedelta
from pathlib import Path

from fastapi import HTTPException, Request

from app.config import REPOSITORY_ROOT, get_settings
from app.phrases import same_phrase

# The longest title of a text, and the longest text. The limit of the text is in FR-019.
TEXT_TITLE_LENGTH = 60
TEXT_LENGTH = 10_000
TITLE_WORDS = 6


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


def add_the_hidden_mark(connection: sqlite3.Connection) -> None:
    """Let the learner hide a card from study while it stays in the cards table (DEC-016). None is hidden at first."""
    connection.execute("ALTER TABLE cards ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0")


def add_the_translation_lock(connection: sqlite3.Connection) -> None:
    """Let the learner lock the translation of a card, so the product does not change it (DEC-014). None is locked."""
    connection.execute("ALTER TABLE cards ADD COLUMN translation_locked INTEGER NOT NULL DEFAULT 0")


def add_the_card_phrase(connection: sqlite3.Connection) -> None:
    """Give a card a context phrase that, with its word, identifies it (DEC-013). A card made before has none.

    The index is a last guard: two cards with the same word and the same phrase cannot both be saved. The product checks
    this first, whatever the case of the letters (`find_card_by_phrase`), so the learner gets a clear message.
    """
    connection.execute("ALTER TABLE cards ADD COLUMN phrase TEXT")
    connection.execute(
        "CREATE UNIQUE INDEX cards_word_phrase ON cards (word, phrase) WHERE phrase IS NOT NULL"
    )


def add_the_decks(connection: sqlite3.Connection) -> None:
    """Add decks (DEC-020, DEC-047): a card keeps its own language pair instead of belonging to a text.

    Each card gets the languages of its text and loses the link to it. The link moves to the text side: a marked word
    points to its card (`marked_words.card_id`), so a text page can still show its words with their cards while the
    card forgets the text. Decks start from zero and are not made from texts: the cards that exist go in one deck
    titled "Earlier cards" for each language pair that has cards, so no card is left outside a deck (a session is
    studied from decks). The unique index now includes the languages: the same word and phrase in two language
    pairs are two cards.

    SQLite cannot drop a column that a foreign key uses, so `cards` is rebuilt. The column `marked_words.card_id` is
    added after the rebuild, so dropping the old table does not clear it.
    """
    connection.execute("CREATE TEMP TABLE card_origin AS SELECT id AS card_id, text_id FROM cards")
    connection.execute(
        """
        CREATE TABLE cards_new (
            id INTEGER PRIMARY KEY,
            text_language TEXT NOT NULL,
            first_language TEXT NOT NULL,
            word TEXT NOT NULL,
            sentence TEXT,
            translation TEXT,
            flagged INTEGER NOT NULL DEFAULT 0,
            due_date TEXT NOT NULL,
            interval_days INTEGER NOT NULL DEFAULT 0,
            due_at TEXT NOT NULL DEFAULT '',
            hidden INTEGER NOT NULL DEFAULT 0,
            translation_locked INTEGER NOT NULL DEFAULT 0,
            phrase TEXT
        )
        """
    )
    connection.execute(
        """
        INSERT INTO cards_new (id, text_language, first_language, word, sentence, translation, flagged, due_date,
                               interval_days, due_at, hidden, translation_locked, phrase)
        SELECT cards.id, texts.text_language, texts.first_language, cards.word, cards.sentence, cards.translation,
               cards.flagged, cards.due_date, cards.interval_days, cards.due_at, cards.hidden,
               cards.translation_locked, cards.phrase
        FROM cards JOIN texts ON texts.id = cards.text_id
        """
    )
    connection.execute("DROP TABLE cards")
    connection.execute("ALTER TABLE cards_new RENAME TO cards")
    connection.execute(
        "CREATE UNIQUE INDEX cards_word_phrase ON cards (word, phrase, text_language, first_language)"
        " WHERE phrase IS NOT NULL"
    )
    connection.execute(
        "ALTER TABLE marked_words ADD COLUMN card_id INTEGER REFERENCES cards(id) ON DELETE SET NULL"
    )
    connection.execute(
        """
        UPDATE marked_words SET card_id = (
            SELECT card_origin.card_id FROM card_origin JOIN cards ON cards.id = card_origin.card_id
            WHERE card_origin.text_id = marked_words.text_id AND cards.word = marked_words.word
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE decks (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            text_language TEXT NOT NULL,
            first_language TEXT NOT NULL
        )
        """
    )
    connection.execute(
        "CREATE UNIQUE INDEX decks_title_pair ON decks (lower(title), text_language, first_language)"
    )
    connection.execute(
        """
        CREATE TABLE card_decks (
            card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
            deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
            PRIMARY KEY (card_id, deck_id)
        )
        """
    )
    connection.execute("CREATE INDEX card_decks_deck ON card_decks (deck_id)")
    connection.execute(
        """
        INSERT INTO decks (title, text_language, first_language)
        SELECT 'Earlier cards', text_language, first_language FROM cards
        GROUP BY text_language, first_language ORDER BY text_language, first_language
        """
    )
    connection.execute(
        """
        INSERT INTO card_decks (card_id, deck_id)
        SELECT cards.id, decks.id FROM cards JOIN decks
        ON decks.text_language = cards.text_language AND decks.first_language = cards.first_language
        """
    )
    connection.execute("DROP TABLE card_origin")


def add_the_answer_count(connection: sqlite3.Connection) -> None:
    """Count the answers of each card, so that a card never answered (new) is told from one that was forgotten.

    A card that already waits more than 0 days was answered at least once, so it starts at 1. A card with no wait
    could be new or forgotten and the database cannot say which, so it starts at 0 and counts as new.
    """
    connection.execute("ALTER TABLE cards ADD COLUMN answers INTEGER NOT NULL DEFAULT 0")
    connection.execute("UPDATE cards SET answers = 1 WHERE interval_days > 0")


# The migrations, in order. The number of a migration is its place in the list, starting at 1.
def title_from_text(text: str) -> str:
    """The title a text gets when the learner gives none: its first words, cut to `TEXT_TITLE_LENGTH` characters."""
    title = " ".join(text.split()[:TITLE_WORDS])
    return title[:TEXT_TITLE_LENGTH].rstrip()


def add_the_text_titles(connection: sqlite3.Connection) -> None:
    """Give every text a title (DEC-064), so the list of texts and the labels of the cards have a name to show.

    A text saved before this release gets the title the product would have made for it: its first words.
    """
    connection.execute("ALTER TABLE texts ADD COLUMN title TEXT NOT NULL DEFAULT ''")
    for row in connection.execute("SELECT id, text FROM texts").fetchall():
        connection.execute(
            "UPDATE texts SET title = ? WHERE id = ?", (title_from_text(row["text"]), row["id"])
        )


UNCATEGORIZED_TITLE = "Uncategorized"


def add_the_uncategorized_deck(connection: sqlite3.Connection) -> None:
    """Mark the deck that holds the cards of no other deck (DEC-065), so its name can change without the code.

    Each language pair has at most one such deck, made when it is first needed. Every card that is in no deck goes into
    the one of its language pair, so from now on a card is always in at least one deck. A deck that the learner already
    titled "Uncategorized" for the pair becomes that deck.
    """
    connection.execute("ALTER TABLE decks ADD COLUMN uncategorized INTEGER NOT NULL DEFAULT 0")
    orphans = connection.execute(
        "SELECT id, text_language, first_language FROM cards"
        " WHERE id NOT IN (SELECT card_id FROM card_decks) ORDER BY id"
    ).fetchall()
    for card in orphans:
        deck_id = uncategorized_deck_id(connection, card["text_language"], card["first_language"])
        connection.execute(
            "INSERT INTO card_decks (card_id, deck_id) VALUES (?, ?)", (card["id"], deck_id)
        )


MIGRATIONS: list[Callable[[sqlite3.Connection], None]] = [
    create_the_first_tables,
    add_the_due_time,
    add_the_hidden_mark,
    add_the_translation_lock,
    add_the_card_phrase,
    add_the_decks,
    add_the_answer_count,
    add_the_text_titles,
    add_the_uncategorized_deck,
]

# The card fields a caller may change with `update_card`.
CARD_FIELDS = {
    "sentence",
    "translation",
    "phrase",
    "translation_locked",
    "flagged",
    "hidden",
    "due_date",
    "due_at",
    "interval_days",
    "answers",
}


def database_file(path: str | None = None) -> Path:
    """The database file: `DATABASE_PATH`, relative to the repository root unless it is absolute."""
    file = Path(path if path is not None else get_settings().database_path)
    return file if file.is_absolute() else REPOSITORY_ROOT / file


def connect(path: str | None = None) -> sqlite3.Connection:
    """Open the database, creating its folder if needed. The tables are created by `init_db`."""
    file = database_file(path)
    file.parent.mkdir(parents=True, exist_ok=True)
    # One connection serves one request, but FastAPI may open it, use it and close it in
    # different worker threads, so SQLite must not insist on a single thread.
    connection = sqlite3.connect(file, check_same_thread=False)
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


LIBRARY_HEADER = "X-Library-Code"
LIBRARY_CODE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")

# The libraries that this process already brought to the latest version, so that it does it once for each.
_ready_libraries: set[str] = set()
_ready_lock = threading.Lock()


def library_code(request: Request) -> str | None:
    """The code the request carries in `X-Library-Code`, or None when it carries none. A code that is not a
    lowercase UUID is refused (400), so a code can never name a file outside the libraries folder."""
    code = request.headers.get(LIBRARY_HEADER)
    if code is None:
        return None
    if not LIBRARY_CODE.fullmatch(code):
        raise HTTPException(status_code=400, detail="The library code is not valid.")
    return code


def library_file(code: str) -> Path:
    """The database file of the library with this code, next to the default database file."""
    return database_file().parent / "libraries" / f"{code}.db"


def library_exists(code: str) -> bool:
    return library_file(code).is_file()


def get_connection(request: Request) -> Iterator[sqlite3.Connection]:
    """A connection for one request, closed afterwards. Use it with `Depends`.

    A request with a library code gets the database file of that library, made at the first request with the code.
    A request without a code gets the default database file (`DATABASE_PATH`), the one the product had before the
    libraries, which the API tools and the tests use.
    """
    code = library_code(request)
    if code is None:
        connection = connect()
    else:
        connection = connect(str(library_file(code)))
        with _ready_lock:
            if code not in _ready_libraries:
                init_db(connection)
                _ready_libraries.add(code)
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
    title: str | None = None,
) -> int:
    """Save a text with its marked words, and return the text's id. Without a title, the text gets its first words."""
    cursor = connection.execute(
        "INSERT INTO texts (title, text, text_language, first_language) VALUES (?, ?, ?, ?)",
        (title or title_from_text(text), text, text_language, first_language),
    )
    text_id = cursor.lastrowid
    connection.executemany(
        "INSERT OR IGNORE INTO marked_words (text_id, word) VALUES (?, ?)",
        [(text_id, word) for word in words],
    )
    connection.commit()
    return text_id


def marked_words_of(connection: sqlite3.Connection, text_id: int) -> list[dict]:
    """The marked words of a text, in the order they were marked, each with the id of its card or None."""
    rows = connection.execute(
        "SELECT m.word, m.card_id, c.sentence, c.translation FROM marked_words m"
        " LEFT JOIN cards c ON c.id = m.card_id WHERE m.text_id = ? ORDER BY m.id",
        (text_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def text_summary(row: sqlite3.Row, marks: list[dict]) -> dict:
    return {
        **dict(row),
        "words": [mark["word"] for mark in marks],
        "words_with_cards": [mark["word"] for mark in marks if mark["card_id"] is not None],
        # Each marked word with its card, or with no card (issue #204).
        "marks": [
            {
                "word": mark["word"],
                "card": None
                if mark["card_id"] is None
                else {
                    "id": mark["card_id"],
                    "sentence": mark["sentence"],
                    "translation": mark["translation"],
                },
            }
            for mark in marks
        ],
        "cards": len({mark["card_id"] for mark in marks if mark["card_id"] is not None}),
    }


def get_text(connection: sqlite3.Connection, text_id: int) -> dict | None:
    row = connection.execute("SELECT * FROM texts WHERE id = ?", (text_id,)).fetchone()
    if row is None:
        return None
    return text_summary(row, marked_words_of(connection, text_id))


def list_texts(connection: sqlite3.Connection) -> list[dict]:
    """Every text, the newest first, each with its marked words and the number of its cards."""
    rows = connection.execute("SELECT * FROM texts ORDER BY id DESC").fetchall()
    return [text_summary(row, marked_words_of(connection, row["id"])) for row in rows]


class UnknownText(ValueError):
    """A text id that does not exist."""


class InvalidTextTitle(ValueError):
    """The title of a text is empty or longer than `TEXT_TITLE_LENGTH` characters."""


class InvalidText(ValueError):
    """The text is empty or longer than `TEXT_LENGTH` characters."""


class MarkNotInText(ValueError):
    """A word the learner marked is not in the text."""


_LETTER = r"(?:[^\W\d_]|[\u0300-\u036f])"
_WORD = re.compile(rf"{_LETTER}+(?:['’-]{_LETTER}+)*")


def words_of(text: str) -> list[str]:
    """The words of a text, in lower case and in order: letters of any alphabet, with the marks and the apostrophes or
    hyphens inside a word. It reads the text as the text page does."""
    return [match.group(0).casefold() for match in _WORD.finditer(text)]


def mark_is_in(word: str, words: list[str]) -> bool:
    """Is a marked item in the words of a text? An item of several words ("stimmt zu") is in the text when its words
    are, whatever the case of the letters, in this order and with other words allowed between them."""
    position = 0
    for part in word.split():
        try:
            position = words.index(part.casefold(), position) + 1
        except ValueError:
            return False
    return True


def update_text(
    connection: sqlite3.Connection,
    text_id: int,
    title: str | None = None,
    text: str | None = None,
    words: list[str] | None = None,
) -> list[str]:
    """Change the title, the text or the marked words of a text, and return the marks the new text took away.

    Only what is given changes. A mark whose word is no longer in the text is removed: the learner's edit took the word
    out. Cards are never touched: a card keeps its sentence, translation and study data (DEC-064). When `words` is
    given it is the whole list of marks the text keeps, so a word left out loses its mark too. A mark that stays keeps
    its card.
    """
    row = connection.execute("SELECT * FROM texts WHERE id = ?", (text_id,)).fetchone()
    if row is None:
        raise UnknownText(text_id)
    if title is not None:
        title = " ".join(title.split())
        if not title or len(title) > TEXT_TITLE_LENGTH:
            raise InvalidTextTitle(title)
    if text is not None and (not text.strip() or len(text) > TEXT_LENGTH):
        raise InvalidText(text)
    new_text = row["text"] if text is None else text
    in_text = words_of(new_text)
    marks = marked_words_of(connection, text_id)
    target = [mark["word"] for mark in marks if mark_is_in(mark["word"], in_text)]
    lost = [mark["word"] for mark in marks if mark["word"] not in target]
    if words is not None:
        for word in words:
            if not mark_is_in(word, in_text):
                raise MarkNotInText(word)
        target = list(words)
    keep = {word.casefold() for word in target}
    try:
        for mark in marks:
            if mark["word"].casefold() not in keep:
                connection.execute(
                    "DELETE FROM marked_words WHERE text_id = ? AND word = ?",
                    (text_id, mark["word"]),
                )
        have = {mark["word"].casefold() for mark in marks}
        for word in target:
            if word.casefold() not in have:
                connection.execute(
                    "INSERT OR IGNORE INTO marked_words (text_id, word) VALUES (?, ?)",
                    (text_id, word),
                )
        connection.execute(
            "UPDATE texts SET title = ?, text = ? WHERE id = ?",
            (row["title"] if title is None else title, new_text, text_id),
        )
    except BaseException:
        connection.rollback()
        raise
    connection.commit()
    return lost if text is not None else []


def delete_text(connection: sqlite3.Connection, text_id: int) -> bool:
    """Delete a text and its marks. The cards stay, with their decks and study data (DEC-064): a card does not belong
    to a text. Returns False when the text does not exist."""
    cursor = connection.execute("DELETE FROM texts WHERE id = ?", (text_id,))
    connection.commit()
    return cursor.rowcount == 1


class InvalidDeckTitle(ValueError):
    """The title of a deck is empty or longer than `DECK_TITLE_LENGTH` characters."""


class DeckExists(ValueError):
    """A deck with this title already exists for the language pair, whatever the case of the letters."""


class UnknownDeck(ValueError):
    """A deck id that does not exist."""


class DeckPairMismatch(ValueError):
    """A deck is for another language pair than the card (or the text) it is used with."""


class UncategorizedDeck(ValueError):
    """The deck "Uncategorized" cannot be renamed, and a card is put in it only when it is in no other deck."""


class DeckNeedsChoice(ValueError):
    """The deck has cards that are in no other deck, and the learner did not say what to do with them."""


DECK_TITLE_LENGTH = 60


def clean_deck_title(title: str) -> str:
    """The title with its spaces made one, or `InvalidDeckTitle` when it is empty or too long."""
    cleaned = " ".join(title.split())
    if not cleaned or len(cleaned) > DECK_TITLE_LENGTH:
        raise InvalidDeckTitle(f"A deck title is 1 to {DECK_TITLE_LENGTH} characters.")
    return cleaned


def find_deck_by_title(
    connection: sqlite3.Connection, title: str, text_language: str, first_language: str
) -> dict | None:
    """The deck of the language pair with this title, whatever the case of the letters and the spaces, or None."""
    wanted = " ".join(title.split()).casefold()
    rows = connection.execute(
        "SELECT * FROM decks WHERE text_language = ? AND first_language = ?",
        (text_language, first_language),
    )
    for row in rows:
        if " ".join(row["title"].split()).casefold() == wanted:
            return dict(row)
    return None


def uncategorized_deck_id(
    connection: sqlite3.Connection, text_language: str, first_language: str
) -> int:
    """The id of the deck "Uncategorized" of a language pair, made when it does not exist, without saving.

    A deck that the learner already titled "Uncategorized" for the pair is the one marked, so no second deck with that
    title is made.
    """
    row = connection.execute(
        "SELECT id FROM decks WHERE uncategorized = 1 AND text_language = ? AND first_language = ?",
        (text_language, first_language),
    ).fetchone()
    if row:
        return row["id"]
    same_title = find_deck_by_title(connection, UNCATEGORIZED_TITLE, text_language, first_language)
    if same_title:
        connection.execute("UPDATE decks SET uncategorized = 1 WHERE id = ?", (same_title["id"],))
        return same_title["id"]
    cursor = connection.execute(
        "INSERT INTO decks (title, text_language, first_language, uncategorized) VALUES (?, ?, ?, 1)",
        (UNCATEGORIZED_TITLE, text_language, first_language),
    )
    return cursor.lastrowid


def put_cards_in_no_deck_in_uncategorized(
    connection: sqlite3.Connection, card_ids: list[int]
) -> None:
    """Put each of these cards that is in no deck into the deck "Uncategorized" of its language pair, without saving."""
    for card_id in card_ids:
        if connection.execute("SELECT 1 FROM card_decks WHERE card_id = ?", (card_id,)).fetchone():
            continue
        card = connection.execute(
            "SELECT text_language, first_language FROM cards WHERE id = ?", (card_id,)
        ).fetchone()
        deck_id = uncategorized_deck_id(connection, card["text_language"], card["first_language"])
        connection.execute(
            "INSERT INTO card_decks (card_id, deck_id) VALUES (?, ?)", (card_id, deck_id)
        )


def create_deck(
    connection: sqlite3.Connection, title: str, text_language: str, first_language: str
) -> dict:
    """Make an empty deck for a language pair. Raises `InvalidDeckTitle` or `DeckExists`; then nothing is saved."""
    cleaned = clean_deck_title(title)
    if find_deck_by_title(connection, cleaned, text_language, first_language):
        raise DeckExists("There is already a deck with this title for these languages.")
    cursor = connection.execute(
        "INSERT INTO decks (title, text_language, first_language) VALUES (?, ?, ?)",
        (cleaned, text_language, first_language),
    )
    connection.commit()
    return get_deck(connection, cursor.lastrowid)


def get_deck(connection: sqlite3.Connection, deck_id: int) -> dict | None:
    row = connection.execute(
        "SELECT decks.*, (SELECT COUNT(*) FROM card_decks WHERE deck_id = decks.id) AS card_count"
        " FROM decks WHERE id = ?",
        (deck_id,),
    ).fetchone()
    return dict(row) if row else None


def deck_only_cards(connection: sqlite3.Connection, deck_id: int) -> list[int]:
    """The ids of the cards that are in this deck and in no other."""
    rows = connection.execute(
        "SELECT card_id FROM card_decks WHERE deck_id = ?"
        " AND card_id NOT IN (SELECT card_id FROM card_decks WHERE deck_id <> ?) ORDER BY card_id",
        (deck_id, deck_id),
    )
    return [row["card_id"] for row in rows]


def get_deck_for_deleting(connection: sqlite3.Connection, deck_id: int) -> dict | None:
    """The deck with `cards_only_here`, how many of its cards are in no other deck, and `cards_elsewhere`, how many
    are also in another deck: what the learner needs to know to delete it."""
    deck = get_deck(connection, deck_id)
    if deck is None:
        return None
    only = len(deck_only_cards(connection, deck_id))
    return {**deck, "cards_only_here": only, "cards_elsewhere": deck["card_count"] - only}


def rename_deck(connection: sqlite3.Connection, deck_id: int, title: str) -> dict | None:
    """Change the title of a deck, with the rules of a new deck's title. Returns None when the deck does not exist.

    Raises `UncategorizedDeck` for the deck "Uncategorized", `InvalidDeckTitle`, or `DeckExists` when another deck of
    the language pair has the title (the same deck may change the case of its letters).
    """
    deck = get_deck(connection, deck_id)
    if deck is None:
        return None
    if deck["uncategorized"]:
        raise UncategorizedDeck("The deck Uncategorized cannot be renamed.")
    cleaned = clean_deck_title(title)
    other = find_deck_by_title(connection, cleaned, deck["text_language"], deck["first_language"])
    if other and other["id"] != deck_id:
        raise DeckExists("There is already a deck with this title for these languages.")
    connection.execute("UPDATE decks SET title = ? WHERE id = ?", (cleaned, deck_id))
    connection.commit()
    return get_deck(connection, deck_id)


def delete_deck(connection: sqlite3.Connection, deck_id: int, cards: str | None = None) -> bool:
    """Delete a deck (DEC-065). Returns False when the deck does not exist.

    The cards that are also in another deck stay in it and are never deleted. The cards that are in no other deck are
    deleted when `cards` is "delete", or put in the deck "Uncategorized" of their language pair, made if it does not
    exist, when `cards` is "keep". Raises `DeckNeedsChoice`, and changes nothing, when there are such cards and `cards`
    is neither. The deck "Uncategorized" can only be deleted together with its cards. When anything fails, nothing is
    saved.
    """
    deck = get_deck(connection, deck_id)
    if deck is None:
        return False
    only = deck_only_cards(connection, deck_id)
    if only and deck["uncategorized"] and cards != "delete":
        raise DeckNeedsChoice("The deck Uncategorized can only be deleted together with its cards.")
    if only and cards not in ("delete", "keep"):
        raise DeckNeedsChoice(
            f"{len(only)} cards are only in this deck: choose to delete them or to keep them in Uncategorized."
        )
    try:
        if only and cards == "delete":
            marks = ", ".join("?" for _ in only)
            connection.execute(f"DELETE FROM cards WHERE id IN ({marks})", only)
        elif only:
            target = uncategorized_deck_id(
                connection, deck["text_language"], deck["first_language"]
            )
            for card_id in only:
                connection.execute(
                    "INSERT INTO card_decks (card_id, deck_id) VALUES (?, ?)", (card_id, target)
                )
        connection.execute("DELETE FROM decks WHERE id = ?", (deck_id,))
    except BaseException:
        connection.rollback()
        raise
    connection.commit()
    return True


def list_decks(
    connection: sqlite3.Connection,
    text_language: str | None = None,
    first_language: str | None = None,
) -> list[dict]:
    """The decks, each with its number of cards and `learned_percent`, newest first.

    `learned_percent` is the share of the deck's visible cards that were answered at least once and are not forgotten.
    Both languages together keep only that language pair.
    """
    rows = connection.execute(
        "SELECT decks.*, (SELECT COUNT(*) FROM card_decks WHERE deck_id = decks.id) AS card_count,"
        " (SELECT COUNT(*) FROM card_decks JOIN cards ON cards.id = card_decks.card_id"
        "  WHERE card_decks.deck_id = decks.id AND cards.hidden = 0) AS visible_count,"
        " (SELECT COUNT(*) FROM card_decks JOIN cards ON cards.id = card_decks.card_id"
        "  WHERE card_decks.deck_id = decks.id AND cards.hidden = 0"
        "  AND cards.answers > 0 AND cards.interval_days > 0) AS learned_count FROM decks"
        " WHERE (? IS NULL OR text_language = ?) AND (? IS NULL OR first_language = ?)"
        " ORDER BY id DESC",
        (text_language, text_language, first_language, first_language),
    ).fetchall()
    decks = []
    for row in rows:
        deck = dict(row)
        visible, learned = deck.pop("visible_count"), deck.pop("learned_count")
        deck["learned_percent"] = round(100 * learned / visible) if visible else 0
        decks.append(deck)
    return decks


def link_to_decks(connection: sqlite3.Connection, card_ids: list[int], deck_ids: list[int]) -> None:
    """Put each card in each deck, without saving. A card that is already in a deck stays there once.

    A card that goes into a deck leaves the deck "Uncategorized". Raises `UnknownDeck`, `UncategorizedDeck` when a deck is
    the one called "Uncategorized", or `DeckPairMismatch` when a deck is for another language pair than a card.
    """
    for deck_id in dict.fromkeys(deck_ids):
        deck = connection.execute("SELECT * FROM decks WHERE id = ?", (deck_id,)).fetchone()
        if deck is None:
            raise UnknownDeck(f"There is no deck with id {deck_id}.")
        if deck["uncategorized"]:
            raise UncategorizedDeck(
                "A card goes to Uncategorized only when it is in no other deck, so it is not chosen."
            )
        for card_id in card_ids:
            card = connection.execute(
                "SELECT text_language, first_language FROM cards WHERE id = ?", (card_id,)
            ).fetchone()
            if (card["text_language"], card["first_language"]) != (
                deck["text_language"],
                deck["first_language"],
            ):
                raise DeckPairMismatch("A deck only takes cards of its own language pair.")
            connection.execute(
                "INSERT OR IGNORE INTO card_decks (card_id, deck_id) VALUES (?, ?)",
                (card_id, deck_id),
            )
            connection.execute(
                "DELETE FROM card_decks WHERE card_id = ?"
                " AND deck_id IN (SELECT id FROM decks WHERE uncategorized = 1)",
                (card_id,),
            )


def add_cards_to_decks(
    connection: sqlite3.Connection, card_ids: list[int], deck_ids: list[int]
) -> None:
    """Put cards in decks and save. When something is wrong, nothing is saved."""
    try:
        link_to_decks(connection, card_ids, deck_ids)
    except BaseException:
        connection.rollback()
        raise
    connection.commit()


def change_card_decks(
    connection: sqlite3.Connection,
    card_ids: list[int],
    add_deck_ids: list[int],
    remove_deck_ids: list[int],
) -> bool:
    """Put cards in some decks and take them out of others, in one step. Only the link between a card and a deck changes:
    the card keeps its sentence, its translation and its study data.

    Returns False, and changes nothing, when a card does not exist. A card taken out of its last deck goes to the deck
    "Uncategorized" of its language pair, and a card put in a deck leaves it. Raises `UnknownDeck`, `UncategorizedDeck`
    when a deck to add is the one called "Uncategorized", or `DeckPairMismatch` when a deck to add is for another language
    pair than a card, and then nothing is saved either.
    """
    ids = list(dict.fromkeys(card_ids))
    marks = ", ".join("?" for _ in ids)
    found = connection.execute(f"SELECT COUNT(*) FROM cards WHERE id IN ({marks})", ids).fetchone()[
        0
    ]
    if found != len(ids):
        return False
    try:
        link_to_decks(connection, ids, add_deck_ids)
        for deck_id in dict.fromkeys(remove_deck_ids):
            if (
                connection.execute("SELECT 1 FROM decks WHERE id = ?", (deck_id,)).fetchone()
                is None
            ):
                raise UnknownDeck(f"There is no deck with id {deck_id}.")
            connection.execute(
                f"DELETE FROM card_decks WHERE deck_id = ? AND card_id IN ({marks})",
                [deck_id, *ids],
            )
        put_cards_in_no_deck_in_uncategorized(connection, ids)
    except BaseException:
        connection.rollback()
        raise
    connection.commit()
    return True


def attach_decks(connection: sqlite3.Connection, cards: list[dict]) -> list[dict]:
    """Add `decks` (id and title, newest deck first) and `texts` (the texts that still have its word, newest first) to
    each card."""
    if not cards:
        return cards
    marks = ", ".join("?" for _ in cards)
    rows = connection.execute(
        "SELECT card_decks.card_id, decks.id, decks.title FROM card_decks JOIN decks ON decks.id = card_decks.deck_id"
        f" WHERE card_decks.card_id IN ({marks}) ORDER BY decks.id DESC",
        [card["id"] for card in cards],
    )
    by_card: dict[int, list[dict]] = {card["id"]: [] for card in cards}
    for row in rows:
        by_card[row["card_id"]].append({"id": row["id"], "title": row["title"]})
    origins = connection.execute(
        "SELECT marked_words.card_id, texts.id, texts.title FROM marked_words"
        " JOIN texts ON texts.id = marked_words.text_id"
        f" WHERE marked_words.card_id IN ({marks}) ORDER BY texts.id DESC",
        [card["id"] for card in cards],
    )
    texts_of: dict[int, list[dict]] = {card["id"]: [] for card in cards}
    for row in origins:
        item = {"id": row["id"], "title": row["title"]}
        if item not in texts_of[row["card_id"]]:
            texts_of[row["card_id"]].append(item)
    return [{**card, "decks": by_card[card["id"]], "texts": texts_of[card["id"]]} for card in cards]


def deck_filter(deck_ids: list[int] | None) -> tuple[str, list[int]]:
    """The SQL that keeps the cards in at least one of the decks, and its values. None keeps every card; an empty list
    keeps none."""
    if deck_ids is None:
        return "", []
    marks = ", ".join("?" for _ in deck_ids)
    return f" AND cards.id IN (SELECT card_id FROM card_decks WHERE deck_id IN ({marks}))", list(
        deck_ids
    )


def add_card(
    connection: sqlite3.Connection,
    text_id: int,
    word: str,
    sentence: str | None,
    translation: str | None,
    today: date,
    phrase: str | None = None,
    deck_ids: list[int] | tuple[int, ...] = (),
) -> int:
    """Add a card for a marked word of a text, in the given decks. A new card is due on `today`.

    The card gets the languages of the text, and the marked word points to it. When a deck does not exist or is for
    another language pair, nothing is saved.
    """
    text = connection.execute("SELECT * FROM texts WHERE id = ?", (text_id,)).fetchone()
    try:
        cursor = connection.execute(
            "INSERT INTO cards (text_language, first_language, word, sentence, translation, due_date, phrase)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                text["text_language"],
                text["first_language"],
                word,
                sentence,
                translation,
                today.isoformat(),
                phrase,
            ),
        )
        card_id = cursor.lastrowid
        connection.execute(
            "UPDATE cards SET due_at = ? WHERE id = ?", (default_due_time(today, card_id), card_id)
        )
        connection.execute(
            "UPDATE marked_words SET card_id = ? WHERE text_id = ? AND word = ?",
            (card_id, text_id, word),
        )
        link_to_decks(connection, [card_id], list(deck_ids))
    except BaseException:
        connection.rollback()
        raise
    connection.commit()
    return card_id


def link_word_to_card(
    connection: sqlite3.Connection, text_id: int, word: str, card_id: int
) -> None:
    """Make the marked word of a text point to an existing card, so the text shows that card for the word."""
    connection.execute(
        "UPDATE marked_words SET card_id = ? WHERE text_id = ? AND word = ?",
        (card_id, text_id, word),
    )
    connection.commit()


def card_of_marked_word(connection: sqlite3.Connection, text_id: int, word: str) -> dict | None:
    """The card a marked word of a text points to, or None."""
    row = connection.execute(
        "SELECT cards.* FROM marked_words JOIN cards ON cards.id = marked_words.card_id"
        " WHERE marked_words.text_id = ? AND marked_words.word = ?",
        (text_id, word),
    ).fetchone()
    return dict(row) if row else None


def text_for_card(connection: sqlite3.Connection, card: dict) -> dict:
    """What the model needs to write a sentence for a card: its languages and the newest text it was marked in.

    A card forgets its text (DEC-020), so the text is only a source of context: a card whose marked word is gone
    gets an empty text, and the model writes the sentence without a passage.
    """
    row = connection.execute(
        "SELECT texts.text FROM marked_words JOIN texts ON texts.id = marked_words.text_id"
        " WHERE marked_words.card_id = ? ORDER BY texts.id DESC LIMIT 1",
        (card["id"],),
    ).fetchone()
    return {
        "text": row["text"] if row else "",
        "text_language": card["text_language"],
        "first_language": card["first_language"],
    }


def get_card(connection: sqlite3.Connection, card_id: int) -> dict | None:
    row = connection.execute("SELECT * FROM cards WHERE id = ?", (card_id,)).fetchone()
    return attach_decks(connection, [dict(row)])[0] if row else None


def pair_filter(pair: tuple[str, str] | None) -> tuple[str, list[str]]:
    """The SQL that keeps the cards of a language pair (text language, first language), and its values."""
    if pair is None:
        return "", []
    return " AND text_language = ? AND first_language = ?", [pair[0], pair[1]]


def phrases_of_word(
    connection: sqlite3.Connection,
    word: str,
    except_card_id: int | None = None,
    pair: tuple[str, str] | None = None,
) -> list[str]:
    """The phrases of the cards for `word`, whatever the case of the word, in the order the cards were made.

    With `pair`, only the cards of that language pair count."""
    where, values = pair_filter(pair)
    rows = connection.execute(
        f"SELECT id, word, phrase FROM cards WHERE phrase IS NOT NULL{where} ORDER BY id", values
    ).fetchall()
    return [
        row["phrase"]
        for row in rows
        if row["word"].casefold() == word.casefold() and row["id"] != except_card_id
    ]


def meanings_of_word(
    connection: sqlite3.Connection,
    word: str,
    except_card_id: int | None = None,
    pair: tuple[str, str] | None = None,
) -> dict[str, str]:
    """Like `phrases_of_word`, with the translation of the card's sentence for each phrase ("" when it has none), so
    that the language model sees what the word means on each card and not only three or four words."""
    where, values = pair_filter(pair)
    rows = connection.execute(
        f"SELECT id, word, phrase, translation FROM cards WHERE phrase IS NOT NULL{where} ORDER BY id",
        values,
    ).fetchall()
    return {
        row["phrase"]: row["translation"] or ""
        for row in rows
        if row["word"].casefold() == word.casefold() and row["id"] != except_card_id
    }


def find_card_by_phrase(
    connection: sqlite3.Connection,
    word: str,
    phrase: str,
    except_card_id: int | None = None,
    pair: tuple[str, str] | None = None,
) -> dict | None:
    """The card for `word` whose phrase is `phrase`, or None. The case of the letters and the spaces do not matter, so
    "den Zug nehmen" and "Den Zug  nehmen" are the same phrase. `except_card_id` leaves out the card being changed,
    and `pair` keeps only the cards of a language pair."""
    where, values = pair_filter(pair)
    rows = connection.execute(
        f"SELECT * FROM cards WHERE phrase IS NOT NULL{where} ORDER BY id", values
    )
    for row in rows:
        is_another_card = row["id"] != except_card_id
        if (
            is_another_card
            and row["word"].casefold() == word.casefold()
            and same_phrase(row["phrase"], phrase)
        ):
            return dict(row)
    return None


def list_cards(connection: sqlite3.Connection, text_id: int) -> list[dict]:
    """The cards of the marked words of a text, in the order the words were marked."""
    rows = connection.execute(
        "SELECT cards.* FROM cards JOIN marked_words ON marked_words.card_id = cards.id"
        " WHERE marked_words.text_id = ? GROUP BY cards.id ORDER BY MIN(marked_words.id)",
        (text_id,),
    ).fetchall()
    return attach_decks(connection, [dict(row) for row in rows])


def list_all_cards(connection: sqlite3.Connection) -> list[dict]:
    """Every card: the ones of the newest text first, and the words of a text in the order they were made."""
    rows = connection.execute(
        "SELECT * FROM cards ORDER BY (SELECT MAX(text_id) FROM marked_words WHERE card_id = cards.id) DESC, id"
    ).fetchall()
    return attach_decks(connection, [dict(row) for row in rows])


def list_due_cards(
    connection: sqlite3.Connection, today: date, deck_ids: list[int] | None = None
) -> list[dict]:
    """The cards to study on `today`: due today or earlier, not hidden, and with a sentence and a translation to show.

    The card with the earliest due time comes first, and cards with the same due time come in the order they were
    made. A card the model could not write a sentence for is left out until it has one. With `deck_ids`, only the
    cards in at least one of those decks are listed, each once.
    """
    where, values = deck_filter(deck_ids)
    rows = connection.execute(
        "SELECT * FROM cards WHERE due_date <= ? AND hidden = 0 AND sentence IS NOT NULL AND translation IS NOT NULL"
        f"{where} ORDER BY due_at, id",
        (today.isoformat(), *values),
    ).fetchall()
    return attach_decks(connection, [dict(row) for row in rows])


def list_queue(connection: sqlite3.Connection, deck_ids: list[int] | None = None) -> list[dict]:
    """The study queue: every card that is not hidden and has a sentence and a translation to show, in study order.

    The card with the earliest due time comes first. The cards due today or earlier are the first ones of the queue
    (`list_due_cards` gives only those); the others follow, each with the date it is due. With `deck_ids`, only the
    cards in at least one of those decks are listed, each once.
    """
    where, values = deck_filter(deck_ids)
    rows = connection.execute(
        "SELECT * FROM cards WHERE hidden = 0 AND sentence IS NOT NULL AND translation IS NOT NULL"
        f"{where} ORDER BY due_at, id",
        values,
    ).fetchall()
    return attach_decks(connection, [dict(row) for row in rows])


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
    in_order = (
        before < times[0] and all(a < b for a, b in zip(times, times[1:])) and times[-1] < after
    )
    return times if in_order else None


def reorder_queue(
    connection: sqlite3.Connection,
    card_ids: list[int],
    moved: list[int],
    today_count: int,
    today: date,
    deck_ids: list[int] | None = None,
) -> None:
    """Save a new order of the study queue, and the cards that are due today in it (DEC-021).

    `card_ids` is the whole queue in the order the learner wants it, `moved` the cards the learner moved, and the first
    `today_count` cards of the order are the ones due today. Each run of moved cards that sit one after another gets
    due times between the cards on either side of it, evenly spaced, so the queue stays sorted by due time. A moved
    card in the first part is due today (it keeps its date when that is today or earlier); a moved card in the second
    part gets the date of the card above it, and at least tomorrow, so that moving a card changes its date to fit
    its place. The other cards, and the interval of every card, are not touched. When two cards are so close that
    there is no time left between them, the cards of the order get new due times one millisecond apart, in the new
    order. With `deck_ids`, the queue is the cards of those decks, each once; the order is the one saved for every
    deck, since a card has one due time whatever the deck.
    """
    queue = list_queue(connection, deck_ids)
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
            raise InvalidMove(
                "A card that is not named as moved changed from today to later, or the reverse."
            )

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
            new_times = {
                card_id: start + timedelta(milliseconds=number)
                for number, card_id in enumerate(card_ids)
            }
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
            "UPDATE cards SET due_at = ? WHERE id = ?",
            (moment.isoformat(timespec="microseconds"), card_id),
        )
    for card_id, due_date in new_dates.items():
        connection.execute("UPDATE cards SET due_date = ? WHERE id = ?", (due_date, card_id))
    connection.commit()


def delete_card(connection: sqlite3.Connection, card_id: int) -> bool:
    """Delete one card. Returns False when the card does not exist."""
    cursor = connection.execute("DELETE FROM cards WHERE id = ?", (card_id,))
    connection.commit()
    return cursor.rowcount == 1


def set_hidden(connection: sqlite3.Connection, card_ids: list[int], hidden: bool) -> bool:
    """Hide several cards from study, or show them again, in one step. Returns False, and changes nothing, when one of
    them does not exist."""
    ids = list(dict.fromkeys(card_ids))
    marks = ", ".join("?" for _ in ids)
    found = connection.execute(f"SELECT COUNT(*) FROM cards WHERE id IN ({marks})", ids).fetchone()[
        0
    ]
    if found != len(ids):
        return False
    connection.execute(f"UPDATE cards SET hidden = ? WHERE id IN ({marks})", [int(hidden), *ids])
    connection.commit()
    return True


def delete_cards(connection: sqlite3.Connection, card_ids: list[int]) -> bool:
    """Delete several cards in one step. Returns False, and deletes nothing, when one of them does not exist."""
    ids = list(dict.fromkeys(card_ids))
    marks = ", ".join("?" for _ in ids)
    found = connection.execute(f"SELECT COUNT(*) FROM cards WHERE id IN ({marks})", ids).fetchone()[
        0
    ]
    if found != len(ids):
        return False
    connection.execute(f"DELETE FROM cards WHERE id IN ({marks})", ids)
    connection.commit()
    return True
