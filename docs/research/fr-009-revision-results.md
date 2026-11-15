# FR-009 revision test

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`
- **Run at:** 2026-11-14 11:37 UTC
- **Requests sent to the model (retries included):** 174
- **Wordings:** current, long, customer-long
- **Runs of each wording:** 2
- **Cases in each run:** 29, on words that are not in the table of `eval_fr009.py`

## Totals

| Wording       | Cases | As expected | Second cards made | Needed cards refused | Errors |
| ------------- | ----- | ----------- | ----------------- | -------------------- | ------ |
| current       | 58    | 49          | 7                 | 0                    | 2      |
| long          | 58    | 42          | 8                 | 0                    | 8      |
| customer-long | 58    | 45          | 4                 | 9                    | 0      |

**Rule written before the run:** a wording is adopted only if it makes fewer second cards than `current` and refuses no needed card.

- **long:** NOT DECIDED: some requests failed, so the runs are not comparable.
- **customer-long:** NOT DECIDED: some requests failed, so the runs are not comparable.

## Cases

| Wording       | Run | Word   | Passage                                             | Expected | Got    | Result | Phrase or message                                        |
| ------------- | --- | ------ | --------------------------------------------------- | -------- | ------ | ------ | -------------------------------------------------------- |
| current       | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                 |
| current       | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Er stieg auf die Leiter.                                 |
| current       | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Leiter der Abteilung                                     |
| current       | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Leiter der Abteilung                                     |
| current       | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                |
| current       | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Eine Birne zum Nachtisch.                                |
| current       | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                    |
| current       | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                    |
| current       | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke auf dem Bett.                                 |
| current       | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                      |
| current       | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke auf dem Bett.                                 |
| current       | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist hoch.                                      |
| current       | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                          |
| current       | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He hit with the bat.                                     |
| current       | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | The bat hung upside down.                                |
| current       | 1   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | He hit with the bat.                                     |
| current       | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                 |
| current       | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The spring broke.                                        |
| current       | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | Flowers bloom in spring.                                 |
| current       | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring flows.                                          |
| current       | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The spring broke.                                        |
| current       | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                      |
| current       | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук был натянут.                                         |
| current       | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук свежий.                                      |
| current       | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Лук был натянут.                                         |
| current       | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                              |
| current       | 1   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| current       | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё коса.                                              |
| current       | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                          |
| current       | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                 |
| current       | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | new    | WRONG  | Die Leiter anlehnen.                                     |
| current       | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Abteilung                                 |
| current       | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Abteilung                                 |
| current       | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Eine Birne zum Nachtisch.                                |
| current       | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Eine Birne zum Nachtisch.                                |
| current       | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                    |
| current       | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                    |
| current       | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke auf das Bett.                                 |
| current       | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                      |
| current       | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke auf das Bett.                                 |
| current       | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist hoch.                                      |
| current       | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew out.                                          |
| current       | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He hit with the bat.                                     |
| current       | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | The bat in the cave.                                     |
| current       | 2   | bat    | She bought a new bat for the cricket match.         | exists   | exists | ok     | He hit with the bat.                                     |
| current       | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | Flowers bloom in spring.                                 |
| current       | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress spring broke.                               |
| current       | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | Flowers bloom in spring.                                 |
| current       | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | A spring flows.                                          |
| current       | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The mattress spring broke.                               |
| current       | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                      |
| current       | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук был натянут.                                         |
| current       | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук свежий.                                      |
| current       | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Лук был натянут.                                         |
| current       | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё коса.                                              |
| current       | 2   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| current       | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё коса.                                              |
| current       | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для травы.                                          |
| long          | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                 |
| long          | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Er stieg auf die Leiter.                                 |
| long          | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Gruppe                                    |
| long          | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Gruppe                                    |
| long          | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Die Birne war sehr saftig.                               |
| long          | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Die Birne war sehr saftig.                               |
| long          | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                    |
| long          | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                    |
| long          | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke auf das Bett.                                 |
| long          | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist hoch.                                      |
| long          | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke auf das Bett.                                 |
| long          | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist hoch.                                      |
| long          | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | The bat was hanging upside down.                         |
| long          | 1   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | The cricket bat was expensive.                           |
| long          | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | The flowers bloom in spring.                             |
| long          | 1   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress spring was bent.                            |
| long          | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | The flowers bloom in spring.                             |
| long          | 1   | spring | A clear spring ran down the hillside.               | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The mattress spring was bent.                            |
| long          | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук для блюда.                                  |
| long          | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Лук был готов к выстрелу.                                |
| long          | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | Зелёный лук на столе.                                    |
| long          | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Лук был готов к выстрелу.                                |
| long          | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё была длинная коса.                                 |
| long          | 1   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё была длинная коса.                                 |
| long          | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса была острая.                                        |
| long          | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Er stieg auf die Leiter.                                 |
| long          | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Er stieg auf die Leiter.                                 |
| long          | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Gruppe                                    |
| long          | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Gruppe                                    |
| long          | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Die Birne war sehr saftig.                               |
| long          | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Die Birne war sehr saftig.                               |
| long          | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | new    | ok     | Die Birne ist kaputt.                                    |
| long          | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist kaputt.                                    |
| long          | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Eine Decke für kaltes Wetter.                            |
| long          | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | new    | ok     | Die Decke ist sehr hoch.                                 |
| long          | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Eine Decke für kaltes Wetter.                            |
| long          | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist sehr hoch.                                 |
| long          | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | new    | WRONG  | The bat was hanging upside down.                         |
| long          | 2   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | The bat was brand new.                                   |
| long          | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | The flowers bloom in spring.                             |
| long          | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress spring broke.                               |
| long          | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | The flowers bloom in spring.                             |
| long          | 2   | spring | A clear spring ran down the hillside.               | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | The mattress spring broke.                               |
| long          | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук для блюда.                                  |
| long          | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | new    | ok     | Стрелок натягивает свой лук.                             |
| long          | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | new    | WRONG  | В салате есть зелёный лук.                               |
| long          | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Стрелок натягивает свой лук.                             |
| long          | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё была длинная коса.                                 |
| long          | 2   | коса   | Дед косил траву острой косой.                       | new      | error  | WRONG  | The language model gave a phrase that could not be used. |
| long          | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё была длинная коса.                                 |
| long          | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | new    | WRONG  | Коса для сенокошения.                                    |
| customer-long | 1   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Die Leiter ist hoch.                                     |
| customer-long | 1   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Die Leiter ist hoch.                                     |
| customer-long | 1   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Firma                                     |
| customer-long | 1   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Firma                                     |
| customer-long | 1   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Die Birne ist sehr süß.                                  |
| customer-long | 1   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Die Birne ist sehr süß.                                  |
| customer-long | 1   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | exists | WRONG  | Die Birne ist sehr süß.                                  |
| customer-long | 1   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | exists | ok     | Die Birne ist sehr süß.                                  |
| customer-long | 1   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Die Decke ist weich.                                     |
| customer-long | 1   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | exists | WRONG  | Die Decke ist weich.                                     |
| customer-long | 1   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Die Decke ist weich.                                     |
| customer-long | 1   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist weich.                                     |
| customer-long | 1   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | A bat flew away.                                         |
| customer-long | 1   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He swung the baseball bat.                               |
| customer-long | 1   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | A bat flew away.                                         |
| customer-long | 1   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | She swung her new cricket bat.                           |
| customer-long | 1   | spring | The flowers bloom in spring.                        | new      | new    | ok     | The weather is spring-like.                              |
| customer-long | 1   | spring | The spring of the old mattress broke.               | new      | exists | WRONG  | The weather is spring-like.                              |
| customer-long | 1   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | The weather is spring-like.                              |
| customer-long | 1   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | The water comes from a spring.                           |
| customer-long | 1   | spring | The coil spring in the pen pushed the tip out.      | exists   | new    | WRONG  | The coil spring in the pen                               |
| customer-long | 1   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук мелко.                                      |
| customer-long | 1   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | exists | WRONG  | Нарезать лук мелко.                                      |
| customer-long | 1   | лук    | На рынке мы купили зелёный лук.                     | exists   | exists | ok     | Нарезать лук мелко.                                      |
| customer-long | 1   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Нарезать лук мелко.                                      |
| customer-long | 1   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё длинная коса.                                      |
| customer-long | 1   | коса   | Дед косил траву острой косой.                       | new      | exists | WRONG  | У неё длинная коса.                                      |
| customer-long | 1   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё длинная коса.                                      |
| customer-long | 1   | коса   | Косарь наточил косу перед работой.                  | exists   | exists | ok     | У неё длинная коса.                                      |
| customer-long | 2   | Leiter | Er stieg auf die Leiter, um die Äpfel zu pflücken.  | new      | new    | ok     | Die Leiter ist wackelig.                                 |
| customer-long | 2   | Leiter | Die Leiter lehnte an der Hauswand.                  | exists   | exists | ok     | Die Leiter ist wackelig.                                 |
| customer-long | 2   | Leiter | Der Leiter der Abteilung hat die Sitzung eröffnet.  | new      | new    | ok     | Der Leiter der Firma                                     |
| customer-long | 2   | Leiter | Der Leiter des Chors probte jeden Dienstag mit uns. | exists   | exists | ok     | Der Leiter der Firma                                     |
| customer-long | 2   | Birne  | Zum Nachtisch gab es eine saftige Birne.            | new      | new    | ok     | Ich esse eine Birne.                                     |
| customer-long | 2   | Birne  | Er schälte die Birne mit einem kleinen Messer.      | exists   | exists | ok     | Ich esse eine Birne.                                     |
| customer-long | 2   | Birne  | Die Birne in der Küche ist durchgebrannt.           | new      | exists | WRONG  | Ich esse eine Birne.                                     |
| customer-long | 2   | Birne  | Ich muss eine neue Birne für die Lampe kaufen.      | exists   | new    | WRONG  | Ich kaufe eine Birne.                                    |
| customer-long | 2   | Decke  | Im Winter lege ich mir eine warme Decke aufs Bett.  | new      | new    | ok     | Die Decke ist weich.                                     |
| customer-long | 2   | Decke  | Die Decke im Wohnzimmer ist sehr hoch.              | new      | exists | WRONG  | Die Decke ist weich.                                     |
| customer-long | 2   | Decke  | Das Kind kuschelte sich in die weiche Decke.        | exists   | exists | ok     | Die Decke ist weich.                                     |
| customer-long | 2   | Decke  | Der Maler strich die Decke des Flurs weiß.          | exists   | exists | ok     | Die Decke ist weich.                                     |
| customer-long | 2   | bat    | A bat flew out of the old barn at dusk.             | new      | new    | ok     | The bat flew away.                                       |
| customer-long | 2   | bat    | He swung the bat and hit the ball over the fence.   | new      | new    | ok     | He swung the baseball bat.                               |
| customer-long | 2   | bat    | The bat hung upside down in the cave all day.       | exists   | exists | ok     | The bat flew away.                                       |
| customer-long | 2   | bat    | She bought a new bat for the cricket match.         | exists   | new    | WRONG  | She bought a new cricket bat.                            |
| customer-long | 2   | spring | The flowers bloom in spring.                        | new      | new    | ok     | The weather is spring-like.                              |
| customer-long | 2   | spring | The spring of the old mattress broke.               | new      | new    | ok     | The mattress has a broken spring.                        |
| customer-long | 2   | spring | In early spring the garden is full of birds.        | exists   | exists | ok     | The weather is spring-like.                              |
| customer-long | 2   | spring | A clear spring ran down the hillside.               | new      | new    | ok     | a clear bubbling spring                                  |
| customer-long | 2   | spring | The coil spring in the pen pushed the tip out.      | exists   | exists | ok     | a clear bubbling spring                                  |
| customer-long | 2   | лук    | Я нарезал лук для супа.                             | new      | new    | ok     | Нарезать лук для салата.                                 |
| customer-long | 2   | лук    | Охотник натянул лук и выпустил стрелу.              | new      | exists | WRONG  | Нарезать лук для салата.                                 |
| customer-long | 2   | лук    | На рынке мы купили зелёный лук.                     | exists   | exists | ok     | Нарезать лук для салата.                                 |
| customer-long | 2   | лук    | Он взял лук и колчан со стрелами.                   | exists   | exists | ok     | Нарезать лук для салата.                                 |
| customer-long | 2   | коса   | У девочки была длинная русая коса.                  | new      | new    | ok     | У неё длинная коса.                                      |
| customer-long | 2   | коса   | Дед косил траву острой косой.                       | new      | exists | WRONG  | У неё длинная коса.                                      |
| customer-long | 2   | коса   | Она заплела косу перед школой.                      | exists   | exists | ok     | У неё длинная коса.                                      |
| customer-long | 2   | коса   | Косарь наточил косу перед работой.                  | exists   | exists | ok     | У неё длинная коса.                                      |
