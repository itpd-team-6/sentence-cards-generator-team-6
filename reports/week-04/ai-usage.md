# AI usage — Week 04

## Tools

- Claude (Anthropic), through the Claude app.
- Gemini (Google), model `gemini-3.5-flash-lite`, as the language model the product calls to write the sentences.
- Whisper (OpenAI), run on a local computer, for the transcript of the Customer meeting.

## What we used them for

- **Claude:** first drafts of the decisions, the quality requirements, the functional requirement, the architectural decision records, the container view, the meeting report, the sprint plan and the retrospective; scripts that check the quotes of the Customer against the transcript and that bring the issues of Weeks 2 and 3 to the new shape; and checking our files against the course requirements.
- **Gemini:** writing the sentence and the translation of each card when the product runs, including in the demonstration to the Customer.
- **Whisper:** transcribing the recording of the meeting with timestamps, before Claude and the team cleaned the text.

## What we did and checked ourselves

- **We ran the meeting.** nataliamotand held the meeting with the Customer and showed the working product.
- **We decided what the meeting settled.** The decisions of the Customer in [`docs/decisions.md`](../../docs/decisions.md) are worded from what the Customer said, and every quote was checked against the transcript.
- **We read every file.** nataliamotand read each file line by line before it went into the repository, and changed the drafts she did not agree with: she cut a problem from the retrospective that she judged unfit, and kept the Story Points only after reviewing each story.
- **We kept the Customer's adjustments.** The new quality requirement `QR-06` and the changes to `QR-04` and `QR-05` follow what the Customer asked for, and the team checked them against the quotes.
- **We ran the scripts ourselves.** The script that changed the issues was first run in a mode that only prints its commands, then on one issue, and then on all of them, and the result was checked in the tracker.

## What was not used

No AI output was submitted unchecked.
The sentences of the cards are written by a language model when the product runs; they are not part of our evidence.
