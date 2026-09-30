# Alternatives

## Problem space

Language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

Every alternative below is evaluated against this sentence.
A product that does not serve it is not an alternative, however popular it is.

## How we researched

We started from a wide list of candidates (kept in `reports/week-01/candidate-list.md`, including the ones we cut), and chose four that mix the three kinds the course requires: a direct competitor, adjacent substitutes, and an open-source option.

We fixed the properties below **before** evaluating any product, and used the same set for every alternative.

Screenshots and working notes are on our research board: _link to be added_.

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
| ALT-01 | songs2anki              | Open-source, self-hosted   |
| ALT-02 | LingQ                   | Direct competitor          |
| ALT-03 | Quizlet                 | Adjacent substitute        |
| ALT-04 | Anki + ChatGPT (manual) | Adjacent substitute        |

## ALT-03: Quizlet

**Kind:** Direct competitor  
**Link:** https://quizlet.com/  
**Version looked at:** web app, 2026-09-30  
**Depth of evaluation:** Signed up with a free account, created a language study set, tested AI Flashcard Generator / Smart Assist, tried Learn and Flashcards modes, and checked the Classes feature. Did not fully test paid Plus features.

**Problem it solves:** A popular flashcard platform that helps students and teachers create, share, and study vocabulary sets with AI generation and classroom tools.

**Observations by property**

| Property                             | Observation                                   |
| ------------------------------------ | --------------------------------------------- |
| Card creation effort                 | Manual creation is slow. AI tools (Smart Assist / Magic Notes) generate cards quickly from text or a topic, but free tier has limits. |
| Content source                       | User notes, PDFs, slides, or a topic prompt. Also has a large community library. |
| Sentence and translation quality     | Mostly term-definition pairs. Good for vocabulary, weaker for full sentence context unless the source text already contains sentences. |
| Pronunciation                        | Built-in audio for many languages, quality is generally good. |
| Language coverage (RU/EN/DE)         | Strong support for English, German, Russian and many other languages. |
| Spaced repetition and prioritization | Adaptive Learn mode prioritises difficult cards. Not as advanced as Anki. |
| Teacher involvement                  | Strong: Classes, shared sets, and Live games. Good support for teachers. |
| Deployment and data control          | Fully cloud-based. Data is stored on Quizlet servers. No self-hosting option. |

**Strengths**

- Fast AI card generation from notes or topics.
- Excellent teacher and classroom features.
- Very large existing library of ready-made sets.

**Weaknesses**

- AI-generated cards are mostly simple term-definition pairs, not rich sentence-in-context cards.
- Free tier limits AI features and advanced study modes.
- No local or self-hosted option; everything stays on Quizlet’s cloud.

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
| Card creation effort                 | High effort. User needs to prompt ChatGPT, copy the output, format it, and import into Anki. Slow when creating more than a few cards without extra tools. |
| Content source                       | Any text the user gives to ChatGPT (word lists, songs, articles, etc.). Fully flexible. |
| Sentence and translation quality     | High quality when the prompt is good. Can produce natural example sentences. |
| Pronunciation                        | Anki supports audio, but the user must add it separately (TTS or recording). |
| Language coverage (RU/EN/DE)         | Excellent for almost any language. |
| Spaced repetition and prioritization | Best available (SM-2 / FSRS). Full control over scheduling. |
| Teacher involvement                  | Almost none. Anki is mainly for individual use. Sharing decks is possible but limited. |
| Deployment and data control          | Fully local. User owns all data. Optional cloud sync. |

**Strengths**

- Highest quality spaced repetition available.
- Complete control over card content and data ownership.
- Can create exactly the sentence-style cards we want.

**Weaknesses**

- Creating cards is slow and manual (ChatGPT → copy → Anki).
- No built-in classroom or teacher features.
- Adding good pronunciation requires extra work.

**Could not find out:** How consistent the quality is for very low-resource languages without careful prompting.

**Evidence on the board:** ALT-04 ChatGPT prompt, ALT-04 Anki card example, ALT-04 import process
