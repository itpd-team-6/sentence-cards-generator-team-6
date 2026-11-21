# Week 8 AI usage

## Tools

- Claude, a general-purpose AI assistant.
- Whisper, run locally, to turn the recordings into text transcripts.

No other tool was reported for this week.

## What we used them for

- Drafting the records of the week from the team's own sources: the session notes, the results of `UT-01`, the decisions, the meeting report, the sprint plan, the retrospective and this report.
- Preparing the text transcripts of the recordings of the sessions and of the Sprint Review.
- Writing the commands for the repository, the issues and the release.

## What we did with the output

- Every file was read line by line before it was committed, and its facts were checked against the sources: the observation notes, the transcripts, the analytics events, the decisions and the pull requests.
- Every file went to `main` through a pull request that a second member approved.
- Where a draft did not match the sources, it was corrected before it was committed.
- The decisions, the severities of the findings and the commitments in the records are the team's.

## What worked and what did not

- It worked for turning notes and transcripts into structured records and for keeping the links between the files consistent.
- It did not work without checking: a transcript has no speaker labels and has transcription errors, so every quotation and every figure was checked against the recording or the notes.

## Usability material

Claude was given the text transcripts of the recordings of the four sessions and the figures of the facilitator's observation notebook, and no audio file, video file or consent form.
The transcripts are not the sanitized notes that the assignment asks an agent to receive, and this is declared in the [report's deviations](README.md#deviations).
