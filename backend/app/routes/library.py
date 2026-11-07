"""The library of a learner: one database file for each library code."""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.database import connect, library_code, library_exists, library_file

router = APIRouter()


class LibraryResponse(BaseModel):
    cards: int
    decks: int


@router.get("/api/library")
def read_library(request: Request) -> LibraryResponse:
    """How many cards and decks the library of the code in `X-Library-Code` has. A code without a library is refused
    (404) and no library is made, so a mistyped code does not open an empty library."""
    code = library_code(request)
    if code is None:
        raise HTTPException(status_code=400, detail="The request has no library code.")
    if not library_exists(code):
        raise HTTPException(status_code=404, detail="There is no library with this code.")
    connection = connect(str(library_file(code)))
    try:
        cards = connection.execute("SELECT COUNT(*) FROM cards").fetchone()[0]
        decks = connection.execute("SELECT COUNT(*) FROM decks").fetchone()[0]
    except Exception:
        # The file exists but has not got its tables yet, so the library is empty.
        cards = decks = 0
    finally:
        connection.close()
    return LibraryResponse(cards=cards, decks=decks)
