# Sentence quality test

This is the Week 1 check of [`ASM-01`](../../../docs/assumptions.md#asm-01), run on 2026-10-08 and reported in the [Week 2 meeting](../meeting-report.md#previous-action-points).

## Setup

- **Model (alias):** gemini-flash-lite-latest
- **Model (resolved):** gemini-3.5-flash-lite
- **Where:** Google AI Studio chat, no API key selected
- **Date:** 2026-10-08
- **Thinking level:** Minimal
- **Grounding with Google Search:** Off
- **Method:** one new chat per language, same prompt, first answer only, no regeneration, words fixed before running (listed below)
- **Verdicts:** OK = would use as is; CORRECT = we would fix it; UNSURE = cannot judge
- **Reasons for CORRECT:** 1 grammar error, 2 unnatural, 3 wrong word sense, 4 wrong translation, 5 level not B1
- **Judge:** Claude (second opinion, an AI judging another AI). Native check: still pending, so no native speaker has checked these verdicts yet

## German (DE)

Prompt:

```text
You are helping create language-learning flashcards.
For each of the following 20 German words, write ONE natural example
sentence (CEFR B1 level) that uses the word, and give an English
translation of that sentence.
Output a table with columns: word | sentence | translation.
Words: Haus, essen, Freund, arbeiten, Wetter, Zeit, lernen, Straße, kaufen, Frühstück, Schloss, Bank, Decke, Leiter, Kiefer, anfangen, aufstehen, einladen, sich erinnern, gehören
```

| #   | Word          | Sentence                                                                   | Translation                                                                 | Verdict | Reason                                                                                                                    |
| --- | ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Haus          | Wir haben letztes Jahr ein altes Haus auf dem Land gekauft.                | We bought an old house in the country last year.                            | OK      |                                                                                                                           |
| 2   | essen         | Wir essen heute Abend zusammen in einem italienischen Restaurant.          | We are eating together in an Italian restaurant tonight.                    | OK      |                                                                                                                           |
| 3   | Freund        | Mein bester Freund zieht nächste Woche in eine andere Stadt.               | My best friend is moving to another city next week.                         | OK      |                                                                                                                           |
| 4   | arbeiten      | Mein Vater arbeitet als Ingenieur bei einer großen Firma.                  | My father works as an engineer at a large company.                          | OK      |                                                                                                                           |
| 5   | Wetter        | Bei diesem schönen Wetter sollten wir einen Ausflug in die Natur machen.   | In this nice weather, we should take a trip into nature.                    | OK      |                                                                                                                           |
| 6   | Zeit          | Hast du am Wochenende Zeit, mir beim Umzug zu helfen?                      | Do you have time this weekend to help me with the move?                     | OK      |                                                                                                                           |
| 7   | lernen        | Ich muss heute Vormittag für meinen Deutschtest lernen.                    | I have to study for my German test this morning.                            | OK      |                                                                                                                           |
| 8   | Straße        | Die Kinder spielen oft Fußball auf der ruhigen Straße vor unserem Haus.    | The children often play football on the quiet street in front of our house. | OK      |                                                                                                                           |
| 9   | kaufen        | Ich möchte mir nächste Woche ein neues Fahrrad kaufen.                     | I would like to buy a new bicycle next week.                                | OK      |                                                                                                                           |
| 10  | Frühstück     | Am Sonntag nehme ich mir immer viel Zeit für ein gemütliches Frühstück.    | On Sundays, I always take a lot of time for a leisurely breakfast.          | OK      |                                                                                                                           |
| 11  | Schloss       | Während unseres Urlaubs haben wir ein wunderschönes altes Schloss besucht. | During our vacation, we visited a beautiful old castle.                     | OK      |                                                                                                                           |
| 12  | Bank          | Ich muss dringend zur Bank gehen, um etwas Geld abzuheben.                 | I urgently need to go to the bank to withdraw some money.                   | OK      |                                                                                                                           |
| 13  | Decke         | Es ist ein bisschen kühl im Wohnzimmer, holst du mir bitte eine Decke?     | It is a bit cool in the living room, could you please get me a blanket?     | OK      |                                                                                                                           |
| 14  | Leiter        | Kannst du mir die Leiter reichen, damit ich die Glühbirne wechseln kann?   | Can you hand me the ladder so I can change the light bulb?                  | OK      |                                                                                                                           |
| 15  | Kiefer        | Nach dem Zahnarztbesuch tat mir der Kiefer ein bisschen weh.               | My jaw hurt a little bit after the dentist appointment.                     | OK      |                                                                                                                           |
| 16  | anfangen      | Der Sprachkurs fängt nächste Woche Montag um 18 Uhr an.                    | The language course starts next week on Monday at 6 PM.                     | OK      |                                                                                                                           |
| 17  | aufstehen     | Unter der Woche muss ich jeden Tag um sechs Uhr aufstehen.                 | During the week, I have to get up at six o'clock every day.                 | OK      |                                                                                                                           |
| 18  | einladen      | Wir möchten dich gerne am Freitag zu unserem Geburtstag einladen.          | We would like to invite you to our birthday on Friday.                      | CORRECT | 2: "unserem Geburtstag" is unnatural (one person has a birthday); "meinem Geburtstag" or "unserer Feier" would be natural |
| 19  | sich erinnern | Ich kann mich nicht mehr genau daran erinnern, wo wir geparkt haben.       | I can no longer remember exactly where we parked.                           | OK      |                                                                                                                           |
| 20  | gehören       | Entschuldigung, wissen Sie, wem dieses blaue Fahrrad gehört?               | Excuse me, do you know whose blue bicycle this is?                          | OK      |                                                                                                                           |

Notes:

- #16 "nächste Woche Montag" is colloquial but acceptable; counted as OK.
- Words with several meanings (Schloss, Bank, Decke, Leiter, Kiefer): the model used the correct sense but only one sense per word.

**Count DE:** OK 19, CORRECT 1, UNSURE 0 (corrected: 1 of 20 = 5%)

## Russian (RU)

Prompt:

```text
You are helping create language-learning flashcards.
For each of the following 20 Russian words, write ONE natural example
sentence (CEFR B1 level) that uses the word, and give an English
translation of that sentence.
Output a table with columns: word | sentence | translation.
Words: дом, работать, друг, погода, время, учиться, улица, покупать, завтрак, вода, ключ, коса, лук, мир, ручка, прочитать, идти, забыть, помогать, нравиться
```

| #   | Word      | Sentence                                                    | Translation                                                            | Verdict | Reason                                                                                       |
| --- | --------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| 1   | дом       | Мой дом находится недалеко от центра города.                | My house is located not far from the city center.                      | OK      |                                                                                              |
| 2   | работать  | Мой брат работает программистом в крупной компании.         | My brother works as a programmer in a large company.                   | OK      |                                                                                              |
| 3   | друг      | Вчера я встретился со своим лучшим другом в кафе.           | Yesterday I met with my best friend at a cafe.                         | OK      |                                                                                              |
| 4   | погода    | Из-за плохой погоды мы решили остаться дома.                | Due to the bad weather, we decided to stay at home.                    | OK      |                                                                                              |
| 5   | время     | У меня совсем нет времени на просмотр телевизора.           | I have no time at all to watch television.                             | CORRECT | 2: grammatical but stilted ("на просмотр телевизора"); natural would be "смотреть телевизор" |
| 6   | учиться   | После окончания школы она планирует учиться в университете. | After graduating from school, she plans to study at a university.      | OK      |                                                                                              |
| 7   | улица     | На нашей улице посадили много новых деревьев.               | They planted many new trees on our street.                             | OK      |                                                                                              |
| 8   | покупать  | Мы обычно покупаем свежие овощи на рынке.                   | We usually buy fresh vegetables at the market.                         | OK      |                                                                                              |
| 9   | завтрак   | Каждое утро я готовлю себе лёгкий завтрак.                  | Every morning I prepare a light breakfast for myself.                  | OK      |                                                                                              |
| 10  | вода      | В жаркий день очень важно пить много чистой воды.           | On a hot day, it is very important to drink plenty of clean water.     | OK      |                                                                                              |
| 11  | ключ      | Я забыл ключ от квартиры на кухонном столе.                 | I forgot my apartment key on the kitchen table.                        | OK      |                                                                                              |
| 12  | коса      | Девушка заплела свои длинные волосы в красивую косу.        | The girl wove her long hair into a beautiful braid.                    | OK      | Translation "wove" is slightly odd English ("braided"); not counted                          |
| 13  | лук       | Для этого супа нужно мелко нарезать лук и морковь.          | For this soup, you need to finely chop the onion and carrots.          | OK      |                                                                                              |
| 14  | мир       | Путешествия помогают узнать больше о разных культурах мира. | Traveling helps to learn more about different cultures of the world.   | OK      |                                                                                              |
| 15  | ручка     | У вас найдется ручка, чтобы записать этот адрес?            | Do you have a pen to write down this address?                          | OK      |                                                                                              |
| 16  | прочитать | Я хочу прочитать эту книгу до конца недели.                 | I want to read this book by the end of the week.                       | OK      |                                                                                              |
| 17  | идти      | Мы шли по парку и разговаривали о планах на отпуск.         | We were walking through the park and talking about our vacation plans. | OK      |                                                                                              |
| 18  | забыть    | Я боюсь забыть всё, что выучил перед экзаменом.             | I am afraid of forgetting everything I learned before the exam.        | OK      |                                                                                              |
| 19  | помогать  | Дети часто помогают родителям убирать квартиру.             | Children often help their parents clean the apartment.                 | OK      |                                                                                              |
| 20  | нравиться | Мне очень нравится гулять по вечернему городу.              | I really like walking around the evening city.                         | OK      |                                                                                              |

Notes:

- Words with several meanings (ключ, коса, лук, мир, ручка): the model used a correct sense but only one per word.
- The model used the aspect and the motion verb correctly (прочитать, идти).

**Count RU:** OK 19, CORRECT 1, UNSURE 0 (corrected: 1 of 20 = 5%)

## English (EN)

Prompt (translation into Russian):

```text
You are helping create language-learning flashcards.
For each of the following 20 English words, write ONE natural example
sentence (CEFR B1 level) that uses the word, and give a Russian
translation of that sentence.
Output a table with columns: word | sentence | translation.
Words: house, work, friend, weather, time, learn, street, buy, breakfast, water, bank, light, bark, spring, match, give up, look after, turn down, get along, come across
```

| #   | Word        | Sentence                                                          | Translation (RU)                                                                      | Verdict | Reason                                                                     |
| --- | ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| 1   | house       | They live in a big old house near the park.                       | Они живут в большом старом доме возле парка.                                          | OK      |                                                                            |
| 2   | work        | My brother has to work on Saturday mornings.                      | Мой брат должен работать по субботам утром.                                           | OK      |                                                                            |
| 3   | friend      | I am going to the cinema with a good friend of mine.              | Я иду в кино с моим хорошим другом.                                                   | OK      |                                                                            |
| 4   | weather     | The weather was so nice yesterday that we went for a long walk.   | Вчера погода была такая хорошая, что мы пошли на долгую прогулку.                     | OK      |                                                                            |
| 5   | time        | We spent a lot of time preparing for the presentation.            | Мы потратили много времени на подготовку к презентации.                               | OK      |                                                                            |
| 6   | learn       | She wants to learn how to play the guitar this year.              | В этом году она хочет научиться играть на гитаре.                                     | OK      |                                                                            |
| 7   | street      | There are many small cafes on this quiet street.                  | На этой тихой улице много маленьких кафе.                                             | OK      |                                                                            |
| 8   | buy         | I need to buy some fresh fruit and vegetables from the market.    | Мне нужно купить свежих фруктов и овощей на рынке.                                    | OK      |                                                                            |
| 9   | breakfast   | We usually have cereal and coffee for breakfast.                  | Обычно на завтрак мы едим хлопья и пьем кофе.                                         | OK      |                                                                            |
| 10  | water       | It is important to drink enough water every day.                  | Важно пить достаточно воды каждый день.                                               | OK      |                                                                            |
| 11  | bank        | I need to go to the bank to open a savings account.               | Мне нужно пойти в банк, чтобы открыть сберегательный счет.                            | OK      |                                                                            |
| 12  | light       | Please turn off the light when you leave the room.                | Пожалуйста, выключайте свет, когда выходите из комнаты.                               | OK      |                                                                            |
| 13  | bark        | Our dog always starts to bark when someone knocks on the door.    | наша собака всегда начинает лаять, когда кто-то стучит в дверь.                       | CORRECT | 1: the Russian translation starts with a lowercase letter ("наша")         |
| 14  | spring      | Flowers usually start to bloom in early spring.                   | Цветки обычно начинают распускаться ранней весной.                                    | CORRECT | 4: "Цветки" is the botanical term; "Цветы" is the natural word for flowers |
| 15  | match       | Did you watch the football match on television last night?        | Ты смотрел вчера вечером футбольный матч по телевизору?                               | OK      |                                                                            |
| 16  | give up     | You should never give up, even when things get difficult.         | Тебе никогда не стоит сдаваться, даже когда становится трудно.                        | OK      |                                                                            |
| 17  | look after  | Can you look after my cat while I am on holiday?                  | Можешь присмотреть за моей кошкой, пока я буду в отпуске?                             | OK      |                                                                            |
| 18  | turn down   | He had to turn down the job offer because the salary was too low. | Ему пришлось отклонить предложение о работе, потому что зарплата была слишком низкой. | OK      |                                                                            |
| 19  | get along   | My sister and I get along very well most of the time.             | Мы с сестрой большую часть времени очень хорошо ладим.                                | OK      |                                                                            |
| 20  | come across | I didn't expect to come across my old school books in the attic.  | Я не ожидал случайно наткнуться на свои старые школьные учебники на чердаке.          | OK      |                                                                            |

Notes:

- All 20 English sentences are correct and natural; both problems are in the Russian translations.
- Words with several meanings (bank, light, bark, spring, match): the model used one common sense per word (money bank, lamp, dog, season, sports match).

**Count EN:** OK 18, CORRECT 2, UNSURE 0 (corrected: 2 of 20 = 10%)

## Summary

| Language | OK  | CORRECT | UNSURE | Corrected |
| -------- | --- | ------- | ------ | --------- |
| DE       | 19  | 1       | 0      | 1/20      |
| RU       | 19  | 1       | 0      | 1/20      |
| EN       | 18  | 2       | 0      | 2/20      |
| Total    | 56  | 4       | 0      | 4/60 (7%) |

## Word lists

Fixed before running the model and not changed after seeing any output. Each list has 10 common words, 5 words with several meanings and 5 words with hard grammar.

- **German:** Haus, essen, Freund, arbeiten, Wetter, Zeit, lernen, Straße, kaufen, Frühstück; Schloss, Bank, Decke, Leiter, Kiefer; anfangen, aufstehen, einladen, sich erinnern, gehören
- **Russian:** дом, работать, друг, погода, время, учиться, улица, покупать, завтрак, вода; ключ, коса, лук, мир, ручка; прочитать, идти, забыть, помогать, нравиться
- **English:** house, work, friend, weather, time, learn, street, buy, breakfast, water; bank, light, bark, spring, match; give up, look after, turn down, get along, come across

## What this does and does not show

- It is one free model, one prompt per language, and the first answer only.
- The verdicts are from an AI judge, not a native speaker, so the 4 of 60 is a lower bound we have not confirmed.
- The words were chosen by us, with 10 common ones per language, so a learner's own words may do worse.
