# AI usage — Week 02

## Tools

- Claude (Anthropic), through the Claude app.
- TurboScribe, an AI transcription service, for the validation meeting recording.
- Gemini (Google), model `gemini-3.5-flash-lite` in Google AI Studio, as the model under test in the sentence quality test.
- ChatGPT (OpenAI).

These are the AI tools identified as used during the week.

## What we used them for

- **Claude:** first drafts of the meeting script and of the other written artifacts, from our own findings and the transcript; checking our files against the course requirements; cleaning the transcript; and judging, as a second opinion, which of the 60 test sentences we would correct.
- **Gemini:** writing the 60 test sentences, as the model whose quality we tested.
- **TurboScribe:** transcribing the recording, in two parts to fit its length limit, with timestamps.
- **ChatGPT:** a short German text for the Anki "Reposition" timing, and help to identify and understand issues met in the project files.

## What we did and checked ourselves

- **We designed and ran the evidence work.** We fixed the word lists for the sentence quality test before running it (10 common words, 5 words with several meanings and 5 with hard grammar, in each language), used one new chat per language and kept only the first answer. A team member timed the Anki "Reposition" and another searched the forums.
- **We ran the meeting.** We put our questions and prototypes to the Customer and recorded the meeting.
- **We decided what the meeting settled.** We decided which statements are decisions, what each of the four decisions says, how the Customer's verdict on the minimum usable product candidate is worded, and the owners and due dates of the action points.
- **We changed the artifacts ourselves.** We chose to handle audio as its own story instead of adding a criterion to the study story, and we kept the Customer's remark that the sentence audio plays automatically. We wrote the acceptance criteria and the comments on the story issues, and updated the constraint and the boundary item.
- **We checked the transcript against the recording.** nataliamotand listened to the recording again at the passages the tool could not make out, corrected the words there, and confirmed the numbers she said in the update and the names. The rest of the transcript was cleaned from the tool's output, and we did not listen to it line by line.
- **We reviewed every draft.** We read each one before it went into the repository, and changed what did not match the meeting or our evidence. The meeting report and the week report were reviewed by team members in their pull requests.
- **We corrected the drafts.** The transcript tool could not make out some passages, so nataliamotand corrected them from the recording. A draft left the audio story as Won't Have, which contradicted `DEC-007`, so we rejected that and reopened it as Must Have.
- **We stated the limits of our evidence.** The AI judge's verdicts were not checked by a native speaker, so we say so in the test, and the assumption it supports, [`ASM-01`](../../docs/assumptions.md#asm-01), stays open.

## What was not used

The result of the sentence quality test is an AI's judgment of an AI's output, and the report and the test say so; no other AI output was used as a finding without being checked against a source we looked at.
The meeting report was drafted with Claude from the transcript and reviewed by the team before it was merged.
