# AI usage — Week 01

## Tools

- Claude (Anthropic), through the claude.ai app, used by nataliamotand.
- ChatGPT (OpenAI), through the web UI, used by nataliamotand and AbdelrahmanAbdel-Aal as part of the evaluation of ALT-01 and ALT-04.
- TurboScribe, an AI transcription service, for the kickoff recording.
- Adobe Podcast "Enhance Speech", an AI audio tool, to make the kickoff recording easier to understand before transcribing it.
- Grok (xAI), used by AbdelrahmanAbdel-Aal.
- emapfff used no AI tools this week.

## What we used them for

- **Research (Claude):** searching the songs2anki scripts, and reading the official pages of LingQ on its plans and on LingQ for Schools.
  Every finding that comes only from this search is marked _(AI search)_ in [alternatives.md](../../docs/research/alternatives.md).
- **Evaluation (ChatGPT):** we sent the prompt from songs2anki (`lib.py`, `make_prompt`) and five words to ChatGPT to reproduce its generation step (ALT-01), and used ChatGPT as the product under test in ALT-04.
  Here ChatGPT was the object of the evaluation, not a source of findings.
- **Drafting (Grok):** a first draft of the ALT-03 and ALT-04 sections, and help understanding errors that came up while working on the repository.
- **Transcription (Adobe Podcast, TurboScribe):** the recording had clipped audio; we enhanced it and transcribed it, then wrote [meeting-transcript.md](meeting-transcript.md) from that output.
- **Drafting and review (Claude):** turning our own findings, hands-on tests and meeting notes into first drafts of the written artifacts, which we then reviewed line by line and rewrote; explaining the course requirements; and checking our files against them.

## What we did with the output

- We read every draft line by line and changed or rejected what did not match our evidence.
  Examples: quotes attributed to the Customer were rewritten word for word from the transcript; a claim that Anki repositions cards "one by one" was corrected.
- In the transcript, we checked the unclear parts against the recording, corrected names the tool got wrong (songs2anki, Tatoeba, AnkiWeb, die Krone), and marked words we could not recover as `[inaudible]`.
- We removed details from the drafts that did not support any gap or proposition, such as prices and the license of ALT-01, and marked as `(hands-on)` the findings we had seen ourselves rather than only through the AI search.
- The direction of the product, the choice of gaps and value propositions, and what to ask the Customer were decided by the team.

## What was not used

No AI output was used as a finding without being checked against a source we looked at, or marked _(AI search)_.
The meeting report is our own account of the meeting, checked against the transcript.
