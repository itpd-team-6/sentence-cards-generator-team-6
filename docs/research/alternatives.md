# Alternatives

## Problem space

Language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

Every alternative below is evaluated against this sentence.
A product that does not serve it is not an alternative, however popular it is.

## How we researched

We started from a wide list of candidates (kept in `reports/week-01/candidate-list.md`, including the ones we cut), and chose four that mix the three kinds the course requires: a direct competitor, adjacent substitutes, and an open-source or self-hosted option.

We fixed the properties below **before** evaluating any product, and used the same set for every alternative.

Screenshots and working notes are on our research board: [Miro board](https://miro.com/app/board/uXjVHgAUe_0=/).

## Properties

| Property                               | What we look at                                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Card creation effort                   | How much manual work it takes to go from a word in a text to a finished card.                                          |
| Content source                         | Whether the learner can use their own texts, or only content the product provides.                                     |
| Sentence and translation quality       | Where example sentences and translations come from (LLM, dictionary, humans), and whether the learner can correct them. |
| Pronunciation                          | Whether cards get audio or a transcription, and in which languages.                                                    |
| Language coverage (RU/EN/DE)           | Whether Russian, English and German are supported, for the content and for the interface.                              |
| Spaced repetition and prioritization   | Whether cards are scheduled by spaced repetition, and whether the learner can push specific words to be learned first. |
| Teacher involvement                    | Whether a teacher can connect to a learner and see or review their cards.                                              |
| Deployment and data control            | Hosted, self-hosted or local, and where the learner's uploaded texts go.                                               |

## Alternatives at a glance

| ID     | Alternative             | Kind                       |
| ------ | ----------------------- | -------------------------- |
| ALT-01 | songs2anki              | Self-hosted                |
| ALT-02 | LingQ                   | Direct competitor          |
| ALT-03 | Quizlet                 | Adjacent substitute        |
| ALT-04 | Anki + ChatGPT (manual) | Adjacent substitute        |

## ALT-01: songs2anki

**Kind:** Self-hosted (the course catalog's proof of concept)
**Link:** https://github.com/deemp/songs2anki
**Version looked at:** commit `f4a9e9a` (2025-06-02), evaluated on 2026-09-29 with Anki 25.07.5
**Depth of evaluation:** read the README; imported and studied the demo deck; reproduced the generation step ([README, "Usage"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#usage), step 7) by sending the prompt from [`lib.py` (`make_prompt`)](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/custom/de/script/lib.py#L185) and five words from the author's [`deck.csv`]([https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/custom/de/en/deck/deck.csv](https://github.com/deemp/songs2anki/tree/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/custom/de/en/deck)) to ChatGPT, then imported the output into Anki ([README, "Raw deck"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#raw-deck)).
The scripts in `custom/de/script/` were searched with an AI assistant; findings that come only from that search are marked _(AI search)_ (see `reports/week-01/ai-usage.md`).
We did not run the scripts: they need Nix on Linux plus OpenAI and Genius API keys.

**Problem it solves:** a German learner gets an Anki deck for the unknown words in the lyrics of songs they listen to, with an LLM-generated example sentence and English translations.
It is a set of scripts run cell by cell in VS Code, with no user interface: lyrics are fetched from Genius, the words are extracted, and `gpt-4o-mini` writes a sentence for each ([README, "Usage"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#usage)).

**Observations by property**

| Property                             | Observation                                                                                                                                                          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card creation effort                 | None per card once it runs, but setup and every run are developer work: Nix, API keys, running cells in order ([README, "Setup"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#setup) and [README, "Usage"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#usage)).                         |
| Content source                       | Texts kept in a YAML file: by default song lyrics fetched from Genius for a hand-written list of titles, but fetching can be skipped and texts written into the file by hand ([README, "Usage"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#usage), steps 1, 3 and 4). The learner chooses words only by editing CSV files: a list of known words to exclude (`known.csv`, _(AI search)_) or a list of unknown words to keep ([README](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md), introduction); words cannot be marked in the text itself.   |
| Sentence and translation quality     | New sentences written by the LLM, not taken from the song. In our reproduction all 5 sentences met the project's own rules, 60–70 characters and containing the word ([README, "Constraints"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#constraints)), at 60–66 characters.                        |
| Pronunciation                        | The demo deck has audio for word and sentence in both languages (hands-on). The cards we generated had none: the pipeline's CSV has no audio columns ([README, "Fields in the raw deck"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#fields-in-the-raw-deck)). In the kickoff, the Customer explained that he added the audio in Anki with the HyperTTS add-on and Google TTS ([meeting transcript](../../reports/week-01/meeting-transcript.md), [00:10:59]).             |
| Language coverage (RU/EN/DE)         | German → English only; no Russian ([README](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md), introduction).                                                                                                                     |
| Spaced repetition and prioritization | Scheduling is Anki's. Order is fixed by where a word first appears in the lyrics, and swapping the sources "will affect indices" and breaks progress ([README, "Deck"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#deck)). |
| Teacher involvement                  | None found.                                                                                                                                                          |
| Deployment and data control          | Runs locally; words go to the OpenAI API and song titles to Genius.                                                                                                  |

**Strengths**

- Generated sentences are checked against length, rare-word and presence rules ([README, "Constraints"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#constraints)); failing ones are removed and generated again on the next run ([README, "Partitioning the raw deck"](https://github.com/deemp/songs2anki/blob/f4a9e9a52e0e37273f507863acae0dbd9e6284aa/README.md#partitioning-the-raw-deck)).
- Nouns whose meaning depends on the article get separate cards: "das Laster" (vice) and "der Laster" (truck) (hands-on, demo deck).
- Each note gives two cards, German → English and English → German, with audio in the demo (hands-on).

**Weaknesses**

- Only a developer can produce a deck; a learner or a teacher without programming skills cannot.
- The learner cannot choose words in a text, the opposite of the catalog's "words selected by the user in texts uploaded by the user".
- Re-prioritizing words breaks the learner's progress, which is the pain the catalog describes.

**Could not find out:** what a deck costs in API usage.

**Evidence on the board:** frames `ALT-01 songs2anki` (demo card front and back, ChatGPT output, CSV import, generated card without audio).

## ALT-02: LingQ

**Kind:** Direct competitor
**Link:** https://www.lingq.com/
**Version looked at:** web app, free account, 2026-09-29
**Depth of evaluation:** created a free account learning German; imported a paragraph of the German Wikipedia article on Anki with "Import → Lesson → Type or Paste"; saved "Lernkartei" as a LingQ and reviewed it as a flashcard.
The official pages on the free and Premium plans and on LingQ for Schools were read with an AI assistant; findings that come only from them are marked _(AI search)_ (see `reports/week-01/ai-usage.md`).
We did not test the browser extension, the streaming imports, the export, the "For schools" offer, or Russian as a target language.

**Problem it solves:** a learner reads or watches content they choose in the target language, clicks unknown words to save them with a meaning, and reviews them later.

**Observations by property**

| Property                             | Observation                                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card creation effort                 | One click on a word in the text, then one click on a suggested meaning; no typing needed (hands-on). The free plan caps saved words at 20 in total (hands-on; [support](https://lingq-support.groovehq.com/help/what-is-the-lingqs-limit)). |
| Content source                       | The learner's own content: pasted text, web links, files and e-books, scanned pages, Netflix, Prime Video, YouTube, TikTok and Instagram, plus a browser extension and bulk import (hands-on, import screen). Also a built-in library of graded lessons. |
| Sentence and translation quality     | Meanings are suggested by other users, by dictionaries (WordReference, DICT.cc, Linguee) and one marked with an AI icon; the learner can type their own (hands-on). The example sentence on the card is the sentence from the imported text, not a new one. |
| Pronunciation                        | The flashcard plays audio for the word and for the source sentence (hands-on). Generating audio for a whole imported lesson is marked Premium (hands-on, "Generate Lesson Audio").                              |
| Language coverage (RU/EN/DE)         | Russian, English and German are among the languages offered when choosing what to learn (hands-on). We did not check the interface languages.                                                                                     |
| Spaced repetition and prioritization | Each saved word carries a status the learner sets (1–4, known, or ignored), and review can be limited to what is due, one lesson or one page (hands-on, review menu).                                          |
| Teacher involvement                  | A separate "LingQ for Schools" offer: a teacher portal and dashboard to "view both individual and group student progress", "upload lessons", "share lessons with your group" and a private classroom forum. The page does not say that a teacher can see or correct a student's saved words, and gives no price, only "Contact us" ([LingQ for Schools](https://www.lingq.com/en/schools/), _(AI search)_). |
| Deployment and data control          | Hosted service; imported texts are stored in the learner's account. |

**Strengths**

- Getting content in is almost effortless: many sources, one click each (hands-on, import screen).
- Words are chosen while reading, in context, which is what the course catalog asks for (hands-on).
- Review keeps the original sentence and its audio on the card (hands-on).

**Weaknesses**

- The free plan is a trial, not a tool: 20 saved words in total (hands-on).
- A word only ever gets the one sentence it appeared in. If that sentence is long, rare or confusing, so is the card; we saw no option to generate a new example sentence (hands-on).
- Lesson audio for the learner's own texts is Premium (hands-on).
- A learner's or a school's texts go to LingQ's servers; we found no self-hosted option.

**Could not find out:** what LingQ for Schools costs, and whether a teacher can review a student's saved words; which review types are Premium (we reviewed a flashcard on a free account, while the [blog](https://www.lingq.com/blog/lingq-free-vs-premium/) lists "flashcard quizzes" as Premium).

**Evidence on the board:** frames `ALT-02 LingQ` (import sources, pasted text, reader, word panel, saved word, review menu, flashcard front and back).

## ALT-03: Quizlet

**Kind:** Adjacent substitute  
**Link:** https://quizlet.com/  
**Version looked at:** web app, 2026-09-30  
**Depth of evaluation:** Signed up with a free account, created a language study set, tested AI Flashcard Generator / Smart Assist, tried Learn and Flashcards modes, and checked the Classes feature. Did not fully test paid Plus features.

**Problem it solves:** A popular flashcard platform that helps students and teachers create, share, and study vocabulary sets with AI generation and classroom tools.

**Observations by property**

| Property                             | Observation                                   |
| ------------------------------------ | --------------------------------------------- |
| Card creation effort                 | Manual creation is slow. AI tools (Smart Assist / Magic Notes) generate cards quickly from text or a topic, but free tier has limits. (hands-on) |
| Content source                       | User notes, PDFs, slides, or a topic prompt. Also has a large community library. (https://quizlet.com/features/ai-flashcard-generator) |
| Sentence and translation quality     | Mostly term-definition pairs. Good for vocabulary, weaker for full sentence context unless the source text already contains sentences. (hands-on) |
| Pronunciation                        | Built-in audio for many languages, quality is generally good. (hands-on) |
| Language coverage (RU/EN/DE)         | Strong support for English, German, Russian and many other languages. (hands-on) |
| Spaced repetition and prioritization | Adaptive Learn mode prioritises difficult cards. Not as advanced as Anki. (hands-on) |
| Teacher involvement                  | Strong: Classes, shared sets, and Live games. Good support for teachers. (https://quizlet.com) |
| Deployment and data control          | Fully cloud-based. Data is stored on Quizlet servers. No self-hosting option. (hands-on) |

**Strengths**

- Fast AI card generation from notes or topics. (hands-on)
- Excellent teacher and classroom features. (https://quizlet.com)
- Very large existing library of ready-made sets. (hands-on)

**Weaknesses**

- AI-generated cards are mostly simple term-definition pairs, not rich sentence-in-context cards. (hands-on)
- Free tier limits AI features and advanced study modes. (hands-on)
- No local or self-hosted option; everything stays on Quizlet’s cloud. (hands-on)

**Could not find out:** Exact daily limits of free AI generation in 2026.

**Evidence on the board:** ALT-03 Quizlet AI generation, ALT-03 Quizlet Learn mode, ALT-03 Quizlet Classes


## ALT-04: Anki + ChatGPT workflow

**Kind:** Adjacent substitute  
**Link:** https://apps.ankiweb.net/ + https://chatgpt.com/  
**Version looked at:** Anki desktop + ChatGPT web, 2026-09-30  
**Depth of evaluation:** Installed Anki, asked ChatGPT for example sentences and translations for several words, created cards manually and by copy-paste, and timed the process.

**Problem it solves:** Combines the strongest spaced-repetition system (Anki) with an LLM to generate sentence-based language cards.

**Observations by property**

| Property                             | Observation                                   |
| ------------------------------------ | --------------------------------------------- |
| Card creation effort                 | High effort. User needs to prompt ChatGPT, copy the output, format it, and import into Anki. Slow when creating more than a few cards without extra tools. (hands-on) |
| Content source                       | Any text the user gives to ChatGPT (word lists, songs, articles, etc.). Fully flexible. (hands-on) |
| Sentence and translation quality     | High quality when the prompt is good. Can produce natural example sentences. (hands-on) |
| Pronunciation                        | Anki supports audio, but the user must add it separately (TTS or recording). (https://apps.ankiweb.net/) |
| Language coverage (RU/EN/DE)         | Excellent for almost any language. (hands-on) |
| Spaced repetition and prioritization | Best available (SM-2 / FSRS). Full control over scheduling. (https://apps.ankiweb.net/) |
| Teacher involvement                  | Almost none. Anki is mainly for individual use. Sharing decks is possible but limited. (hands-on) |
| Deployment and data control          | Fully local. User owns all data. Optional cloud sync. (https://apps.ankiweb.net/) |

**Strengths**

- Highest quality spaced repetition available. (https://apps.ankiweb.net/)
- Complete control over card content and data ownership. (hands-on)
- Can create exactly the sentence-style cards we want. (hands-on)

**Weaknesses**

- Creating cards is slow and manual (ChatGPT → copy → Anki). (hands-on)
- No built-in classroom or teacher features. (hands-on)
- Adding good pronunciation requires extra work. (hands-on)

**Could not find out:** How consistent the quality is for very low-resource languages without careful prompting.

**Evidence on the board:** ALT-04 ChatGPT prompt, ALT-04 Anki card example, ALT-04 import process
