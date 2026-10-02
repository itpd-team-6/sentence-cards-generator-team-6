# Kickoff meeting report

## Metadata

**Date:** 2026-09-30

**Duration:** about 45 minutes (16:30–17:14), including about 15 minutes lost to connection problems; the last 26 minutes were recorded

**Format:** online; started on Google Meet and moved to Kontur Talk after connection problems

**Attended:** nataliamotand (interviewer), AbdelrahmanAbdel-Aal (note taker and observer), Customer.
emapfff, who joined the team the day before, was on the Google Meet call but could not rejoin after the move to Kontur Talk.

**Presented:** our reading of the problem, the alternatives we researched (ALT-01 and ALT-02 in detail; ALT-03 and ALT-04 were still being finished), and our proposed direction at the time: letting the learner pick words in their own text and get a new example sentence for each (GAP-03)

**Recording:** permitted, linked from the Week 01 Moodle submission

**Transcript publication:** permitted, see [the transcript](meeting-transcript.md)

**Transcript shared privately:** not applicable

**Script:** [meeting-script.md](meeting-script.md)

## Summary

- The Customer put a sentence and card editor first, ahead of our proposed direction; picking words in a text becomes the editor's first step instead of the core of the product.
- Review happens inside our app, not in Anki, so working with Anki becomes a nice-to-have rather than a requirement, and our product owns the study order (GAP-02).
- A decent free language model is acceptable to start with.
- Re-prioritizing was named the most important of the catalog's extra features, and the order of the other two (teacher review, three interface languages) is still open.
- The teacher's role was described as editing sentences and translations; how a teacher connects to a student is still open.

## Decisions

| Decision                                                                                  | Made by             | Traces to       |
| ----------------------------------------------------------------------------------------- | ------------------- | --------------- |
| The core of the product is an editor to review, edit, flag and regenerate generated sentences | Customer            | `GAP-01`, `VP-01` |
| Review happens inside our app; importing from Anki is a nice-to-have, not required          | Customer            | `GAP-02`, `VP-02` |
| A decent free language model is acceptable                                                  | Customer            | `VP-01`         |
| Picking words in the learner's own text becomes the first step of the editor, not a separate product direction | Team, after the meeting | `GAP-03`, `VP-01` |

## Action points

| Action                                                                                               | Owner                | Due                    |
| ---------------------------------------------------------------------------------------------------- | -------------------- | ---------------------- |
| Generate sentences for 20 words in each language (RU, EN, DE) with one free model and count how many we would correct | nataliamotand        | Week 2, 2026-10-07     |
| Time how long it takes to move the words of one text to the front of an Anki deck with "Reposition"   | AbdelrahmanAbdel-Aal | Week 2, 2026-10-07     |
| Look for reports in Anki community forums from learners who moved their reviews to other apps, and why | emapfff              | Week 2, 2026-10-07     |
| Ask the Customer the open questions below                                                            | nataliamotand        | Week 2, 2026-10-08     |

## Open questions

| Question                                                                                                   | What it would change                                                                 | Follow-up                       |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------- |
| After the editor and re-prioritizing, which should come next: teacher review or the three interface languages? | Which features go into the Week 2 plan                                               | nataliamotand, Week 2           |
| What does "a teacher connects and reviews cards" mean: a separate teacher view of a student's cards, or editing the same cards? | Whether we need teacher accounts and a second view, or only shared editing (`GAP-01`) | nataliamotand, Week 2           |
| Should the product run on a VPS or on the learner's own machine? We did not ask this in the meeting.       | The stack, and where the language model's API key lives                              | nataliamotand, Week 2           |

## Disagreements

| Your position                                                                                         | Customer's position                                                                                         | What you changed                                                                                                              |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| The core of the product is letting the learner pick words in their own text and get a new sentence for each (`GAP-03`) | If the product could do one thing really well, "the editor seems to be the most important part" ([00:18:58]) | `GAP-01` became our strongest gap and `VP-01` is built around the editor; picking words is now its first step (`GAP-03`) |
