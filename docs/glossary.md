# Glossary

Terms used consistently across the Sentence Cards Generator product, requirements, and code.

## Learning Content

### Marked word

A word the learner selects from their own pasted or uploaded text because they want to learn it.

**Defined by:** [Product vision goal](product-vision.md#goal) and [DEC-004](decisions.md#dec-004).

### Card

A learning item created for a selected word, containing a generated sentence and its translation for the learner to check and study.

**Defined by:** [Product vision goal](product-vision.md#goal) and [DEC-005](decisions.md#dec-005).

### Context phrase

A phrase of three or four words that uses a word with the meaning it has on its card, and that identifies the card together with that word.

**Defined by:** [FR-009](functional-requirements/fr/FR-009.md) and [DEC-013](decisions.md#dec-013).

### Deck

A named group of cards that share one pair of languages, the language of the texts and the learner's first language, where a card can be in several decks of its pair.

**Defined by:** [FR-012](functional-requirements/fr/FR-012.md), [DEC-020](decisions.md#dec-020) and [DEC-047](decisions.md#dec-047).

### Library

The texts, cards and decks of one learner, kept apart from those of every other learner and opened again with a library code.

**Defined by:** [FR-015](functional-requirements/fr/FR-015.md) and [ADR-006](architecture/adr/ADR-006.md).

### Library code

A random identifier, a version 4 UUID, that the browser makes and sends with every request, and that names the library the product opens.

**Defined by:** [FR-015](functional-requirements/fr/FR-015.md).

## Study And Review

### Review

The learner's activity of studying cards and recording answers inside the Sentence Cards Generator rather than in Anki.

**Defined by:** [DEC-002](decisions.md#dec-002) and [Product vision constraint CON-05](product-vision.md#con-05).

### Study queue

The cards presented for study, ordered by the date each card is due, with due times adjusted when the learner moves selected cards earlier.

**Defined by:** [DEC-021](decisions.md#dec-021).

## External Services

### Audio source

An external source configured to supply pronunciation audio for a card's word and sentence, either through a self-hosted text-to-speech model or an online service.

**Defined by:** [DEC-010](decisions.md#dec-010) and [Product vision boundary BND-01](product-vision.md#bnd-01).

## Product Analytics

### Focus metric

The one number that the value of the product is read from, which the metric tree puts at its top.

**Defined by:** [the analytics plan](analytics.md#the-value-and-the-metrics).

### Input metric

A number that a step of the team can change and that feeds the metric above it in the metric tree.

**Defined by:** [the analytics plan](analytics.md#the-metric-tree).

### Counter-metric

The number that guards the focus metric against buying it with harm, and that does not feed it.

**Defined by:** [the analytics plan](analytics.md#the-metric-tree).

### Metric tree

The nested list that shows the focus metric, its counter-metric and the input metrics under it, each linked to its section.

**Defined by:** [the analytics plan](analytics.md#the-metric-tree).

### Event

A named record of a product action with the trigger and fields specified in the analytics events table.

**Defined by:** [the analytics events table](analytics.md#the-events) and [FR-016](functional-requirements/fr/FR-016.md).

### Analytics backend

The role of OpenObserve that stores product events and runs the metric queries used by the analytics dashboards.

**Defined by:** [the analytics pipeline](analytics.md#the-pipeline) and [ADR-007](architecture/adr/ADR-007.md).

## Telemetry Pipelines

### Instrumentation

The backend code that records product events and operating signals and exports them to OpenObserve when their respective pipelines are enabled.

**Defined by:** [FR-016](functional-requirements/fr/FR-016.md) and [FR-017](functional-requirements/fr/FR-017.md).

### Observability backend

The role of OpenObserve that receives structured request logs and request duration histogram metrics for operational monitoring.

**Defined by:** [the observability pipeline](observability.md#the-pipeline) and [ADR-008](architecture/adr/ADR-008.md).

### Dashboard

An OpenObserve view for one environment that displays charts based on the queries in the analytics or observability plan.

**Defined by:** [the analytics dashboard](analytics.md#the-dashboard) and [the observability dashboard](observability.md#the-dashboard).

### Observability

The ability to tell how well the product serves its requests from the [signals](#signal) it emits while it runs, read as [service level indicators](#service-level-indicator).

**Defined by:** [the observability plan](observability.md) and [ADR-008](architecture/adr/ADR-008.md).

### Signal

A piece of data the product emits about its own running, of one of three types, the metric, the log and the trace; the product emits a metric and a log, and no trace.

**Defined by:** [the observability plan](observability.md#the-signals) and [FR-017](functional-requirements/fr/FR-017.md).

### Telemetry

The [signals](#signal) the product sends out of itself to the [observability backend](#observability-backend), over OTLP, when `OBSERVABILITY_ENABLED` is true.

**Defined by:** [the observability plan](observability.md#the-pipeline) and [ADR-008](architecture/adr/ADR-008.md).

### SLI

A short name for a [service level indicator](#service-level-indicator).

**Defined by:** [the observability plan](observability.md#the-slis).

### Service level indicator

A number read from the [signals](#signal) that says how well the product serves a request, such as the request latency of [SLI-01](observability.md#sli-01).

**Defined by:** [the observability plan](observability.md#the-slis) and [QR-07](quality-requirements/qr/QR-07.md).

## Usability Testing

### Usability test

A planned evaluation in which representative learners attempt the tasks of `UT-01` on staging so the team can assess whether they reach the first answered card without help.

**Defined by:** [UT-01](usability-tests/ut-01/README.md) and [QR-08](quality-requirements/qr/QR-08.md).

### Participant

An adult learner of Russian, English or German who matches the profile of `UT-01`, has not used the product before, and is outside the team, the Customer and the course staff.

**Defined by:** [the UT-01 participant profile](usability-tests/ut-01/README.md#participant-profile).

### Usability session

One participant's run of the tasks and surveys of `UT-01` under its protocol, with consent and recording required for the session to count.

**Defined by:** [the UT-01 protocol](usability-tests/ut-01/README.md#protocol) and [the session instructions](usability-tests/ut-01/sessions/README.md).

### Consent

A participant's durable agreement before a session to the participation, recording, sanitized public results and data handling stated in the consent template, with separate optional permission for an anonymized quote.

**Defined by:** [the UT-01 consent template](usability-tests/ut-01/consent.md).

### Recording

The private record of a participant's usability session, kept in the team's cloud folder with instructor access until deletion after grading.

**Defined by:** [the UT-01 consent and data map](usability-tests/ut-01/README.md#consent-and-data) and [the consent template](usability-tests/ut-01/consent.md).

### Measure

A quantity recorded for one participant in one usability session, such as a task outcome, time on task, SEQ answer or SUS score.

**Defined by:** [the UT-01 measures](usability-tests/ut-01/README.md#measures) and [the observation sheet](usability-tests/ut-01/sessions/README.md#observation-sheet).

### Metric

A product-analytics number computed from recorded product events, such as cards studied per active learner per week.

**Defined by:** [the analytics metric definitions and queries](analytics.md#the-value-and-the-metrics).

### Statistic

A summary computed from the recorded values of a usability measure, such as the main task's median SEQ or the SUS mean across the counted sessions.

**Defined by:** [the UT-01 analysis plan](usability-tests/ut-01/README.md#analysis-plan) and [QR-08](quality-requirements/qr/QR-08.md#response-measure).

### SUS

The System Usability Scale, the ten-item questionnaire answered after all `UT-01` tasks and scored from its recorded responses to assess perceived usability.

**Defined by:** [the UT-01 SUS questionnaire and scoring](usability-tests/ut-01/surveys.md#sus-after-all-the-tasks).

### SEQ

The Single Ease Question, asked after each `UT-01` task to record the participant's rating from 1 for very difficult to 7 for very easy.

**Defined by:** [the UT-01 SEQ question](usability-tests/ut-01/surveys.md#seq-after-each-task) and [QR-08](quality-requirements/qr/QR-08.md#response-measure).
