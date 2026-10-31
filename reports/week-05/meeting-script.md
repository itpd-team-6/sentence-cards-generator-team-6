# Week 5 meeting script

## Context

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

This week we put the product on the university virtual machine, where the Customer opens it in a browser from the university network ([`US-09`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/149)), and we rewrote the criteria of [`US-04`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/30) as the Customer asked in Week 4 ([`DEC-031`](../../docs/decisions.md#dec-031), [`DEC-032`](../../docs/decisions.md#dec-032)).
We also read the licence of Piper and of its voices, and checked how the study queue shows dates.
We believe `US-09` and `US-04` do what their acceptance criteria say on the virtual machine; we do not know whether that is what the Customer needs.

This meeting has to settle whether the Customer accepts `US-09` and `US-04` on the production instance, and whether the virtual machine's language model is acceptable.

Questions marked ★ are the ones that would change the project most; we ask them even if time runs short.

## Agenda

1. Permissions (2 min). Nothing shown. Questions 1 to 3.
2. Week 4 action points (4 min). We report the outcome of each action point of the [Week 4 meeting report](../week-04/meeting-report.md#action-points) and say plainly which ones we did not carry out. No questions.
3. `US-09` on the production instance (8 min). The Customer opens the product on the university virtual machine from the university network, and we show each `AC-nn` of the story one at a time. We show the [deployment](../../docs/deployment.md) page for how it got there. Question 4.
4. `US-04` on the production instance (7 min). We show each `AC-nn` of the story one at a time. Question 5.
5. The language model and the dates (5 min). We show the [model of the virtual machine](../../docs/deployment.md#the-language-model-provider) and what we found about the dates of the study queue. Questions 6 and 7.
6. The next stories (4 min). We show the [features](../../docs/features.md) and the order of the next stories that the Customer gave in the Week 4 meeting ([`DEC-042`](../../docs/decisions.md#dec-042)). Question 8.
7. The open questions from Week 4 (5 min). We show the [open questions](../week-04/meeting-report.md#open-questions) of the Week 4 report. Questions 9 to 11.
8. Read-back (3 min). Nothing shown. We read back the decisions and action points.

## Questions

**Permissions:**

1. _(closed)_ May we record this meeting, with the call's automatic recording and a backup recording on one team member's computer?
2. _(closed)_ May we publish a sanitized transcript of it in our repository?
3. _(closed)_ If not, may we share the recording and the transcript privately with the instructors?

**`US-09`:**

4. ★ _(closed)_ Does `US-09` do what you need, as shown against its criteria on the production instance: accepted or rejected?

**`US-04`:**

5. ★ _(closed)_ Does `US-04` do what you need, as shown against its criteria on the production instance: accepted or rejected?

**The language model and the dates:**

6. ★ _(closed)_ The words the learner marks go from the virtual machine to Mistral Small 3.1, a language model hosted by Cloudflare Workers AI, with a free daily quota. Do you accept that for the product you will use?
7. _(closed)_ The study queue counts a day by the server's date, not the learner's time zone. The daily limits you asked for will depend on what counts as a day. We opened [an issue](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/183) for it, with no milestone yet. Where would you put it: before the audio, together with the daily limits, or later?

**The next stories:**

8. _(closed)_ At the Week 4 meeting the order of the next stories was set as audio, then the daily limits with asking for more cards, then the decks apart from the texts, then the teacher's review ([`DEC-042`](../../docs/decisions.md#dec-042)): does that order still hold?

**The open questions from Week 4:**

For each one, you can decide now, or leave it for when we start its story, and we write it down as carried forward.

9. _(open)_ Should the study queue show the titles of decks and not of texts, and what changes in the queue when a card is in several decks? You wrote on 2026-10-25 that it can be discussed later: do you want to decide it now?
10. _(open)_ How should the re-ordering of the study queue work with the daily limits? You wrote on 2026-10-25: "Maybe cards should moved between today and later to match the limits". Do you want to decide it now?
11. _(closed)_ For the teacher's review: should there be one flag, or two, "flag to review" and "flag to regenerate"?

## Roles

nataliamotand moderates and runs the product, AbdelrahmanAbdel-Aal takes notes, and emapfff observes, recording what we did not ask and what the Customer did not say.

## Key improvements

### "Is it OK that the model gets the learner's text?" -> "The words the learner marks go from the virtual machine to Mistral Small 3.1, a language model hosted by Cloudflare Workers AI, with a free daily quota. Do you accept that for the product you will use?"

The original can be answered with a yes that commits us to nothing and hides what is sent and where.
The rewrite says what leaves the machine and where it goes, so a yes or a no changes what we build next.
