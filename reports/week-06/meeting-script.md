# Week 6 Sprint Review Script

This script is the plan of the weekly meeting with the Customer, which is the Sprint Review of `SPRINT-06`.
The team prepared it in writing before the meeting, and the decisions of the meeting are in the meeting report, not here.

## What The Meeting Settles

The meeting settles three questions:

1. Does the telemetry answer questions that the Customer recognises?
2. Does the diagnosability requirement [`QR-07`](../../docs/quality-requirements/qr/QR-07.md) hold in staging?
3. What should the threshold of success measure next?

## Before Recording

The moderator asks these questions before anything is shown, and the answers go in the meeting report:

1. May the team record the meeting?
2. May the team publish the transcript in the repository?
3. If the Customer does not allow publication, may the team share the transcript privately with the instructors?

If the Customer refuses the recording, the team takes written notes and the Moodle submission says so in one line.

## Roles

- **Moderator and screen sharing:** nataliamotand.
- **Other roles:** the team assigns them before the meeting and writes them in the meeting report.

## Agenda

### 1. The deployed product and the decks (about 15 minutes)

- **Show:** the production instance on the university virtual machine, opened by the Customer from the university network, through the core task: paste a text, mark words, get the cards, study them.
- **Show:** what is new, the decks: the list of decks, the filter by decks in the study queue, and the deck "Earlier cards".
- **Say:** the migration made one deck "Earlier cards" for each pair of languages, and not one deck for each text, which follows [`DEC-020`](../../docs/decisions.md#dec-020) and the Customer's words "you don't need to relate texts to decks anymore" (Customer, [02:51:40]).
- **Say:** production runs the current `main`, and `REL-06` is tagged after this meeting on the commit that production runs.
- **Say:** of the Week 5 action points, the decks, the filter and the study queue are carried out; the question to the language model ([`FR-009`](../../docs/functional-requirements/fr/FR-009.md)) and the time-zone scenarios are not carried out in Week 6, and the team proposes to carry both to Week 7.
- **Ask:** does the Customer accept the new user story about decks, [`US-11`](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/201)?

### 2. The analytics dashboards, staging and production (about 10 minutes)

- **Show:** the dashboard `Product analytics (staging)` and then `Product analytics (production)`, with the charts `Cards studied per active learner` and `Cards made per active learner`, and the list `Recent events` in staging.
- **Say:** the focus metric is [cards studied per active learner per week](../../docs/analytics.md#cards-studied-per-active-learner-per-week), and the counter-metric is the [sentence replacement rate](../../docs/analytics.md#sentence-replacement-rate).
- **Say:** the values in staging come from a study session of the team on the demo library, so they show that the pipeline works and not how the product performs; the test events are tagged `source=smoke` and the charts leave them out; production holds only real traffic.
- **Ask (question 1):** which question about the learners would the Customer ask first, and is there one that these dashboards cannot answer?

### 3. The observability dashboards, staging and production (about 5 minutes)

- **Show:** the dashboard `Observability (staging)` and then `Observability (production)`, each with the chart `Request latency P95 by outcome (SLI-01)`.
- **Say:** each line is one route and one outcome (`ok`, `client_error`, `server_error`), and the P95 is read from a histogram of request durations, so it is an interpolation between buckets.
- **Say:** staging carries the test traffic of the team, and production carries the requests that it has served since collection was switched on.

### 4. The observability test result with its SLI (about 10 minutes)

- **Show:** in the dashboard `Observability (staging)`, the series of the failed request, route `/api/texts/{text_id}/cards` with outcome `client_error`; if the dashboard does not load, show the screenshot in [the evidence page](qrt-01-evidence.md), which also holds the recorded result of `QRT-01` of `QR-07`.
- **Say:** `QR-07` asks that, when a request fails, the team finds its log point in at most five seconds and its failure in the metric in at most one minute.
- **Say:** the failed request, recorded in the evidence page, is the request for the cards of a text that does not exist, answered 404, with its `request_id`, its route `/api/texts/{text_id}/cards` and its failure label `client_error`.
- **Say:** the log point of that request, found 0.9 seconds after the response, where the measure allows five seconds.
- **Say:** the result of the query of [`SLI-01`](../../docs/observability.md#sli-01), found 9.0 seconds after the response, where the measure allows one minute, with a P95 of 97.5 ms for the failure series.
- **Say:** the P95 comes from one small sample of test traffic, so the test shows that the signals work from the request to the query, and it does not measure how fast the product is for real learners.
- **Ask (question 2):** the test met both limits in staging; does the Customer accept `QR-07` as met?
- **If the Customer asks to see it live:** run `node scripts/check-sli.mjs` from the university network against staging.

### 5. The threshold review (about 5 minutes)

- **Show:** the table of the threshold review: [`TOS-01`](../../docs/threshold-of-success.md#tos-01) is settled and `Achieved`, because the decisions [`DEC-011`](../../docs/decisions.md#dec-011) and [`DEC-030`](../../docs/decisions.md#dec-030) record the Customer's acceptance of `US-01`, `US-02` and `US-03`; `TOS-02`, `TOS-03` and `TOS-04` stay `Open`, because their measures fall in Week 9 or Week 11, and the analytics and observability data of this week cannot settle them.
- **Say:** the team proposes no change to any goal.
- **Ask (question 3):** what does the Customer think of the review, and what should the threshold measure next?
- **Record:** a change that the Customer asks for is a `DEC-nnn` cited under the goal's `**Changed:**`; if there is none, the report records no change.

## Closing

The moderator reads back the decisions, and the team writes at least two action points due in Week 7, owner and date included.
