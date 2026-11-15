# Instrumentation Verification, Week 7

What was checked to show that the analytics events of staging carry the test source and the participant code, as issue #278 asks.
The fields of an event and the rule for the source are in [`docs/analytics.md`](../../docs/analytics.md).
The address of the VM and the credentials of the analytics dashboard are not written here: they are only in the private Moodle report.

## What was run

| Item         | Value                                                                           |
| ------------ | ------------------------------------------------------------------------------- |
| Environment  | Staging, commit `18e3d32`, updated 2026-11-15 at 18:26 (UTC+03:00)              |
| Run by       | nataliamotand                                                                   |
| Session      | 2026-11-15, 20:01 to 20:02 (UTC+03:00), in a private browser window             |
| Query run at | 2026-11-15, about 20:04 (UTC+03:00)                                             |
| Session link | The page opened with `?source=usability-test&participant=P-99`                  |
| Participant  | `P-99`, a code kept for checks, so `P-01` and the next codes stay free for real |
| Steps        | Saved a German text, asked for the cards, asked a new sentence, answered a card |

## Query 1: the events of the session

```sql
SELECT _timestamp, event, source, participant_code, learner_id FROM "events" WHERE source = 'usability-test' AND participant_code = 'P-99' ORDER BY _timestamp
```

The query returned four rows.
The `learner_id` is shortened to eight characters here.

| Time (UTC+03:00)    | event               | source           | participant_code | learner_id    |
| ------------------- | ------------------- | ---------------- | ---------------- | ------------- |
| 2026-11-15 20:01:02 | `text_saved`        | `usability-test` | `P-99`           | `aadbcd5f...` |
| 2026-11-15 20:01:03 | `cards_generated`   | `usability-test` | `P-99`           | `aadbcd5f...` |
| 2026-11-15 20:01:21 | `sentence_replaced` | `usability-test` | `P-99`           | `aadbcd5f...` |
| 2026-11-15 20:01:31 | `card_answered`     | `usability-test` | `P-99`           | `aadbcd5f...` |

## Query 2: the events by source

```sql
SELECT source, count(*) AS n FROM "events" GROUP BY source ORDER BY source
```

Run over the last 24 hours, it returned:

| source           | n   |
| ---------------- | --- |
| `usability-test` | 4   |
| `web`            | 5   |

The four events of the session are counted under `usability-test`, apart from the events of the normal source `web`.

## Result

Passes: each of the four events of the session reached the analytics backend of staging with the source `usability-test` and the participant code `P-99`.

## What was not checked

- Production was not checked, because the participant code is accepted only on staging.
- The charts of the dashboards were not part of this check.
- The query selects five fields, so this record shows those fields and does not list every field an event can carry.
