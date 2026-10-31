"""The context phrase of a card (DEC-013): with the word it identifies the card, and keeps the meaning of the word."""

import re

# The model is asked for 3 or 4 words, as the Customer said ([00:47:11] of the Week 3 meeting). A learner or a teacher
# who edits the phrase may write a little fewer or more, so the product accepts 2 to 6.
FEWEST_WORDS = 2
MOST_WORDS = 6


def parts_span(text: str, parts: list[str]) -> tuple[int, int] | None:
    """Where the first part of a card word starts and the last one ends, with the parts in this order in the text.

    Each part is a whole word, whatever its case. The first appearance of the first part that has all the other
    parts after it is the one used. None when the parts do not all appear in this order.
    """
    patterns = [re.compile(rf"(?<!\w){re.escape(part)}(?!\w)", re.IGNORECASE) for part in parts]
    for first in patterns[0].finditer(text):
        end = first.end()
        for pattern in patterns[1:]:
            found = pattern.search(text, end)
            if found is None:
                break
            end = found.end()
        else:
            return first.start(), end
    return None


def phrase_problem(word: str, phrase: str) -> str | None:
    """Why a phrase cannot identify a card for `word`, as a sentence safe to show; None when it can."""
    count = len(phrase.split())
    if not FEWEST_WORDS <= count <= MOST_WORDS:
        return f"The context phrase must have {FEWEST_WORDS} to {MOST_WORDS} words, and 3 or 4 is best."
    if parts_span(phrase, word.split()) is None:
        return f'The context phrase must contain the word "{word}".'
    return None


def same_phrase(first: str, second: str) -> bool:
    """Two phrases are the same when they have the same words, whatever the case and the spaces."""
    return [part.casefold() for part in first.split()] == [
        part.casefold() for part in second.split()
    ]
