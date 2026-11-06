# AI usage — Week 05

## Tools

- Claude (Anthropic), through the Claude app, used by nataliamotand.
- Whisper (OpenAI), through `faster-whisper`, run on a local computer, for the transcript of the Customer meeting.
- Mistral Small 3.1 from Cloudflare Workers AI, as the language model the product calls to write the sentences.

## What we used them for

- **Claude:** first drafts of the script of the meeting, the decisions `DEC-045` to `DEC-054`, the meeting report, the cleaned transcript, and the retrospective; a script that checks the quotes of the Customer against the transcript; a guide for presenting the stories at the meeting; and checking our files against the course requirements.
- **Whisper:** transcribing the recording of the meeting with timestamps, before Claude and nataliamotand cleaned the text.
- **Mistral Small 3.1:** writing the sentence and the translation of each card when the product runs, including in the demonstration to the Customer.

## What we did and checked ourselves

- **We ran the meeting.** nataliamotand held the meeting with the Customer and showed the working product on the university virtual machine.
- **We decided what the meeting settled.** The decisions of the Customer in [`docs/decisions.md`](../../docs/decisions.md) are worded from what the Customer said, and every quote was checked against the transcript by a script and read by nataliamotand.
- **We checked the transcript against the recording.** nataliamotand listened to the passages that the transcription marked as unclear and checked who spoke in the parts where the speakers were assigned from the content.
- **We read every file.** nataliamotand read each file line by line before it went into the repository, and changed what she did not agree with: she cut two questions from the script of the meeting that she judged unnecessary.
- **We tested the browsers ourselves.** nataliamotand opened the production address in Firefox and Chrome on a computer and in Chrome on a phone before asking the Customer for the verdict on `US-09`.

## What this report covers

This report covers the AI use of nataliamotand.
emapfff and AbdelrahmanAbdel-Aal have not reported theirs for this week.

## What was not used

No AI output was submitted unchecked.
The sentences of the cards are written by a language model when the product runs; they are not part of our evidence.
