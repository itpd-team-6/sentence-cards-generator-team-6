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

## Run

From the repository root, with the backend environment active:

```bash
cd backend
python -m uvicorn app.main:app
```

Open <http://localhost:8000>.
The page shows `API status: ok` when the front end reaches the API.
Stop the product with `Ctrl+C`.

### Development mode

To change the front end with live reload, run the backend as above and, in a second terminal:

```bash
cd frontend
npm run dev
```

Open <http://localhost:5173>.
The page passes its `/api` calls to the backend on port 8000.

## Checks and tests

- Backend tests, from `backend` with the environment active:

  ```bash
  python -m pytest
  ```

- Front end build, from `frontend`:

  ```bash
  npm run build
  ```

- Markdown and link checks run on every pull request, in the [Markdown and link checks](../.github/workflows/lychee.yml) workflow.
