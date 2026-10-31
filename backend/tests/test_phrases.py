import pytest

from app.phrases import phrase_problem, same_phrase


@pytest.mark.parametrize(
    "phrase", ["den Zug nehmen", "Der Zug kommt an", "mit dem Zug", "zug fährt heute schon ab"]
)
def test_a_phrase_of_two_to_six_words_with_the_word_in_it_is_accepted(phrase: str) -> None:
    assert phrase_problem("Zug", phrase) is None


@pytest.mark.parametrize("phrase", ["Zug", "der Zug fährt heute schon wieder ab", "", "   "])
def test_a_phrase_with_too_few_or_too_many_words_is_refused(phrase: str) -> None:
    assert "2 to 6 words" in phrase_problem("Zug", phrase)


@pytest.mark.parametrize("phrase", ["den Bus nehmen", "den Zugang nehmen", "Zügen nehmen"])
def test_a_phrase_without_the_word_as_a_whole_word_is_refused(phrase: str) -> None:
    assert phrase_problem("Zug", phrase) == 'The context phrase must contain the word "Zug".'


def test_the_parts_of_a_card_word_of_several_words_must_all_be_in_the_phrase_in_order() -> None:
    assert phrase_problem("stimmt zu", "er stimmt dem Plan zu") is None
    assert phrase_problem("stimmt zu", "er zu dem Plan stimmt") is not None


def test_phrases_are_the_same_whatever_the_case_and_the_spaces() -> None:
    assert same_phrase("den Zug nehmen", "Den  Zug nehmen")
    assert not same_phrase("den Zug nehmen", "den Zug verpassen")
