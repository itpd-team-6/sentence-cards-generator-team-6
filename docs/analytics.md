# Product analytics

The numbers this product is judged by, the events that produce them, and the pipeline that stores them.

## The Value And The Metrics

The focus metric is cards studied per active learner per week: the one number the page reads the product's value from.
It expresses [`VP-02`](research/value-proposition.md#vp-02): the learner decides which words come first and studies them.

### The Metric Tree

The label is the metric's level: `Focus` is the focus metric, `L1` an input metric one level under it, and `L2` an input under an L1 input.
`(counter-metric)` marks the counter-metric, which guards the focus metric rather than feeding it.
Each metric's name links to its section.

- **Focus:** [Cards studied per active learner per week](#cards-studied-per-active-learner-per-week)
  - **L1 (counter-metric):** [Sentence replacement rate](#sentence-replacement-rate)
  - **L1:** [Cards made per active learner per week](#cards-made-per-active-learner-per-week)
    - **L2:** [Sentence generation success rate](#sentence-generation-success-rate)
    - **L2:** [Texts saved per active learner per week](#texts-saved-per-active-learner-per-week)

### Why This Focus Metric

- **It expresses value:** a card the learner answers in a study session is a word they are learning, which is what the product is for.
- **It represents the vision and strategy:** the vision's goal is a learner who turns the words they do not know into cards they have checked and studies them, and an answered card is that goal counted.
- **It is a leading indicator:** answers come before the words are known, so the team sees the change first.
- **It is actionable:** the editor, the decks and the study queue each move it, and the team owns all three.
- **It is understandable:** one sentence says it, and a learner could repeat it.
- **It is measurable:** every answer is an event, so the metric is a query over the pipeline and not a survey.
- **It is not a vanity metric:** it counts what a learner chose to study, not what the product stores.

Rejected as a vanity metric: total cards stored, because it grows with every text pasted even when nobody studies a card, and it never moves when the study queue improves.

The focus metric depends on its input metrics and on real users: until people outside the team use the product it has no value, and the test traffic of the team, tagged `source=smoke`, is not shown as its value.

### Cards studied per active learner per week

- **Definition:** A rate: the answers to cards in the week divided by the active learners in that week; an active learner is a learner who answered at least one card in the week, and the unit is answers per learner per week.
- **Source:** [`card_answered`](#the-events).
- **Query:** the count of `card_answered` events in the week, excluding `source = 'smoke'`, divided by the count of distinct `learner_id` values in those events:

  ```sql
  SELECT date_trunc('week', to_timestamp_micros(_timestamp)) AS week,
         count(*) * 1.0 / count(DISTINCT learner_id) AS answers_per_learner
  FROM "events"
  WHERE event = 'card_answered' AND source != 'smoke'
  GROUP BY week
  ORDER BY week
  ```

The focus metric is computed by this query in the dashboard, and not by hand.

### Sentence replacement rate

- **Definition:** A rate: the sentences the learner replaced in the week, by asking for a new one or by editing it, divided by the answers to cards in that week; the unit is replaced sentences per answer.
- **Source:** [`sentence_replaced`](#the-events) and [`card_answered`](#the-events).
- **Query:** the sum of `cards` of the `sentence_replaced` events in the week, excluding `source = 'smoke'`, divided by the count of `card_answered` events in the week:

  ```sql
  SELECT date_trunc('week', to_timestamp_micros(_timestamp)) AS week,
         sum(CASE WHEN event = 'sentence_replaced' THEN cards ELSE 0 END) * 1.0
           / NULLIF(sum(CASE WHEN event = 'card_answered' THEN 1 ELSE 0 END), 0) AS replacements_per_answer
  FROM "events"
  WHERE source != 'smoke'
  GROUP BY week
  ORDER BY week
  ```

### Cards made per active learner per week

- **Definition:** A rate: the new cards that got a sentence in the week divided by the learners who asked for sentences in that week; the unit is cards per learner per week.
- **Source:** [`cards_generated`](#the-events).
- **Query:** the sum of `cards_made` of the `cards_generated` events in the week, excluding `source = 'smoke'`, divided by the count of distinct `learner_id` values in those events:

  ```sql
  SELECT date_trunc('week', to_timestamp_micros(_timestamp)) AS week,
         sum(cards_made) * 1.0 / count(DISTINCT learner_id) AS cards_per_learner
  FROM "events"
  WHERE event = 'cards_generated' AND source != 'smoke'
  GROUP BY week
  ORDER BY week
  ```

### Sentence generation success rate

- **Definition:** A rate: the new cards that got a sentence divided by the new cards that were asked for, which are the ones that got a sentence and the ones the language model failed for; the unit is cards per asked card.
- **Source:** [`cards_generated`](#the-events).
- **Query:** the sum of `cards_made` of the `cards_generated` events in the week, excluding `source = 'smoke'`, divided by the sum of `cards_made` and `words_failed`:

  ```sql
  SELECT date_trunc('week', to_timestamp_micros(_timestamp)) AS week,
         sum(cards_made) * 1.0 / NULLIF(sum(cards_made) + sum(words_failed), 0) AS success_rate
  FROM "events"
  WHERE event = 'cards_generated' AND source != 'smoke'
  GROUP BY week
  ORDER BY week
  ```

### Texts saved per active learner per week

- **Definition:** A rate: the texts saved in the week divided by the learners who saved at least one text in that week; the unit is texts per learner per week.
- **Source:** [`text_saved`](#the-events).
- **Query:** the count of `text_saved` events in the week, excluding `source = 'smoke'`, divided by the count of distinct `learner_id` values in those events:

  ```sql
  SELECT date_trunc('week', to_timestamp_micros(_timestamp)) AS week,
         count(*) * 1.0 / count(DISTINCT learner_id) AS texts_per_learner
  FROM "events"
  WHERE event = 'text_saved' AND source != 'smoke'
  GROUP BY week
  ORDER BY week
  ```

## The Events

Every event is named `object_action` in snake case.
Every event carries `learner_id`, a one-way hash of the library code of the learner, and `source`, which is `web`, `usability-test`, or `smoke`.
`smoke` marks the traffic the team makes to check the pipeline, and a metric leaves it out.

| Event               | Fires when                                                                              | Fields                                                                                                                                                                                              | Collected at                      |
| ------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `text_saved`        | The learner saves a text with its marked words.                                         | `learner_id` (string, required), `source` (required), `text_language` (one of `ru`, `en`, `de`, required), `first_language` (one of `ru`, `en`, `de`, required), `words_marked` (integer, required) | `backend`, staging and production |
| `cards_generated`   | The learner asks for the cards of a text and the `backend` has answered for every word. | `learner_id` (string, required), `source` (required), `words_asked` (integer, required), `cards_made` (integer, required), `words_failed` (integer, required)                                       | `backend`, staging and production |
| `card_answered`     | The learner answers a card in a study session.                                          | `learner_id` (string, required), `source` (required), `answer` (one of `again`, `hard`, `good`, `easy`, required)                                                                                   | `backend`, staging and production |
| `sentence_replaced` | The learner asks for a new sentence of one or more cards, or edits the sentence.        | `learner_id` (string, required), `source` (required), `how` (one of `new_sentence`, `edited`, required), `cards` (integer, required)                                                                | `backend`, staging and production |

The core task of the product is to paste a text, mark words, ask for the sentences, check them and study the cards: the four events cover it end to end.

## The Pipeline

The `backend` sends each event, in a thread of its own, to OpenObserve with one HTTP request, so a request of the learner never waits for it, and an event that cannot be sent is dropped.
The product's code does this in `backend/app/analytics.py`.
The analytics backend is OpenObserve v1.1.2, self-hosted on the university VM, and it is a documented alternative to OpenPanel: OpenPanel needs Docker and at least 4 GB of memory, and the VM has 3.7 GB and no Docker, while OpenObserve is one program that runs from a folder, answers SQL queries, and keeps the data of each environment in an organization of its own ([`ADR-007`](architecture/adr/ADR-007.md)).
One OpenObserve instance carries one environment scope for each environment, the organizations `analytics_staging` and `analytics_production`, and each organization has its own user, so each environment's build is configured with its own credential, and its dashboard serves charts from its own organization.
Retention is 90 days for the stream `events` of each organization, which covers the week of every metric on this page.
Collection is switched by `ANALYTICS_ENABLED`, which is `false` on a developer's machine and `true` in staging and production.
The steps and the configuration are in [the telemetry pipelines](deployment.md#the-telemetry-pipelines), and the secrets are installed on the VM and are not tracked in the repository; [`.env.example`](../.env.example) carries the shape.
A test event goes only to the staging organization, tagged `source=smoke`; the production organization holds only real traffic.
The backend and its dashboards are reachable from the university network only, and their addresses and credentials are in the Moodle submission.

## The Dashboard

The staging dashboard is `Product analytics (staging)` in the organization `analytics_staging`, and the production dashboard is `Product analytics (production)` in the organization `analytics_production`.
Each chart is named after its metric and runs the query recorded under that metric's section.

| Chart                              | Environment | What it runs                                                                  |
| ---------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `Cards studied per active learner` | staging     | the focus metric's query, with `source = 'smoke'` excluded                    |
| `Cards studied per active learner` | production  | the same query, over the production organization's traffic                    |
| `Cards made per active learner`    | staging     | the L1 input metric's query, which has values before the focus metric does    |
| `Cards made per active learner`    | production  | the same query, over the production organization's traffic                    |
| `Recent events`                    | staging     | the list of the last events, which shows the test event tagged `source=smoke` |

The staging dashboard is checked with a test event tagged `source=smoke`: the event list shows it and the charts leave it out; the production dashboard carries the same charts and queries and receives no test traffic.
Both dashboard addresses are in the Moodle submission, and the week report links one sanitized screenshot from each environment.

## Collected Data

The events collect the fields in [the events](#the-events): the languages of a text, the number of marked words, the number of cards made and failed, the answer to a card, the way a sentence was replaced, a hash of the library code, and `source`.
They never collect a text, a word, a sentence, a translation, a name, an e-mail address or any other personal data, and they never collect the library code itself, which opens a library.
An event identifies a learner by `learner_id`, the first 16 characters of the SHA-256 hash of the library code, which the browser made at random and which is not derived from any personal data, so the identifier cannot be turned back into the code or into a person.
Collection is switched off with `ANALYTICS_ENABLED=false`.
The data lives in the OpenObserve instance on the university VM, outside the repository, and is reachable from the university network only.
