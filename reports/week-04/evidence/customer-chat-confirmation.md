# Customer confirmation in the group chat after the Week 4 meeting

The team wrote to the Customer in the group chat after the Week 4 validation meeting ([transcript](../meeting-transcript.md)),
and the Customer answered in the same chat.
The messages are copied word for word from the chat; the Customer's name is replaced by "the Customer".
Times are in UTC+03:00.

## Team message, 2026-10-23 23:26

> Hi [the Customer], thank you for the meeting. This is what we understood. Please confirm or correct it.
>
> Verdicts:
>
> - US-01: accepted.
> - US-04: not accepted yet. We will rewrite its acceptance criteria so they are clear (the interval and the refused
>   order), and deleting a card will remove it from the study order at once.
>
> What we will do:
>
> - Check the length of each sentence (minimum and maximum) and ask the model again when it is out of the limits.
> - Send the words in batches that arrive independently.
> - Keep "Due today" and "Later" fixed, with separate scrolling.
> - Show the title of the text given by the user on the creation instead of "Text X".
> - Make the repeat limit configurable (default 20 seconds), and check the time zone question.
> - Add a quality requirement that nobody sees another user's key, and measure the time to show the cards after the model
>   answers.
> - Update the architecture: the user's key can stay in the browser, and the audio model runs in the backend.
>
> About the next stories the order is audio first, then daily limits and request more cards, then decks, then the
> teacher's review.

## Customer messages

The first message is a reply to the team message above.

| Time             | Message                                               |
| ---------------- | ----------------------------------------------------- |
| 2026-10-24 00:00 | "Confirmed"                                           |
| 2026-10-24 00:01 | "Also, please experiment with longer context phrases" |
| 2026-10-24 00:11 | The message below                                     |

The message of 00:11, word for word:

> Please also revise the prompt that is sent to an LLM when it needs to decide whether to generate a new card.
>
> I suggest sending something like this
>
> `"<word>|<sentence where the word was selected>|<context phrase 1 from an existing card for the word>|<context phrase 2 from an existing card for the word>"`
>
> `"Schloss|Ein alter Schloss stand auf dem Straßenrand|alter Schloss|Schloss auf der Tür"`

## Customer message about the title of the text, 2026-10-25 12:18

The message is a reply to the line "Show the title of the text given by the user on the creation instead of "Text X"" of
the team message above.
The chat shows that the Customer edited it after sending it (last edit at 13:22).
The text below is the text shown in the chat on 2026-10-25 at 13:31, word for word:

> The following points can be discussed later.
>
> As a student, I want to enable and disable particular decks so that my study queue contains only the cards that I want
> to learn.
>
> Therefore, I think the study queue should display deck titles, not text titles.
>
> And, since a card may belong to multiple decks, some design changes to the study queue should be made
>
> UPD:
>
> Also, need to discuss how to marry re-prioritization and limits of learning today. Maybe cards should moved between
> today and later to match the limits

## Team reply, 2026-10-25 12:43

> Okay, thanks for the clarifications!
