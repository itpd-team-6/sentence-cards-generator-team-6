# UT-01 Sessions

How a session runs, the sheet the observer fills in, and the template of the note of a counted session.
The tasks and the protocol are in [the record](../README.md), and the questions are in [the surveys](../surveys.md).

## Before a session

1. Give the participant the next free code, `P-01`, `P-02` and so on.
2. Check that the participant has consented, including to the recording.
3. Open a new library on the staging deployment with the session address, such as `?source=usability-test&participant=P-01`, so that the events of the session carry the source and the code, and start the recording.
4. Check that the participant can open a browser to search for a text, and give no text beforehand.

## Instructions for the facilitator

1. Welcome the participant, say that the product is being tested and not the participant, and check the consent and the recording.
2. Ask the pre-test questions.
3. Ask the participant to think aloud.
4. Read each scenario of the record as written, the main task first, and give no text: the participant finds one.
5. Do not explain the interface or solve a step for the participant.
6. After each task, ask the SEQ. After the three tasks, ask the SUS and the post-test.
7. Thank the participant.

## Observation sheet

The observer fills in one row for each task.

| Task        | Outcome (`Unaided`, `Assisted` or `Failed`) | Help given | Time on task | Friction points | Quotes | SEQ |
| ----------- | ------------------------------------------- | ---------- | ------------ | --------------- | ------ | --- |
| Main        |                                             |            |              |                 |        |     |
| Secondary 1 |                                             |            |              |                 |        |     |
| Secondary 2 |                                             |            |              |                 |        |     |

In the main task the observer also records the time from the start of the task until the text is copied, and the time until the first card is answered.
In the second task the observer records the ways the participant used to start the practice, and in the third task the places where the participant got a different sentence.
The observer also records the SUS answers, the post-test answers, and whether the session was stopped and why.

## Template of the note

The note of a counted session is `sessions/P-nn.md`, with no name, email address or phone number.

```markdown
# P-01

- **Language studied:** <language>.
- **Device:** <the device>.
- **Outcome of each task, help given and time on task:** <summary>.
- **Time to find and copy the text:** <minutes and seconds>.
- **Ways and places:** <the ways the participant used to start the practice, and the places where they got a different sentence>.
- **SEQ:** main <n>, secondary <n>, secondary <n>.
- **SUS:** <score>.
- **Themes:** <the themes of the notes>.
- **Quote:** "<an anonymized quote>", only if the participant agreed to it.
```
