from datetime import date, datetime, timedelta

from fastapi.testclient import TestClient

from app.database import add_card, connect, get_card, save_text, times_between, update_card
from app.main import app
from app.routes.cards import get_today

TODAY = date(2026, 10, 16)


def add_cards(*cards: tuple[str, str | None, str | None, date]) -> list[int]:
    """Put cards in the database (word, sentence, translation, due date); return their ids."""
    connection = connect()
    try:
        text_id = save_text(
            connection, "Ich warte am Bahnhof.", "de", "en", [word for word, *_ in cards]
        )
        return [
            add_card(connection, text_id, word, sentence, translation, due)
            for word, sentence, translation, due in cards
        ]
    finally:
        connection.close()


def add_two_texts(
    first: list[str], second: list[str], due: date = TODAY
) -> tuple[list[int], list[int]]:
    """Put two texts in the database, each with a card for each of its words, all due on `due`; return the card ids."""
    connection = connect()
    try:
        ids = []
        for words in (first, second):
            text_id = save_text(connection, "Ich warte am Bahnhof.", "de", "en", words)
            ids.append(
                [
                    add_card(connection, text_id, word, f"{word}.", f"{word} (en).", due)
                    for word in words
                ]
            )
        return ids[0], ids[1]
    finally:
        connection.close()


def study_client() -> TestClient:
    app.dependency_overrides[get_today] = lambda: TODAY
    return TestClient(app)


def teardown_function() -> None:
    app.dependency_overrides.clear()


def card(
    word: str,
    due: date,
    sentence: str | None = "A sentence.",
    translation: str | None = "A translation.",
):
    return (word, sentence, translation, due)


def test_only_the_cards_due_today_or_earlier_are_in_the_session() -> None:
    with study_client() as client:
        add_cards(
            card("Bahnhof", TODAY - timedelta(days=2)),
            card("Zug", TODAY),
            card("Haus", TODAY + timedelta(days=3)),
        )

        response = client.get("/api/study/due")

        assert response.status_code == 200
        assert [item["word"] for item in response.json()] == ["Bahnhof", "Zug"]


def test_the_session_has_the_sentence_and_the_translation_of_each_card() -> None:
    with study_client() as client:
        add_cards(("Zug", "Der Zug kommt.", "The train comes.", TODAY))

        assert client.get("/api/study/due").json() == [
            {
                "id": 1,
                "text_id": 1,
                "word": "Zug",
                "sentence": "Der Zug kommt.",
                "translation": "The train comes.",
                "due_date": "2026-10-16",
                "forecast": {
                    "again": {"interval_days": 0, "due_date": "2026-10-16"},
                    "hard": {"interval_days": 1, "due_date": "2026-10-17"},
                    "good": {"interval_days": 2, "due_date": "2026-10-18"},
                    "easy": {"interval_days": 4, "due_date": "2026-10-20"},
                },
            }
        ]


def test_a_card_without_a_sentence_is_not_studied() -> None:
    with study_client() as client:
        add_cards(("Zug", None, None, TODAY), card("Haus", TODAY))

        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Haus"]


def test_a_deleted_card_is_in_neither_the_session_nor_the_study_queue() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY), card("Haus", TODAY))

        assert client.delete("/api/cards/1").status_code == 204

        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Haus"]
        assert [item["word"] for item in client.get("/api/study/queue").json()] == ["Haus"]


def test_nothing_is_due_when_every_card_is_due_later() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY + timedelta(days=1)))

        assert client.get("/api/study/due").json() == []


def test_with_no_cards_at_all_the_session_is_empty() -> None:
    with study_client() as client:
        assert client.get("/api/study/due").json() == []


def test_a_good_answer_takes_the_card_out_of_the_session_and_makes_it_due_later_than_today() -> (
    None
):
    with study_client() as client:
        add_cards(card("Zug", TODAY), card("Haus", TODAY))

        response = client.post("/api/cards/1/answer", json={"answer": "good"})

        assert response.status_code == 200
        assert response.json() == {
            "id": 1,
            "word": "Zug",
            "due_date": "2026-10-18",
            "interval_days": 2,
        }
        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Haus"]


def test_an_again_answer_leaves_the_card_due_today_so_it_comes_back_in_the_session() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY - timedelta(days=5)))

        response = client.post("/api/cards/1/answer", json={"answer": "again"})

        assert response.json() == {
            "id": 1,
            "word": "Zug",
            "due_date": "2026-10-16",
            "interval_days": 0,
        }
        assert [item["word"] for item in client.get("/api/study/due").json()] == ["Zug"]


def test_each_card_of_the_session_says_when_it_comes_back_for_each_of_the_four_answers() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY))

        item = client.get("/api/study/due").json()[0]

        assert item["forecast"] == {
            "again": {"interval_days": 0, "due_date": "2026-10-16"},
            "hard": {"interval_days": 1, "due_date": "2026-10-17"},
            "good": {"interval_days": 2, "due_date": "2026-10-18"},
            "easy": {"interval_days": 4, "due_date": "2026-10-20"},
        }


def test_each_answer_gives_the_card_the_due_date_that_its_button_said() -> None:
    answers = ["again", "hard", "good", "easy"]
    with study_client() as client:
        ids = add_cards(*[card(answer, TODAY) for answer in answers])
        connection = connect()
        try:
            for card_id in ids:
                update_card(connection, card_id, interval_days=8)
        finally:
            connection.close()
        said = {item["word"]: item["forecast"] for item in client.get("/api/study/due").json()}

        for card_id, answer in zip(ids, answers):
            answered = client.post(f"/api/cards/{card_id}/answer", json={"answer": answer}).json()

            assert (answered["interval_days"], answered["due_date"]) == (
                said[answer][answer]["interval_days"],
                said[answer][answer]["due_date"],
            )
        connection = connect()
        try:
            assert [get_card(connection, card_id)["interval_days"] for card_id in ids] == [
                0,
                10,
                16,
                21,
            ]
        finally:
            connection.close()


def test_the_answers_are_still_there_after_a_restart() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY))
        client.post("/api/cards/1/answer", json={"answer": "good"})

    with study_client() as restarted:
        assert restarted.get("/api/study/due").json() == []


def test_an_answer_for_a_card_that_does_not_exist_is_not_found() -> None:
    with study_client() as client:
        assert client.post("/api/cards/99/answer", json={"answer": "good"}).status_code == 404


def test_an_answer_must_be_one_of_the_four_answers() -> None:
    with study_client() as client:
        add_cards(card("Zug", TODAY))

        assert client.post("/api/cards/1/answer", json={}).status_code == 422
        assert client.post("/api/cards/1/answer", json={"answer": "maybe"}).status_code == 422
        assert client.post("/api/cards/1/answer", json={"remembered": True}).status_code == 422


def queue(client: TestClient) -> list[str]:
    return [item["word"] for item in client.get("/api/study/due").json()]


def queue_ids(client: TestClient) -> list[int]:
    return [item["id"] for item in client.get("/api/study/due").json()]


def save_order(
    client: TestClient, card_ids: list[int], moved: list[int], today_count: int | None = None
):
    """Save an order. Unless `today_count` says otherwise, every card of the order is due today."""
    count = len(card_ids) if today_count is None else today_count
    return client.post(
        "/api/study/queue/order", json={"card_ids": card_ids, "moved": moved, "today_count": count}
    )


def due_dates(*card_ids: int) -> list[str]:
    connection = connect()
    try:
        return [get_card(connection, card_id)["due_date"] for card_id in card_ids]
    finally:
        connection.close()


def due_times(*card_ids: int) -> list[str]:
    connection = connect()
    try:
        return [get_card(connection, card_id)["due_at"] for card_id in card_ids]
    finally:
        connection.close()


def test_cards_due_the_same_day_are_studied_in_the_order_of_their_due_times() -> None:
    with study_client() as client:
        first, second = add_cards(card("late", TODAY), card("early", TODAY))
        connection = connect()
        update_card(connection, first, due_at="2026-10-16T10:00:00")
        update_card(connection, second, due_at="2026-10-16T09:00:00")
        connection.close()

        assert queue(client) == ["early", "late"]


def test_cards_due_the_same_day_and_never_moved_are_studied_in_the_order_they_were_made() -> None:
    with study_client() as client:
        add_cards(card("one", TODAY), card("two", TODAY), card("three", TODAY))

        assert queue(client) == ["one", "two", "three"]
        assert len(set(due_times(1, 2, 3))) == 3


def test_a_card_that_is_due_on_an_earlier_day_comes_before_a_card_due_today() -> None:
    with study_client() as client:
        add_cards(card("today", TODAY), card("overdue", TODAY - timedelta(days=3)))

        assert queue(client) == ["overdue", "today"]


def test_the_cards_of_the_second_text_dragged_to_the_top_are_studied_before_the_first_text() -> (
    None
):
    with study_client() as client:
        first, second = add_two_texts(["a1", "a2"], ["b1", "b2", "b3"])

        response = save_order(client, [*second, *first], moved=second)

        assert response.status_code == 200
        assert [item["word"] for item in response.json()] == ["b1", "b2", "b3", "a1", "a2"]
        assert queue(client) == ["b1", "b2", "b3", "a1", "a2"]


def test_a_card_dragged_between_two_others_changes_only_its_own_place_and_due_time() -> None:
    with study_client() as client:
        (a1, a2), (b1, b2, b3) = add_two_texts(["a1", "a2"], ["b1", "b2", "b3"])
        untouched = due_times(a1, a2, b1, b2)

        save_order(client, [a1, b3, a2, b1, b2], moved=[b3])

        assert queue(client) == ["a1", "b3", "a2", "b1", "b2"]
        assert due_times(a1, a2, b1, b2) == untouched


def test_ticked_cards_dragged_together_stay_one_after_another_in_the_order_they_had() -> None:
    with study_client() as client:
        (a1, a2), (b1, b2, b3) = add_two_texts(["a1", "a2"], ["b1", "b2", "b3"])

        save_order(client, [a1, b1, b3, a2, b2], moved=[b1, b3])

        assert queue(client) == ["a1", "b1", "b3", "a2", "b2"]


def test_a_card_can_be_dragged_to_the_end_of_the_queue() -> None:
    with study_client() as client:
        a1, a2, a3 = add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY))

        save_order(client, [a2, a3, a1], moved=[a1])

        assert queue(client) == ["a2", "a3", "a1"]


def test_the_new_order_is_still_there_after_a_restart() -> None:
    with study_client() as client:
        first, second = add_two_texts(["a1", "a2"], ["b1"])
        save_order(client, [*second, *first], moved=second)

    with study_client() as restarted:
        assert queue(restarted) == ["b1", "a1", "a2"]


def test_moving_a_card_does_not_change_its_interval_or_its_due_date() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY - timedelta(days=2)), card("a2", TODAY))
        connection = connect()
        update_card(connection, 1, interval_days=4)

        save_order(client, [2, 1], moved=[1])

        assert queue(client) == ["a2", "a1"]
        assert get_card(connection, 1)["interval_days"] == 4
        assert get_card(connection, 1)["due_date"] == "2026-10-14"
        connection.close()


def test_a_moved_card_that_is_answered_gets_the_due_date_of_the_scheduler_and_the_others_stay_in_place() -> (
    None
):
    with study_client() as client:
        _, second = add_two_texts(["a1", "a2"], ["b1", "b2", "b3"])
        save_order(client, [second[1], 1, 2, second[0], second[2]], moved=[second[1]])

        answered = client.post(f"/api/cards/{second[1]}/answer", json={"answer": "good"}).json()

        assert answered["due_date"] == "2026-10-18"
        assert queue(client) == ["a1", "a2", "b1", "b3"]


def test_a_forgotten_moved_card_goes_back_to_its_default_place_of_the_day() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY))
        save_order(client, [3, 1, 2], moved=[3])

        client.post("/api/cards/3/answer", json={"answer": "again"})

        assert queue(client) == ["a1", "a2", "a3"]


def test_an_order_for_cards_that_are_no_longer_in_the_queue_is_refused_and_changes_nothing() -> (
    None
):
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY))
        client.delete("/api/cards/1")
        before = due_times(2, 3)

        response = save_order(client, [3, 1, 2], moved=[3])

        assert response.status_code == 409
        assert queue(client) == ["a2", "a3"]
        assert due_times(2, 3) == before


def test_an_order_that_misses_a_card_of_the_queue_is_refused() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY))

        assert save_order(client, [3, 1], moved=[3]).status_code == 409
        assert save_order(client, [3, 1, 1, 2], moved=[3]).status_code == 409
        assert queue(client) == ["a1", "a2", "a3"]


def test_a_card_that_changed_place_without_being_named_as_moved_is_refused() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY), card("a4", TODAY))

        response = save_order(client, [2, 1, 3, 4], moved=[4])

        assert response.status_code == 422
        assert queue(client) == ["a1", "a2", "a3", "a4"]


def test_only_cards_of_the_queue_can_be_named_as_moved() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY))

        assert save_order(client, [2, 1], moved=[99]).status_code == 422
        body = {"card_ids": [2, 1], "moved": [], "today_count": 2}
        assert client.post("/api/study/queue/order", json=body).status_code == 422
        assert (
            client.post(
                "/api/study/queue/order", json={**body, "card_ids": [], "moved": [1]}
            ).status_code
            == 422
        )


def test_dragging_a_card_between_the_same_two_neighbours_again_and_again_keeps_the_order() -> None:
    """Each drag halves the time between the neighbours; when it runs out the queue gets new, evenly spaced times."""
    with study_client() as client:
        add_cards(*[card(f"c{number}", TODAY) for number in range(1, 5)])
        expected = [1, 2, 3, 4]
        for _ in range(40):
            dragged = expected[-1]
            expected = [expected[0], dragged, *expected[1:-1]]

            response = save_order(client, expected, moved=[dragged])

            assert response.status_code == 200
            assert queue_ids(client) == expected


def test_there_is_no_room_between_two_due_times_that_are_a_microsecond_apart() -> None:
    before = datetime(2026, 10, 16, 9, 0, 0)

    assert times_between(before, before + timedelta(microseconds=1), 1, []) is None
    assert times_between(before, before + timedelta(seconds=1), 2, []) is not None


def study_queue(client: TestClient) -> list[dict]:
    return client.get("/api/study/queue").json()


def test_the_queue_has_every_card_with_a_sentence_in_study_order_and_says_which_are_due_today() -> (
    None
):
    with study_client() as client:
        add_cards(
            card("later 3 days", TODAY + timedelta(days=3)),
            card("today", TODAY),
            card("later 1 day", TODAY + timedelta(days=1)),
            ("no sentence", None, None, TODAY),
        )

        items = study_queue(client)

        assert [item["word"] for item in items] == ["today", "later 1 day", "later 3 days"]
        assert [item["due_today"] for item in items] == [True, False, False]
        assert [item["due_date"] for item in items] == ["2026-10-16", "2026-10-17", "2026-10-19"]
        assert queue(client) == ["today"]


def test_a_hidden_card_is_not_in_the_queue_and_the_rest_can_still_be_ordered() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("a3", TODAY))
        update_card(connect(), 2, hidden=1)

        assert [item["word"] for item in study_queue(client)] == ["a1", "a3"]
        assert save_order(client, [3, 1], moved=[3]).status_code == 200
        assert queue(client) == ["a3", "a1"]


def test_a_later_card_dragged_above_the_separator_is_due_today_and_keeps_its_interval() -> None:
    with study_client() as client:
        add_cards(card("a1", TODAY), card("a2", TODAY), card("later", TODAY + timedelta(days=1)))
        connection = connect()
        update_card(connection, 3, interval_days=4)

        response = save_order(client, [3, 1, 2], moved=[3], today_count=3)

        assert response.status_code == 200
        assert [item["due_today"] for item in response.json()] == [True, True, True]
        assert queue(client) == ["later", "a1", "a2"]
        assert get_card(connection, 3)["due_date"] == "2026-10-16"
        assert get_card(connection, 3)["interval_days"] == 4
        connection.close()


def test_a_card_due_today_dragged_among_the_later_cards_gets_the_date_of_the_card_above() -> None:
    with study_client() as client:
        add_cards(
            card("t1", TODAY),
            card("t2", TODAY),
            card("l1", TODAY + timedelta(days=1)),
            card("l2", TODAY + timedelta(days=3)),
        )

        save_order(client, [2, 3, 1, 4], moved=[1], today_count=1)

        assert due_dates(1) == ["2026-10-17"]
        assert queue(client) == ["t2"]
        assert [item["word"] for item in study_queue(client)] == ["t2", "l1", "t1", "l2"]


def test_a_card_dropped_at_the_start_of_the_later_cards_is_due_tomorrow_at_the_earliest() -> None:
    with study_client() as client:
        add_cards(card("t1", TODAY), card("t2", TODAY), card("l1", TODAY + timedelta(days=4)))

        save_order(client, [2, 1, 3], moved=[1], today_count=1)

        assert due_dates(1) == ["2026-10-17"]
        assert [item["due_today"] for item in study_queue(client)] == [True, False, False]


def test_a_card_dropped_at_the_end_of_the_cards_due_today_is_still_due_today() -> None:
    with study_client() as client:
        add_cards(card("l1", TODAY + timedelta(days=2)), card("t1", TODAY), card("t2", TODAY))

        save_order(client, [2, 3, 1], moved=[3], today_count=2)

        assert due_dates(3) == ["2026-10-16"]
        assert [item["due_today"] for item in study_queue(client)] == [True, True, False]


def test_a_later_card_moved_among_the_later_cards_takes_the_date_of_the_card_above() -> None:
    with study_client() as client:
        add_cards(
            card("t", TODAY),
            card("l1", TODAY + timedelta(days=1)),
            card("l2", TODAY + timedelta(days=3)),
            card("l3", TODAY + timedelta(days=5)),
        )

        save_order(client, [1, 2, 4, 3], moved=[4], today_count=1)

        assert due_dates(4) == ["2026-10-17"]
        assert [item["word"] for item in study_queue(client)] == ["t", "l1", "l3", "l2"]


def test_a_card_that_changed_from_today_to_later_without_being_named_as_moved_is_refused() -> None:
    with study_client() as client:
        add_cards(card("t1", TODAY), card("t2", TODAY), card("l1", TODAY + timedelta(days=1)))

        assert save_order(client, [1, 2, 3], moved=[1], today_count=1).status_code == 422
        assert save_order(client, [1, 2, 3], moved=[1], today_count=4).status_code == 422
        assert [item["due_today"] for item in study_queue(client)] == [True, True, False]
