from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.llm import GeneratedSentence, LlmError, LlmNotConfigured, get_llm_client
from app.main import app
from app.routes.cards import get_today, passage_around

TODAY = date(2026, 10, 16)
TEXT = {
    "text": "Ich warte am Bahnhof auf den Zug. Das Haus ist alt.",
    "text_language": "de",
    "first_language": "en",
    "words": ["Bahnhof", "Zug", "Haus"],
}


class FakeModel:
    """Stands in for the language model: it answers from a table, or fails for the words in `failing`."""

    def __init__(self, failing: dict[str, Exception] | None = None) -> None:
        self.failing = failing or {}
        self.failing_translation: Exception | None = None
        self.calls: list[dict] = []
        self.translated: list[str] = []

    def write_sentence(
        self, word, text_language, first_language, context=None, previous_sentence=None, locked_translation=None
    ):
        self.calls.append(
            {
                "word": word,
                "context": context,
                "previous_sentence": previous_sentence,
                "locked_translation": locked_translation,
            }
        )
        if word in self.failing:
            raise self.failing[word]
        number = len(self.calls)
        return GeneratedSentence(
            f"Sentence {number} with {word}.", locked_translation or f"Translation {number} of {word}."
        )

    def translate_sentence(self, sentence, text_language, first_language):
        self.translated.append(sentence)
        if self.failing_translation:
            raise self.failing_translation
        return f"Translation of: {sentence}"


@pytest.fixture
def model() -> FakeModel:
    fake = FakeModel()
    app.dependency_overrides[get_llm_client] = lambda: fake
    app.dependency_overrides[get_today] = lambda: TODAY
    yield fake
    app.dependency_overrides.clear()


def make_cards(client: TestClient) -> list[dict]:
    text_id = client.post("/api/texts", json=TEXT).json()["id"]
    response = client.post(f"/api/texts/{text_id}/cards")
    assert response.status_code == 200
    return response.json()


def test_every_marked_word_gets_a_card_with_a_sentence_and_its_translation(model) -> None:
    with TestClient(app) as client:
        cards = make_cards(client)

        assert [card["word"] for card in cards] == ["Bahnhof", "Zug", "Haus"]
        for card in cards:
            assert card["sentence"] and card["translation"]
            assert card["error"] is None
            assert card["flagged"] is False
            assert card["due_date"] == "2026-10-16"


def test_the_cards_exist_without_a_confirmation_and_survive_a_restart(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

    with TestClient(app) as restarted:
        cards = restarted.get("/api/texts/1/cards").json()

        assert [card["word"] for card in cards] == ["Bahnhof", "Zug", "Haus"]
        assert all(card["sentence"] for card in cards)


def test_a_word_the_model_fails_for_has_no_sentence_and_the_others_keep_theirs() -> None:
    fake = FakeModel(failing={"Zug": LlmError("The language model took too long to answer.")})
    app.dependency_overrides[get_llm_client] = lambda: fake
    app.dependency_overrides[get_today] = lambda: TODAY
    try:
        with TestClient(app) as client:
            cards = {card["word"]: card for card in make_cards(client)}

            assert cards["Zug"]["sentence"] is None
            assert cards["Zug"]["translation"] is None
            assert cards["Zug"]["error"] == "The language model took too long to answer."
            assert cards["Bahnhof"]["sentence"] and cards["Haus"]["sentence"]
            assert cards["Bahnhof"]["error"] is None
    finally:
        app.dependency_overrides.clear()


def test_a_model_that_is_not_set_up_leaves_every_word_without_a_sentence_and_with_a_message() -> None:
    message = "The language model is not set up: add LLM_API_KEY and LLM_MODEL to .env."
    fake = FakeModel(failing={word: LlmNotConfigured(message) for word in TEXT["words"]})
    app.dependency_overrides[get_llm_client] = lambda: fake
    try:
        with TestClient(app) as client:
            cards = make_cards(client)

            assert [card["sentence"] for card in cards] == [None, None, None]
            assert {card["error"] for card in cards} == {message}
    finally:
        app.dependency_overrides.clear()


def test_asking_again_does_not_touch_the_cards_that_exist(model) -> None:
    with TestClient(app) as client:
        first = make_cards(client)
        second = client.post("/api/texts/1/cards").json()

        assert second == first
        assert len(model.calls) == 3


def test_the_model_gets_the_part_of_the_text_around_the_word(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        assert "Bahnhof" in model.calls[0]["context"]


def test_a_text_that_does_not_exist_is_not_found(model) -> None:
    with TestClient(app) as client:
        assert client.post("/api/texts/99/cards").status_code == 404
        assert client.get("/api/texts/99/cards").status_code == 404


def test_editing_a_sentence_changes_only_that_card_and_it_survives_a_restart(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.patch("/api/cards/2", json={"sentence": "  Der Zug kommt bald.  "})

        assert response.status_code == 200
        assert response.json()["sentence"] == "Der Zug kommt bald."

    with TestClient(app) as restarted:
        after = {card["id"]: card for card in restarted.get("/api/texts/1/cards").json()}

        assert after[2]["sentence"] == "Der Zug kommt bald."
        assert after[1] == before[0]
        assert after[3] == before[2]


def test_a_new_translation_is_made_for_an_edited_sentence(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.patch("/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof."})

        assert model.translated == ["Wir treffen uns am Bahnhof."]
        assert response.json()["translation"] == "Translation of: Wir treffen uns am Bahnhof."
        assert response.json()["translation"] != before[0]["translation"]


def test_an_unchanged_sentence_does_not_ask_the_model_again(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.patch("/api/cards/1", json={"sentence": before[0]["sentence"]})

        assert response.status_code == 200
        assert model.translated == []
        assert response.json() == before[0]


def test_when_the_translation_fails_the_card_keeps_its_sentence_and_its_translation(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        model.failing_translation = LlmError("The language model took too long to answer.")

        response = client.patch("/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof."})

        assert response.status_code == 502
        assert response.json() == {"detail": "The language model took too long to answer."}
        assert client.get("/api/texts/1/cards").json() == before

        model.failing_translation = LlmNotConfigured("The language model is not set up.")
        assert client.patch("/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof."}).status_code == 503


def test_the_learner_can_write_the_translation_and_it_is_saved_as_written(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.patch("/api/cards/1", json={"translation": "  The station.  "})

        assert response.status_code == 200
        assert response.json()["translation"] == "The station."
        assert response.json()["sentence"] == before[0]["sentence"]
        assert model.translated == []
        assert client.get("/api/texts/1/cards").json()[0]["translation"] == "The station."


def test_a_translation_written_in_the_same_save_as_a_new_sentence_is_the_one_kept(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        response = client.patch(
            "/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof.", "translation": "We meet at the station."}
        )

        assert response.json()["sentence"] == "Wir treffen uns am Bahnhof."
        assert response.json()["translation"] == "We meet at the station."
        assert model.translated == []


def test_a_translation_written_by_the_learner_is_made_again_when_the_sentence_is_edited_and_not_locked(model) -> None:
    with TestClient(app) as client:
        make_cards(client)
        client.patch("/api/cards/1", json={"translation": "The station."})

        response = client.patch("/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof."})

        assert response.json()["translation"] == "Translation of: Wir treffen uns am Bahnhof."


def test_the_learner_locks_and_unlocks_the_translation_of_a_card_with_one_click(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        assert before[0]["translation_locked"] is False
        client.patch("/api/cards/1", json={"flagged": True})

        locked = client.patch("/api/cards/1", json={"translation_locked": True}).json()

        assert locked["translation_locked"] is True
        assert locked["translation"] == before[0]["translation"]
        assert locked["sentence"] == before[0]["sentence"]
        assert locked["flagged"] is True
        assert client.get("/api/texts/1/cards").json()[0]["translation_locked"] is True
        assert client.patch("/api/cards/1", json={"translation_locked": False}).json()["translation_locked"] is False


def test_a_card_without_a_translation_cannot_be_locked() -> None:
    fake = FakeModel(failing={"Zug": LlmError("The language model took too long to answer.")})
    app.dependency_overrides[get_llm_client] = lambda: fake
    app.dependency_overrides[get_today] = lambda: TODAY
    try:
        with TestClient(app) as client:
            make_cards(client)

            response = client.patch("/api/cards/2", json={"translation_locked": True})

            assert response.status_code == 422
            assert client.get("/api/texts/1/cards").json()[1]["translation_locked"] is False
    finally:
        app.dependency_overrides.clear()


def test_a_locked_translation_stays_when_the_sentence_is_edited(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        client.patch("/api/cards/1", json={"translation_locked": True})

        response = client.patch("/api/cards/1", json={"sentence": "Wir treffen uns am Bahnhof."})

        assert response.json()["sentence"] == "Wir treffen uns am Bahnhof."
        assert response.json()["translation"] == before[0]["translation"]
        assert response.json()["translation_locked"] is True
        assert model.translated == []


def test_the_learner_can_edit_a_locked_translation_and_it_stays_locked(model) -> None:
    with TestClient(app) as client:
        make_cards(client)
        client.patch("/api/cards/1", json={"translation_locked": True})

        response = client.patch("/api/cards/1", json={"translation": "The station."})

        assert response.json()["translation"] == "The station."
        assert response.json()["translation_locked"] is True


def test_a_new_sentence_for_a_locked_card_keeps_the_translation_and_the_model_is_given_it(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        client.patch("/api/cards/1", json={"translation_locked": True})

        response = client.post("/api/cards/1/new-sentence")

        assert response.json()["sentence"] != before[0]["sentence"]
        assert response.json()["translation"] == before[0]["translation"]
        assert response.json()["translation_locked"] is True
        assert model.calls[-1]["locked_translation"] == before[0]["translation"]


def test_new_sentences_for_several_cards_keep_the_locked_translations_and_change_the_others(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        client.patch("/api/cards/1", json={"translation_locked": True})

        response = client.post("/api/cards/new-sentences", json={"card_ids": [1, 2]}).json()

        assert response[0]["translation"] == before[0]["translation"]
        assert response[0]["sentence"] != before[0]["sentence"]
        assert response[1]["translation"] != before[1]["translation"]
        assert response[1]["sentence"] != before[1]["sentence"]
        assert [call["locked_translation"] for call in model.calls[-2:]] == [before[0]["translation"], None]


def test_a_new_sentence_for_a_card_that_is_not_locked_changes_the_sentence_and_the_translation(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.post("/api/cards/1/new-sentence").json()

        assert response["sentence"] != before[0]["sentence"]
        assert response["translation"] != before[0]["translation"]
        assert model.calls[-1]["locked_translation"] is None


def test_an_empty_edit_or_an_empty_sentence_is_refused(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        assert client.patch("/api/cards/1", json={}).status_code == 422
        assert client.patch("/api/cards/1", json={"sentence": "   "}).status_code == 422
        assert client.get("/api/texts/1/cards").json() == before


def test_a_card_that_does_not_exist_is_not_found(model) -> None:
    with TestClient(app) as client:
        assert client.patch("/api/cards/99", json={"flagged": True}).status_code == 404
        assert client.post("/api/cards/99/new-sentence").status_code == 404
        assert client.delete("/api/cards/99").status_code == 404


def test_a_flag_stays_until_the_learner_edits_asks_for_a_new_sentence_or_clears_it(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        flagged = client.patch("/api/cards/1", json={"flagged": True}).json()
        assert flagged["flagged"] is True
        assert client.get("/api/texts/1/cards").json()[0]["flagged"] is True

        assert client.patch("/api/cards/1", json={"sentence": "Der Bahnhof ist groß."}).json()["flagged"] is False

        client.patch("/api/cards/2", json={"flagged": True})
        assert client.post("/api/cards/2/new-sentence").json()["flagged"] is False

        client.patch("/api/cards/3", json={"flagged": True})
        assert client.patch("/api/cards/3", json={"flagged": False}).json()["flagged"] is False


def test_flagging_one_card_does_not_flag_the_others(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        client.patch("/api/cards/2", json={"flagged": True})

        assert [card["flagged"] for card in client.get("/api/texts/1/cards").json()] == [False, True, False]


def test_a_new_sentence_replaces_only_that_card_and_the_model_is_told_the_old_one(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.post("/api/cards/2/new-sentence")

        assert response.status_code == 200
        assert response.json()["sentence"] != before[1]["sentence"]
        assert model.calls[-1]["previous_sentence"] == before[1]["sentence"]
        after = client.get("/api/texts/1/cards").json()
        assert after[0]["sentence"] == before[0]["sentence"]
        assert after[2]["sentence"] == before[2]["sentence"]


def test_when_the_model_does_not_answer_the_current_sentence_stays_and_the_message_is_shown() -> None:
    fake = FakeModel()
    app.dependency_overrides[get_llm_client] = lambda: fake
    app.dependency_overrides[get_today] = lambda: TODAY
    try:
        with TestClient(app) as client:
            before = make_cards(client)
            fake.failing = {"Zug": LlmError("The language model returned an error (status 500).")}

            response = client.post("/api/cards/2/new-sentence")

            assert response.status_code == 502
            assert response.json() == {"detail": "The language model returned an error (status 500)."}
            assert client.get("/api/texts/1/cards").json() == before

            fake.failing = {"Zug": LlmNotConfigured("The language model is not set up.")}
            assert client.post("/api/cards/2/new-sentence").status_code == 503
    finally:
        app.dependency_overrides.clear()


def test_a_card_without_a_sentence_gets_one_when_the_learner_asks_for_a_new_sentence() -> None:
    fake = FakeModel(failing={"Zug": LlmError("The language model took too long to answer.")})
    app.dependency_overrides[get_llm_client] = lambda: fake
    app.dependency_overrides[get_today] = lambda: TODAY
    try:
        with TestClient(app) as client:
            make_cards(client)
            fake.failing = {}

            response = client.post("/api/cards/2/new-sentence")

            assert response.status_code == 200
            assert response.json()["sentence"] and response.json()["translation"]
            assert fake.calls[-1]["previous_sentence"] is None
    finally:
        app.dependency_overrides.clear()


def test_deleting_a_card_removes_only_that_card(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        assert client.delete("/api/cards/2").status_code == 204

        after = client.get("/api/texts/1/cards").json()
        assert [card["word"] for card in after] == ["Bahnhof", "Haus"]
        assert after[0] == before[0] and after[1] == before[2]

    with TestClient(app) as restarted:
        assert [card["word"] for card in restarted.get("/api/texts/1/cards").json()] == ["Bahnhof", "Haus"]


def test_all_the_cards_of_all_the_texts_are_listed_with_the_newest_text_first(model) -> None:
    with TestClient(app) as client:
        assert client.get("/api/cards").json() == []

        make_cards(client)
        other = {**TEXT, "text": "Der Hund schläft.", "words": ["Hund", "schläft"]}
        other_id = client.post("/api/texts", json=other).json()["id"]
        client.post(f"/api/texts/{other_id}/cards")

        cards = client.get("/api/cards").json()

        assert [(card["text_id"], card["word"]) for card in cards] == [
            (2, "Hund"),
            (2, "schläft"),
            (1, "Bahnhof"),
            (1, "Zug"),
            (1, "Haus"),
        ]
        client.delete("/api/cards/1")
        assert "Bahnhof" not in [card["word"] for card in client.get("/api/cards").json()]


def test_the_passage_is_the_text_around_the_word_whatever_its_case() -> None:
    text = "a" * 500 + " Bahnhof " + "b" * 500

    passage = passage_around(text, "bahnhof")

    assert "Bahnhof" in passage
    assert len(passage) < len(text)
    assert passage_around("Ich warte.", "Zug") is None


def test_new_sentences_for_the_chosen_cards_replace_only_those_sentences(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)

        response = client.post("/api/cards/new-sentences", json={"card_ids": [1, 3]})

        assert response.status_code == 200
        assert [card["id"] for card in response.json()] == [1, 3]
        assert all(card["error"] is None for card in response.json())
        after = client.get("/api/texts/1/cards").json()
        assert after[0]["sentence"] != before[0]["sentence"]
        assert after[0]["translation"] != before[0]["translation"]
        assert after[1] == before[1]
        assert after[2]["sentence"] != before[2]["sentence"]
        assert [call["previous_sentence"] for call in model.calls[-2:]] == [
            before[0]["sentence"],
            before[2]["sentence"],
        ]


def test_a_card_the_model_fails_for_keeps_its_sentence_and_the_others_get_new_ones(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        model.failing = {"Zug": LlmError("The language model took too long to answer.")}

        response = client.post("/api/cards/new-sentences", json={"card_ids": [1, 2, 3]})

        assert response.status_code == 200
        errors = [card["error"] for card in response.json()]
        assert errors == [None, "The language model took too long to answer.", None]
        after = client.get("/api/texts/1/cards").json()
        assert after[1] == before[1]
        assert after[0]["sentence"] != before[0]["sentence"]
        assert after[2]["sentence"] != before[2]["sentence"]


def test_a_model_that_is_not_set_up_changes_no_card_when_asked_for_several_new_sentences(model) -> None:
    with TestClient(app) as client:
        before = make_cards(client)
        model.failing = {"Bahnhof": LlmNotConfigured("The language model is not set up.")}

        response = client.post("/api/cards/new-sentences", json={"card_ids": [1, 2]})

        assert response.status_code == 503
        assert client.get("/api/texts/1/cards").json() == before


def test_a_card_that_does_not_exist_stops_the_new_sentences_before_the_model_is_asked(model) -> None:
    with TestClient(app) as client:
        make_cards(client)
        calls = len(model.calls)

        assert client.post("/api/cards/new-sentences", json={"card_ids": [1, 99]}).status_code == 404
        assert len(model.calls) == calls


def test_the_chosen_cards_are_deleted_in_one_action_and_the_others_stay(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        response = client.post("/api/cards/delete", json={"card_ids": [1, 3]})

        assert response.status_code == 204
        assert [card["id"] for card in client.get("/api/texts/1/cards").json()] == [2]


def test_when_one_card_to_delete_does_not_exist_none_is_deleted(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        assert client.post("/api/cards/delete", json={"card_ids": [1, 99]}).status_code == 404
        assert len(client.get("/api/texts/1/cards").json()) == 3


def test_an_action_on_several_cards_needs_at_least_one_card(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        assert client.post("/api/cards/delete", json={"card_ids": []}).status_code == 422
        assert client.post("/api/cards/new-sentences", json={}).status_code == 422
        assert len(client.get("/api/texts/1/cards").json()) == 3


def test_a_hidden_card_stays_in_its_place_in_the_cards_table_but_is_not_studied(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        hidden = client.patch("/api/cards/2", json={"hidden": True})

        assert hidden.json()["hidden"] is True
        cards = client.get("/api/cards").json()
        assert [card["id"] for card in client.get("/api/texts/1/cards").json()] == [1, 2, 3]
        assert [(card["id"], card["hidden"]) for card in cards] == [(1, False), (2, True), (3, False)]
        assert [card["word"] for card in client.get("/api/study/due").json()] == ["Bahnhof", "Haus"]


def test_a_hidden_card_that_is_shown_again_comes_back_to_the_study_session(model) -> None:
    with TestClient(app) as client:
        make_cards(client)
        client.patch("/api/cards/2", json={"hidden": True})

        shown = client.patch("/api/cards/2", json={"hidden": False})

        assert shown.json()["hidden"] is False
        assert [card["word"] for card in client.get("/api/study/due").json()] == ["Bahnhof", "Zug", "Haus"]


def test_several_cards_are_hidden_in_one_action_and_shown_again_in_one_action(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        hidden = client.post("/api/cards/hidden", json={"card_ids": [1, 3], "hidden": True})

        assert hidden.status_code == 200
        assert [(card["id"], card["hidden"]) for card in hidden.json()] == [(1, True), (3, True)]
        assert [card["word"] for card in client.get("/api/study/due").json()] == ["Zug"]
        assert [card["id"] for card in client.get("/api/texts/1/cards").json()] == [1, 2, 3]

        shown = client.post("/api/cards/hidden", json={"card_ids": [1, 3], "hidden": False})

        assert [card["hidden"] for card in shown.json()] == [False, False]
        assert [card["word"] for card in client.get("/api/study/due").json()] == ["Bahnhof", "Zug", "Haus"]


def test_when_one_card_to_hide_does_not_exist_none_is_hidden(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        assert client.post("/api/cards/hidden", json={"card_ids": [1, 99], "hidden": True}).status_code == 404
        assert [card["hidden"] for card in client.get("/api/cards").json()] == [False, False, False]


def test_hiding_several_cards_needs_at_least_one_card_and_says_whether_to_hide_or_show(model) -> None:
    with TestClient(app) as client:
        make_cards(client)

        assert client.post("/api/cards/hidden", json={"card_ids": [], "hidden": True}).status_code == 422
        assert client.post("/api/cards/hidden", json={"card_ids": [1]}).status_code == 422


def test_editing_the_sentence_of_a_hidden_card_keeps_it_hidden(model) -> None:
    with TestClient(app) as client:
        make_cards(client)
        client.patch("/api/cards/2", json={"hidden": True})

        response = client.patch("/api/cards/2", json={"sentence": "Der Zug ist spät."})

        assert response.json()["hidden"] is True


def test_the_passage_of_a_card_word_of_several_words_runs_from_its_first_part_to_its_last() -> None:
    text = "a" * 500 + " Putin stimmt Wiederaufnahme von Gesprächen zu. " + "b" * 500

    passage = passage_around(text, "stimmt zu")

    assert "stimmt Wiederaufnahme von Gesprächen zu" in passage
    assert len(passage) < len(text)


def test_the_parts_of_a_card_word_must_all_be_in_the_text_in_this_order() -> None:
    assert passage_around("Er stimmt dem Plan zu.", "STIMMT zu") is not None
    assert passage_around("Er stimmt dem Plan zu.", "zu stimmt") is None
    assert passage_around("Er stimmt dem Plan.", "stimmt zu") is None


def test_a_part_of_a_card_word_is_a_whole_word_of_the_text() -> None:
    # "zu" is inside "Zug", but it is not the word "zu".
    assert passage_around("Er stimmt dem Zug", "stimmt zu") is None


def test_a_card_word_of_several_words_gets_a_card_and_the_model_gets_the_passage_around_its_parts(model) -> None:
    text = {**TEXT, "text": "Putin stimmt der Wiederaufnahme von Gesprächen zu.", "words": ["stimmt zu", "Gesprächen"]}
    with TestClient(app) as client:
        text_id = client.post("/api/texts", json=text).json()["id"]
        cards = client.post(f"/api/texts/{text_id}/cards").json()

    assert [card["word"] for card in cards] == ["stimmt zu", "Gesprächen"]
    assert "stimmt der Wiederaufnahme von Gesprächen zu" in model.calls[0]["context"]
    assert model.calls[0]["word"] == "stimmt zu"
