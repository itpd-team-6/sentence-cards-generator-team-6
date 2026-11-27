# FR-009 meaning records, the six steps of the Customer

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`
- **Run at:** 2026-11-27 20:11 UTC
- **Requests sent to the model (retries included):** 193
- **Wordings:** current, sixsteps
- **Runs of each wording:** 2
- **Cases in each run:** 29, the same as in `eval_fr009_revision.py`

## Totals

| Wording  | Cases | As expected | Second cards made | Needed cards refused | Errors |
| -------- | ----- | ----------- | ----------------- | -------------------- | ------ |
| current  | 58    | 52          | 4                 | 0                    | 2      |
| sixsteps | 58    | 55          | 3                 | 0                    | 0      |

**Rule written before the run:** `sixsteps` is adopted only if it makes fewer second cards than `current` and refuses no needed card.

- **sixsteps:** NOT DECIDED: some requests failed, so the runs are not comparable.

## How a case runs

- Step 1: The case gives the word the learner selected and the sentence of the text.
- Step 2: One request asks the model for the lemma of the word.
- Step 3: The records of that lemma, in the language of the text, are looked up in the store of the run.
- Steps 4 and 5: When there are records, one request gives the model the word, the sentence and the numbered records, and asks which one matches.
- Step 6: When one matches, no card is made. When none matches, the model writes a new record from the sentence, the record is stored, and a card is made.

The script does not write the sentence of the card, because what the six steps decide is whether a card is made.

## Prompts used (the first of each)

Lemma (step 2):

```text
You are a lexicographer of German. A learner selected the word combination "Leiter" in this sentence:
Er stieg auf die ⟨TARGET⟩Leiter⟨/TARGET⟩, um die Äpfel zu pflücken.

Write the lemma of the word combination: its normalized dictionary form, without an article.
Answer only with JSON, in this form: {"lemma": "..."}
```

Match (steps 4 and 5):

```text
You are a lexicographer of German. A learner selected the word combination "Leiter" in this sentence:
Die ⟨TARGET⟩Leiter⟨/TARGET⟩ lehnte an der Hauswand.

These meaning records exist for the lemma "Leiter":
1. {"lemma": "Leiter", "pos": "noun", "sense_gloss": "ein Gerät zum Hinauf- und Hinabsteigen, bestehend aus Sprossen oder Stufen", "synonym_substitute": "Trittleiter", "typical_subjects/objects": {"subjects": ["Er", "jemand"], "objects": ["Äpfel"], "syntactic_frame": "auf die Leiter steigen"}, "excluded_senses": ["Führer einer Gruppe", "Kabel, das Strom leitet", "Person, die leitet oder führt", "Gerät zum Mischen von Farben"], "disambiguating_cues": "stieg auf die Leiter", "confidence": "high"}

Decide which meaning record matches the word combination in the sentence.
A record matches when the word combination has, in the sentence, the sense that the sense_gloss of the record describes, and not one of the excluded_senses of the record.
If no record matches, there is no match.
Answer only with JSON, in this form: {"match": <the number of the matching record, or null if none>, "reason": "<at most 15 words>"}
```

New meaning record (step 6):

```text
You are a lexicographer of German. In the sentence below, the word marked
⟨TARGET⟩...⟨/TARGET⟩ is used in one specific sense.

Sentence: Er stieg auf die ⟨TARGET⟩Leiter⟨/TARGET⟩, um die Äpfel zu pflücken.

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

## Cases

| Wording  | Run | Word   | Passage                                             | Expected | Got    | Result | Lemma  | Sense, phrase or message                                                                                                                                              |
| -------- | --- | ------ | --------------------------------------------------- | -------- | ------ | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| current  | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | -      | Er stieg auf die Leiter.                                                                                                                                              |
| current  | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | -      | Er stieg auf die Leiter.                                                                                                                                              |
| current  | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | -      | Der Leiter der Abteilung                                                                                                                                              |
| current  | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | -      | Der Leiter der Abteilung                                                                                                                                              |
| current  | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | -      | Die Birne ist süß.                                                                                                                                                    |
| current  | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | -      | Die Birne ist süß.                                                                                                                                                    |
| current  | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | -      | Die Birne ist kaputt.                                                                                                                                                 |
| current  | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | -      | Die Birne ist kaputt.                                                                                                                                                 |
| current  | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | -      | Eine Decke auf das Bett.                                                                                                                                              |
| current  | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | -      | Die Decke ist hoch.                                                                                                                                                   |
| current  | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | -      | Eine Decke auf das Bett.                                                                                                                                              |
| current  | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | -      | Die Decke ist hoch.                                                                                                                                                   |
| current  | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | -      | A bat flew out.                                                                                                                                                       |
| current  | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | -      | He hit with a bat.                                                                                                                                                    |
| current  | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | -      | A bat flew out.                                                                                                                                                       |
| current  | 1   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | -      | He hit with a bat.                                                                                                                                                    |
| current  | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | -      | Flowers bloom in spring.                                                                                                                                              |
| current  | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | -      | The spring broke.                                                                                                                                                     |
| current  | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | -      | Flowers bloom in spring.                                                                                                                                              |
| current  | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | -      | A spring of water                                                                                                                                                     |
| current  | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | -      | The spring broke.                                                                                                                                                     |
| current  | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | -      | Нарезать лук мелко.                                                                                                                                                   |
| current  | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | -      | Лук был натянут.                                                                                                                                                      |
| current  | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | -      | Зелёный лук свежий.                                                                                                                                                   |
| current  | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | -      | Лук был натянут.                                                                                                                                                      |
| current  | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | -      | У неё коса.                                                                                                                                                           |
| current  | 1   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | -      | The language model gave a phrase that could not be used.                                                                                                              |
| current  | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | -      | У неё коса.                                                                                                                                                           |
| current  | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | -      | Коса для травы.                                                                                                                                                       |
| sixsteps | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Leiter | new record: ein Gerät zum Hinauf- und Hinabsteigen, bestehend aus Sprossen oder Stufen                                                                                |
| sixsteps | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | new    | WRONG  | Leiter | new record: eine Leiter zum Klettern                                                                                                                                  |
| sixsteps | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Leiter | new record: Person, die eine Abteilung oder Gruppe leitet.                                                                                                            |
| sixsteps | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Leiter | record 3: Person, die eine Abteilung oder Gruppe leitet. (The sense is 'Person, die leitet')                                                                          |
| sixsteps | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Birne  | new record: eine Frucht der Birnbaumart                                                                                                                               |
| sixsteps | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Birne  | record 1: eine Frucht der Birnbaumart (The sentence describes peeling a fruit.)                                                                                       |
| sixsteps | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Birne  | new record: ein elektrisches Gerät, das zum Heizen oder zur Erzeugung von Licht verwendet wird                                                                        |
| sixsteps | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Birne  | record 2: ein elektrisches Gerät, das zum Heizen oder zur Erzeugung von Licht verwendet wird (The sentence refers to a light bulb.)                                   |
| sixsteps | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Decke  | new record: ein weiches, flächiges Textil zum Zudecken                                                                                                                |
| sixsteps | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Decke  | new record: der obere Abschluss eines Raumes                                                                                                                          |
| sixsteps | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Decke  | record 1: ein weiches, flächiges Textil zum Zudecken (The sense gloss matches and none of the excluded senses apply.)                                                 |
| sixsteps | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Decke  | record 2: der obere Abschluss eines Raumes (The sentence refers to the ceiling.)                                                                                      |
| sixsteps | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | bat    | new record: a small, nocturnal flying mammal                                                                                                                          |
| sixsteps | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | bat    | new record: a club used to hit a ball in games such as baseball or cricket                                                                                            |
| sixsteps | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | bat    | record 1: a small, nocturnal flying mammal (The sentence describes a nocturnal flying mammal.)                                                                        |
| sixsteps | 1   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | bat    | record 2: a club used to hit a ball in games such as baseball or cricket (The sentence describes a cricket bat.)                                                      |
| sixsteps | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | spring | new record: the season of the year between winter and summer, characterized by mild weather and the blossoming of plants                                              |
| sixsteps | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | spring | new record: a coiled metal device that provides support and rebounds when compressed                                                                                  |
| sixsteps | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | spring | record 1: the season of the year between winter and summer, characterized by mild weather and the blossoming of plants (The sentence describes the season of spring.) |
| sixsteps | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | spring | new record: a natural flow of water from the ground                                                                                                                   |
| sixsteps | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | spring | record 2: a coiled metal device that provides support and rebounds when compressed (The coil spring is a metal device.)                                               |
| sixsteps | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | лук    | new record: овощ, который используется в кулинарии                                                                                                                    |
| sixsteps | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | лук    | new record: оружие для стрельбы стрелами                                                                                                                              |
| sixsteps | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | exists | ok     | лук    | record 1: овощ, который используется в кулинарии (The sentence describes a vegetable bought at a market.)                                                             |
| sixsteps | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | лук    | record 2: оружие для стрельбы стрелами (The sentence describes a bow for shooting arrows.)                                                                            |
| sixsteps | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | коса   | new record: длинная прямая прядь волос, заплетённая в косу                                                                                                            |
| sixsteps | 1   | коса   | Дед косил траву острой косой.                       | new      | new    | ok     | коса   | new record: инструмент для кошения травы                                                                                                                              |
| sixsteps | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | коса   | record 1: длинная прямая прядь волос, заплетённая в косу (The sentence describes a braid of hair.)                                                                    |
| sixsteps | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | exists | ok     | коса   | record 2: инструмент для кошения травы (The subject is a person, and the object is implied.)                                                                          |
| current  | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | -      | Er stieg auf die Leiter.                                                                                                                                              |
| current  | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | -      | Er stieg auf die Leiter.                                                                                                                                              |
| current  | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | -      | Der Leiter der Abteilung                                                                                                                                              |
| current  | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | -      | Der Leiter der Abteilung                                                                                                                                              |
| current  | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | -      | Eine Birne zum Nachtisch.                                                                                                                                             |
| current  | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | -      | Eine Birne zum Nachtisch.                                                                                                                                             |
| current  | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | -      | Die Birne ist kaputt.                                                                                                                                                 |
| current  | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | -      | Die Birne ist kaputt.                                                                                                                                                 |
| current  | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | -      | Eine Decke auf dem Bett.                                                                                                                                              |
| current  | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | -      | Die Decke ist hoch.                                                                                                                                                   |
| current  | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | -      | Eine Decke auf dem Bett.                                                                                                                                              |
| current  | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | -      | Die Decke ist hoch.                                                                                                                                                   |
| current  | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | -      | A bat flew out.                                                                                                                                                       |
| current  | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | -      | He hit with the bat.                                                                                                                                                  |
| current  | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | -      | A bat flew out.                                                                                                                                                       |
| current  | 2   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | -      | He hit with the bat.                                                                                                                                                  |
| current  | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | -      | Flowers bloom in spring.                                                                                                                                              |
| current  | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | -      | The spring broke.                                                                                                                                                     |
| current  | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | -      | Flowers bloom in spring.                                                                                                                                              |
| current  | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | -      | A spring flows.                                                                                                                                                       |
| current  | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | -      | The spring broke.                                                                                                                                                     |
| current  | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | -      | Нарезать лук мелко.                                                                                                                                                   |
| current  | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | -      | Лук был натянут.                                                                                                                                                      |
| current  | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | -      | Зелёный лук свежий.                                                                                                                                                   |
| current  | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | -      | Лук был натянут.                                                                                                                                                      |
| current  | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | -      | У неё коса.                                                                                                                                                           |
| current  | 2   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | -      | The language model gave a phrase that could not be used.                                                                                                              |
| current  | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | -      | У неё коса.                                                                                                                                                           |
| current  | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | -      | Коса для травы.                                                                                                                                                       |
| sixsteps | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Leiter | new record: ein Gerät zum Hinauf- und Hinabsteigen, bestehend aus Sprossen oder Stufen                                                                                |
| sixsteps | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | new    | WRONG  | Leiter | new record: eine Leiter zum Klettern                                                                                                                                  |
| sixsteps | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Leiter | new record: Person, die eine Abteilung oder eine Gruppe leitet.                                                                                                       |
| sixsteps | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Leiter | record 3: Person, die eine Abteilung oder eine Gruppe leitet. (The sense is 'Person, die leitet'.)                                                                    |
| sixsteps | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Birne  | new record: eine Frucht der Birnbaumart                                                                                                                               |
| sixsteps | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Birne  | record 1: eine Frucht der Birnbaumart (The sentence describes peeling a fruit.)                                                                                       |
| sixsteps | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Birne  | new record: ein elektrisches Gerät, das zum Erhitzen von Speisen verwendet wird                                                                                       |
| sixsteps | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | new    | WRONG  | Birne  | new record: eine Glühbirne                                                                                                                                            |
| sixsteps | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Decke  | new record: ein textiles Flächengebilde, das zum Zudecken verwendet wird                                                                                              |
| sixsteps | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Decke  | new record: der obere Abschluss eines Raumes                                                                                                                          |
| sixsteps | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Decke  | record 1: ein textiles Flächengebilde, das zum Zudecken verwendet wird (The sentence describes a soft, covering object.)                                              |
| sixsteps | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Decke  | record 2: der obere Abschluss eines Raumes (The sentence describes the ceiling of a hallway.)                                                                         |
| sixsteps | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | bat    | new record: a small, nocturnal flying mammal                                                                                                                          |
| sixsteps | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | bat    | new record: a club used to hit a ball in games such as baseball or cricket                                                                                            |
| sixsteps | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | bat    | record 1: a small, nocturnal flying mammal (The sentence describes a flying mammal.)                                                                                  |
| sixsteps | 2   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | bat    | record 2: a club used to hit a ball in games such as baseball or cricket (The sentence refers to a cricket bat.)                                                      |
| sixsteps | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | spring | new record: the season of the year between winter and summer, characterized by mild weather and the blossoming of plants                                              |
| sixsteps | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | spring | new record: a coil of metal that provides support and cushioning in a mattress                                                                                        |
| sixsteps | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | spring | record 1: the season of the year between winter and summer, characterized by mild weather and the blossoming of plants (The sentence describes the season of spring.) |
| sixsteps | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | spring | new record: a natural flow of water from the ground                                                                                                                   |
| sixsteps | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | spring | record 2: a coil of metal that provides support and cushioning in a mattress (The sense is a coil of metal.)                                                          |
| sixsteps | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | лук    | new record: овощ с белыми или фиолетовыми луковицами, используемый в кулинарии                                                                                        |
| sixsteps | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | лук    | new record: оружие для стрельбы стрелами                                                                                                                              |
| sixsteps | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | exists | ok     | лук    | record 1: овощ с белыми или фиолетовыми луковицами, используемый в кулинарии (The word combination refers to the vegetable.)                                          |
| sixsteps | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | лук    | record 2: оружие для стрельбы стрелами (The sentence describes a weapon for shooting arrows.)                                                                         |
| sixsteps | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | коса   | new record: длинная прямая прядь волос, заплетенная в косу                                                                                                            |
| sixsteps | 2   | коса   | Дед косил траву острой косой.                       | new      | new    | ok     | коса   | new record: инструмент для кошения травы                                                                                                                              |
| sixsteps | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | коса   | record 1: длинная прямая прядь волос, заплетенная в косу (The sentence describes a braided hair strand.)                                                              |
| sixsteps | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | exists | ok     | коса   | record 2: инструмент для кошения травы (The subject is a kosar' and the object is grass.)                                                                             |
