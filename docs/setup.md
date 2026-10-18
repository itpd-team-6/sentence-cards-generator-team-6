# Setup And Run Instructions

How to install, configure and run the product on a local machine, and how to run its checks and tests.
The commands were tested on Linux with Python 3.13 and Node.js 22, and on Windows with Python 3.11 and Node.js 24.

## Prerequisites

- Git.
- Python 3.11 or newer, with `pip` and `venv`.
- Node.js 22 or newer, with `npm`.

## Install

1. Clone the repository and go into it:

   ```bash
   git clone https://github.com/itpd-team-6/sentence-cards-generator-team-6.git
   cd sentence-cards-generator-team-6
   ```

2. Install the backend in a virtual environment:

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

   On Windows PowerShell, create the environment with `py -m venv .venv` and activate it with `.venv\Scripts\Activate.ps1` instead of the `source` line.
   Once the environment is active, `python` works as written in the rest of this page.

   If the install stops with a timeout, run it again; on a slow connection, add `--default-timeout=120 --retries 10` to the `pip install` command.

3. Install the front end and build it:

   ```bash
   cd frontend
   npm ci
   npm run build
   cd ..
   ```

   If `npm ci` stops with a timeout, run it again.

## Configuration

The product reads its settings from a `.env` file in the repository root.
`.env` is never committed.

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env`.

2. Open `.env` and fill in the values:

   | Setting         | What it is                                                                                               |
   | --------------- | -------------------------------------------------------------------------------------------------------- |
   | `LLM_API_KEY`   | The key of your language model provider.                                                                 |
   | `LLM_MODEL`     | The name of the model, as the provider names it.                                                         |
   | `LLM_BASE_URL`  | The address of the provider's OpenAI-compatible endpoint. The default is Google's Gemini endpoint.       |
   | `DATABASE_PATH` | Where the SQLite database file is kept, relative to the repository root. The default is `data/cards.db`. |

The product starts without a key and model.
They are needed from the card generation onwards.

### Get a language model key

To generate cards, the product calls a language model through an OpenAI-compatible endpoint.
The default `LLM_BASE_URL` in `.env.example` is Google's Gemini endpoint, so these steps use Gemini.

1. Open Google AI Studio and create a key: <https://aistudio.google.com/apikey>.
   You need a Google account; follow the page's own instructions to create the key.
2. In `.env`, set the three values:

   ```dotenv
   LLM_API_KEY=your-key-here
   LLM_MODEL=gemini-3.5-flash-lite
   LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
   ```

   `gemini-3.5-flash-lite` is the model the team tested with, and `LLM_BASE_URL` is the default from `.env.example`.
   Model names and the free quota change over time, so check the current model name on Google's model list (<https://ai.google.dev/gemini-api/docs/models>) and the current free quota on Google's pricing page (<https://ai.google.dev/gemini-api/docs/pricing>).
   At the time of writing, Google's pricing page lists Gemini 3.5 Flash-Lite as "Free of charge" in its Free Tier.

3. Keep your key secret.
   `.env` is in `.gitignore` and is never committed; do not put a real key anywhere in the repository.

## Run

From the repository root, with the backend environment active:

```bash
cd backend
python -m uvicorn app.main:app
```

Open `http://localhost:8000`.
The page shows `API status: ok` when the front end reaches the API.
Stop the product with `Ctrl+C`.

### Development mode

To change the front end with live reload, run the backend as above and, in a second terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.
The page passes its `/api` calls to the backend on port 8000.

## Try the core task

With the product running (see [Run](#run)) and a key set (see [Get a language model key](#get-a-language-model-key)), you can take a learner from a pasted text to studying the cards.
The page has two tabs at the top, "Add a text" and "Study".

1. On the "Add a text" tab, pick the text language and your first language (they must be different), then paste a text into "Paste a text".
2. Under "Click the words you do not know", click the words you want to learn; each one appears under "Marked words".
3. Click "Ask for sentences". The product asks the language model for one sentence per word, which takes a few seconds each, and the cards appear in a "Your cards" table, each with a sentence and a translation.
4. Open the "Study" tab and click "Start a session". For each due card, read the word and its sentence, click "Show translation", then answer "Remembered" or "Forgotten". A card you remember is scheduled for a later day; one you forget comes back later in the same session.

If a word gets a card with no sentence (the model did not answer), use the card's "New sentence" button in the "Your cards" table to ask again.

## Checks and tests

- Backend tests, from `backend` with the environment active:

  ```bash
  python -m pytest
  ```

- Front end build, from `frontend`:

  ```bash
  npm run build
  ```

- The language model call, with the product running and `LLM_API_KEY` and `LLM_MODEL` set in `.env`:

  ```bash
  curl -X POST http://localhost:8000/api/sentences -H "Content-Type: application/json" -d '{"word": "Haus", "text_language": "de", "first_language": "en"}'
  ```

  On Windows PowerShell:

  ```powershell
  Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/sentences -ContentType "application/json" -Body '{"word": "Haus", "text_language": "de", "first_language": "en"}'
  ```

  The answer holds a `sentence` in German that contains the word and its `translation` into English.
  Without a key in `.env`, the answer says so, with status 503.

- Markdown and link checks run on every pull request, in the [Markdown and link checks](https://github.com/itpd-team-6/sentence-cards-generator-team-6/blob/main/.github/workflows/lychee.yml) workflow.
