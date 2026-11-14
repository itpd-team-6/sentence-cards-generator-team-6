# FR-009 meaning records test

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`
- **Run at:** 2026-11-14 14:28 UTC
- **Requests sent to the model (retries included):** 227
- **Wordings:** current, records
- **Runs of each wording:** 2
- **Cases in each run:** 29, the same as in `eval_fr009_revision.py`

## Totals

| Wording | Cases | As expected | Second cards made | Needed cards refused | Errors |
| ------- | ----- | ----------- | ----------------- | -------------------- | ------ |
| current | 58    | 49          | 7                 | 0                    | 2      |
| records | 58    | 42          | 12                | 1                    | 3      |

**Rule written before the run:** `records` is adopted only if it makes fewer second cards than `current` and refuses no needed card.

- **records:** NOT DECIDED: some requests failed, so the runs are not comparable.

## Prompts used for `records` (the first of each)

Record of a sentence:

```text
You are a lexicographer of German. In the sentence below, the word marked
⟨TARGET⟩...⟨/TARGET⟩ is used in one specific sense.

Sentence: Der ⟨TARGET⟩Leiter⟨/TARGET⟩ stieg auf die Leiter, um die Äpfel zu pflücken.

Return JSON:
- lemma, pos
- sense_gloss: a short German definition of EXACTLY this sense
- synonym_substitute: a word/phrase that could replace the target here
without changing the meaning (lexical substitution test)
- typical_subjects/objects and syntactic frame (valency, reflexive,
preposition, separable prefix if the language has them)
- excluded_senses: 2–4 OTHER common senses of this lemma that must NOT be used
- disambiguating_cues: quote the minimal span of the sentence that fixes the sense
- confidence: high/medium/low (low if the context is genuinely ambiguous)
Answer only with the JSON.
```

Comparison of a passage with the cards:

```text
The learner has these cards for the word "Leiter". Each card has a meaning record, written from the sentence of the card:
1. {"lemma": "Leiter", "pos": "noun", "sense_gloss": "ein Gerät zum Klettern, bestehend aus Sprossen und Seitenholmen", "synonym_substitute": "Trittleiter", "typical_subjects/objects": {"subjects": ["Mensch"], "objects": ["Äpfel", "Dinge in großer Höhe"], "syntactic_frame": "Nominativ + auf + Akkusativ"}, "excluded_senses": ["Führer einer Gruppe oder Organisation", "Elektrischer Leiter", "Leiter einer Schule oder eines Instituts"], "disambiguating_cues": "stieg auf die Leiter", "confidence": "high"}

In a new passage the word has this meaning record:
{"lemma": "Leiter", "pos": "noun", "sense_gloss": "eine Leiter zum Klettern", "synonym_substitute": "Kletterleiter", "typical_subjects/objects": {"subjects": [], "objects": [], "syntactic_frame": "Die Leiter lehnt an [Dat.]"}, "excluded_senses": ["Vorgesetzter", "Kabelkanal", "Leiterplatte", "Leiter einer Gruppe"], "disambiguating_cues": "\"Die Leiter lehnte an der Hauswand.\"", "confidence": "high"}

For each numbered card, write true if the word of the new passage has the same sense as on that card, and false if it has another sense.
The same sense means the new sense_gloss says the same as the sense_gloss of the card, even when the sentence, the situation or the words next to the word are different.
Another sense means the new sense_gloss is a different dictionary sense, for example one of the excluded_senses of the card.
Answer only with JSON, in this form: {"same_meaning": [true or false for each card]}
```

## Cases

| Wording | Run | Word   | Passage                                             | Expected | Got    | Result | Phrase, sense or message                                                                            |
| ------- | --- | ------ | --------------------------------------------------- | -------- | ------ | ------ | --------------------------------------------------------------------------------------------------- |
| current | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                                                            |
| current | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Er stieg auf die Leiter.                                                                            |
| current | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Abteilung                                                                            |
| current | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Abteilung                                                                            |
| current | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                                                           |
| current | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Eine Birne zum Nachtisch.                                                                           |
| current | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                                                               |
| current | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                                                               |
| current | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke auf dem Bett.                                                                            |
| current | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                                                                 |
| current | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke auf dem Bett.                                                                            |
| current | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist hoch.                                                                                 |
| current | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                                                                     |
| current | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He hit with the bat.                                                                                |
| current | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | The bat hung upside down.                                                                           |
| current | 1   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | He hit with the bat.                                                                                |
| current | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                                                            |
| current | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress spring broke.                                                                          |
| current | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | Flowers bloom in spring.                                                                            |
| current | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring flows.                                                                                     |
| current | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The mattress spring broke.                                                                          |
| current | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                                                                 |
| current | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук был натянут.                                                                                    |
| current | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук свежий.                                                                                 |
| current | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Лук был натянут.                                                                                    |
| current | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                                                                         |
| current | 1   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used.                                            |
| current | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё коса.                                                                                         |
| current | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                                                                     |
| records | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                                                            |
| records | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | eine Leiter zum Klettern                                                                            |
| records | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter hat eröffnet.                                                                            |
| records | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | error  | WRONG  | The language model gave a phrase that could not be used.                                            |
| records | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                                                           |
| records | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | eine Frucht des Birnbaums                                                                           |
| records | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                                                               |
| records | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | new    | WRONG  | Ich brauche eine Birne.                                                                             |
| records | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke überziehen.                                                                              |
| records | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                                                                 |
| records | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | new    | WRONG  | Die Decke ist weich.                                                                                |
| records | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | new    | WRONG  | Die Decke des Flurs.                                                                                |
| records | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                                                                     |
| records | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He swung the bat.                                                                                   |
| records | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | a nocturnal flying mammal with membranous wings                                                     |
| records | 1   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | New bat for cricket.                                                                                |
| records | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                                                            |
| records | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The spring is broken.                                                                               |
| records | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | the season of the year between winter and summer, characterized by blooming plants and mild weather |
| records | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring flows down.                                                                                |
| records | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | a coiled piece of metal that stores energy when compressed or stretched                             |
| records | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                                                                 |
| records | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Натянул лук охотник.                                                                                |
| records | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Я люблю зелёный лук.                                                                                |
| records | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | оружие для стрельбы стрелами                                                                        |
| records | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                                                                         |
| records | 1   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used.                                            |
| records | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | длинная прядь волос, заплетённая в одну длинную полосу                                              |
| records | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                                                                     |
| current | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                                                            |
| current | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | new    | WRONG  | Die Leiter anlehnen                                                                                 |
| current | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Abteilung                                                                            |
| current | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Abteilung                                                                            |
| current | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                                                           |
| current | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Eine Birne zum Nachtisch.                                                                           |
| current | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                                                               |
| current | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                                                               |
| current | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke aufs Bett.                                                                               |
| current | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                                                                 |
| current | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke aufs Bett.                                                                               |
| current | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist hoch.                                                                                 |
| current | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                                                                     |
| current | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He hit with the bat.                                                                                |
| current | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | A bat in the cave.                                                                                  |
| current | 2   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | He hit with the bat.                                                                                |
| current | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                                                            |
| current | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress spring broke.                                                                          |
| current | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | Flowers bloom in spring.                                                                            |
| current | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring bubbled up.                                                                                |
| current | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The mattress spring broke.                                                                          |
| current | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                                                                 |
| current | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук был натянут.                                                                                    |
| current | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук свежий.                                                                                 |
| current | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Лук был натянут.                                                                                    |
| current | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                                                                         |
| current | 2   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used.                                            |
| current | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё коса.                                                                                         |
| current | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                                                                     |
| records | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                                                            |
| records | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | eine Leiter zum Klettern                                                                            |
| records | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | exists | WRONG  | Person, die eine Abteilung oder eine Gruppe leitet.                                                 |
| records | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Person, die eine Gruppe oder Organisation führt                                                     |
| records | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                                                           |
| records | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | eine Frucht des Birnbaums                                                                           |
| records | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                                                               |
| records | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | new    | WRONG  | Ich brauche eine Birne.                                                                             |
| records | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke auf das Bett.                                                                            |
| records | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                                                                 |
| records | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | new    | WRONG  | Die Decke ist weich.                                                                                |
| records | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | new    | WRONG  | Die Decke des Flurs.                                                                                |
| records | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                                                                     |
| records | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He hit with the bat.                                                                                |
| records | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | a nocturnal flying mammal with membranous wings                                                     |
| records | 2   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | She bought a new bat.                                                                               |
| records | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                                                            |
| records | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The spring is broken.                                                                               |
| records | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | the season after winter and before summer, characterized by blooming plants and mild weather        |
| records | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring flows down.                                                                                |
| records | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | a coiled piece of metal that stores energy when compressed or stretched                             |
| records | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                                                                 |
| records | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук натянут и готов.                                                                                |
| records | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук на рынке.                                                                               |
| records | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | оружие для стрельбы стрелами                                                                        |
| records | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                                                                         |
| records | 2   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used.                                            |
| records | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | длинная прямая прядь волос, заплетённая в одну длинную полосу                                       |
| records | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                                                                     |
