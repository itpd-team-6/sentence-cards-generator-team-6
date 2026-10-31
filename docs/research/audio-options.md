# Audio options for a word and a sentence

Three ways for the product to get audio for a word and for a sentence, one from a text-to-speech model the learner hosts and two others to compare it with.
This is the evidence for the action point of the Week 3 meeting report, due 2026-10-22, and for the choice that [`DEC-010`](../decisions.md#dec-010) leaves open.
[`DEC-010`](../decisions.md#dec-010) lets the audio come from any outside source, a self-hosted text-to-speech model or an online service, as long as the product is configured to connect to it, and [`DEC-007`](../decisions.md#dec-007) says each card has audio from an outside source.
The constraints that matter are [`CON-04`](../product-vision.md#con-04) (a free or cheap model), [`CON-06`](../product-vision.md#con-06) (the code is open source) and [`CON-07`](../product-vision.md#con-07) (self-hostable on a local machine or a VPS).
Every claim below has the page it was read on, opened on 2026-10-23; prices, voices and licences change, so the pages are the source and not this file.

## The options

| Option                                     | Russian, English, German                              | Cost                                                    | Licence                                                    | Local machine or VPS                         |
| ------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| [Piper](#option-1-piper)                   | All three have voices; Russian only at medium quality | No price: open source, run by the learner               | GPL-3.0 engine; each voice has its own, not all commercial | Local, as a program the learner runs         |
| [Google Cloud TTS](#option-2-google-cloud) | All three are listed                                  | Free up to a monthly limit, then per million characters | Hosted service, not open source                            | Neither: called over the network, billing on |
| [Coqui XTTS](#option-3-coqui-xtts)         | All three are in its 17 languages                     | No price: run by the learner                            | Non-commercial model licence                               | Local, as a program the learner runs         |

## Option 1: Piper

Piper is a text-to-speech engine that runs on the learner's own machine, so it is the self-hosted option.

- **What it is:** "A fast, local neural text to speech system" ([`rhasspy/piper`](https://github.com/rhasspy/piper)).
  That repository was archived by its owner on 2025-10-06 and points to [`OHF-Voice/piper1-gpl`](https://github.com/OHF-Voice/piper1-gpl) as the place where development moved.
- **Languages:** the [voice list](https://github.com/rhasspy/piper/blob/master/VOICES.md) has Russian (`ru_RU`: denis, dmitri, irina, ruslan, all medium quality), English (`en_US` and `en_GB`, many voices up to high quality) and German (`de_DE`: eight voices, `thorsten` in low, medium and high quality and the others in x_low, low or medium quality).
- **Cost:** the engine is open source and carries no price; the pages read list no fee.
- **Licence of the engine:** the archived repository is MIT and the repository where development moved is [GPL-3.0](https://github.com/OHF-Voice/piper1-gpl), both of which allow commercial use.
  The [voice list](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/VOICES.md) of the new repository says each voice has a `MODEL_CARD` with its licensing information and that "some voices may have restrictive licenses", so the licence of each voice is read on its own `MODEL_CARD` below.
- **Licence of the voices:** the voices live in [`rhasspy/piper-voices`](https://huggingface.co/rhasspy/piper-voices), where each voice carries a `MODEL_CARD` that names the licence of the dataset it was trained on.
  The repository's own licence field is MIT, but a voice's `MODEL_CARD` can name a stricter dataset licence, so the table below reads one voice per language as an example, read on 2026-10-30, and whether that licence allows commercial use.
  The team has not yet chosen which voices the product will use, so a chosen voice must have its own `MODEL_CARD` read before it is relied on.
  On 2026-10-31 the Customer answered that the product does not need a licence that allows commercial use ([evidence](../../reports/week-05/evidence/piper-licence-customer-message.md)), so a non-commercial voice such as `ru_RU` ruslan is acceptable and the licence rules out none of the voices above; the choice is decided by quality.

  | Language          | Voice (example)                                                                                                | Dataset licence                                                                                                     | Commercial use                                                                                   |
  | ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
  | Russian (`ru_RU`) | [denis (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/ru/ru_RU/denis/medium/MODEL_CARD)       | [CC0](https://creativecommons.org/publicdomain/zero/1.0/)                                                           | Yes                                                                                              |
  | Russian (`ru_RU`) | [dmitri (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/ru/ru_RU/dmitri/medium/MODEL_CARD)     | [CC0](https://creativecommons.org/publicdomain/zero/1.0/)                                                           | Yes                                                                                              |
  | Russian (`ru_RU`) | [irina (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/ru/ru_RU/irina/medium/MODEL_CARD)       | Unknown (named as `Unknown` on the `MODEL_CARD`)                                                                    | Not known to us, so treat as not allowed                                                         |
  | Russian (`ru_RU`) | [ruslan (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/ru/ru_RU/ruslan/medium/MODEL_CARD)     | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)                                               | No, the `NC` term forbids it                                                                     |
  | English (`en_US`) | [lessac (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/lessac/medium/MODEL_CARD)     | [Blizzard 2013 research licence](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html) | No, it is granted "exclusively for Research Purposes only" and excludes "any commercial purpose" |
  | English (`en_GB`) | [alba (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/alba/medium/MODEL_CARD)         | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)                                                           | Yes, with attribution                                                                            |
  | German (`de_DE`)  | [thorsten (medium)](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/)                                                           | Yes                                                                                              |

- **Open source ([`CON-06`](../product-vision.md#con-06)):** the engine is.
- **What a person who hosts the product needs:** the new repository installs with `pip install piper-tts` ([`OHF-Voice/piper1-gpl`](https://github.com/OHF-Voice/piper1-gpl)); the pages read state no hardware requirement, so what a VPS needs is not known to us.

## Option 2: Google Cloud

Google Cloud Text-to-Speech is an online service the `backend` calls, so it is the free or cheap online option.

- **Languages:** the [Chirp 3: HD voices](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd) language table lists Russian (`ru-RU`), German (`de-DE`) and English (`en-US`).
  The [voice list](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types) shows Standard, WaveNet, Neural2, Chirp and Studio voices for `en-US` and Chirp voices for `de-DE`; we did not confirm which voice types `ru-RU` has beyond Chirp 3: HD.
- **Cost:** per the [pricing page](https://cloud.google.com/text-to-speech/pricing), Standard and WaveNet voices are free up to 4 million characters a month and then US$4 per million characters, and Neural2 voices are free up to 1 million characters a month and then US$16 per million characters.
  We did not read the price of the Chirp 3: HD voices, the only type we confirmed for Russian.
  The same page says billing must be enabled to use the service, because charges start once the free characters are used.
- **Licence:** a hosted service of Google; it is not open source.
- **Local machine or VPS ([`CON-07`](../product-vision.md#con-07)):** it does not run on either; the `backend` sends the text to Google and pays per character sent ([pricing page](https://cloud.google.com/text-to-speech/pricing)).
  [`DEC-008`](../decisions.md#dec-008) records that the Customer wants at least the local option "so that no data is sent anywhere", and this option sends every word and sentence to Google.
- **What a person who hosts the product needs:** a Google Cloud account with billing enabled and an API key in `.env`, which is the setting the product already reads for the language model; we did not read the steps to get the key.

## Option 3: Coqui XTTS

XTTS is a text-to-speech model that runs on the learner's own machine, our choice of a second self-hosted model with more languages than Piper's medium-quality Russian.

- **Languages:** XTTS-v2 "supports 17 languages", among them English, German and Russian ([model card](https://huggingface.co/coqui/XTTS-v2)).
- **Cost:** no price is listed; the learner runs it.
- **Licence:** the model has the Coqui Public Model License, which "allows only non-commercial use of a machine learning model and its outputs" ([licence text](https://huggingface.co/coqui/XTTS-v2/blob/main/LICENSE.txt)).
  The code of the maintained fork is MPL-2.0 ([`idiap/coqui-ai-TTS`](https://github.com/idiap/coqui-ai-TTS)).
  A model licence that allows only non-commercial use may not be what [`CON-06`](../product-vision.md#con-06) means by open source; this is a question for the Customer.
- **What a person who hosts the product needs:** `pip install coqui-tts` and the model files ([documentation](https://coqui-tts.readthedocs.io/en/latest/models/xtts.html)); the fork has a `cpu` extra and a CPU Docker image ([`idiap/coqui-ai-TTS`](https://github.com/idiap/coqui-ai-TTS)), while the documentation's examples use a GPU and state no minimum hardware, so how fast it is on a VPS without a GPU is not known to us.

## Questions for the Customer

- Is a non-commercial model licence acceptable under the "open source" constraint, or must the audio source be open source in the full sense?
- Is it acceptable that an online service receives the words and sentences, given that the Customer wanted the local option "so that no data is sent anywhere"?
- Is Piper's medium-quality Russian good enough for the learner, or is Russian the language where an online service is needed?
- Does the product need a voice that allows commercial use, or is non-commercial use enough, given that some Piper voices (such as `ru_RU` ruslan and `en_US` lessac) forbid commercial use while others (such as `ru_RU` denis and `de_DE` thorsten) allow it?
