# Agent Instructions

Follow the course rules through [the course SKILL.md](https://github.com/inno-itpd/itpd/blob/main/SKILL.md) before changing course artifacts.

## Layout

- `backend/app/` contains the FastAPI application and SQLite migrations; `backend/tests/` contains backend tests.
- `frontend/src/` contains the React application; `frontend/` also contains its Vite configuration and npm manifests.
- `docs/` contains maintained product documentation, including the product vision, decisions, project plan, requirements, architecture, and glossary.
- `reports/week-NN/` contains evidence and reports for each course week.
- `.github/workflows/` contains CI workflows; `.github/` also contains pull request and issue templates.
- `docs/setup.md` provides the supported local setup, run, and test instructions.

## Checks

- From `backend/`, run `python -m pytest` after changes to the backend.
- From `frontend/`, run `npm ci` to install dependencies, then `npm run lint`, `npm run format:check`, `npm test` and `npm run build` to verify the frontend.
- Run `npx prettier --check AGENTS.md docs/glossary.md` from the repository root with Prettier available; use `npx prettier --write AGENTS.md docs/glossary.md` to format these files when necessary.
- The `markdownlint` and Lychee link checks run on pull requests and pushes to `main` in `.github/workflows/lychee.yml`. Locally, use `npx markdownlint-cli2 '**/*.md'` for Markdown linting and `lychee --no-progress --max-concurrency 2 --accept 200,206,429 './**/*.md'` for links when those tools are installed; the link check needs internet access.
- For manual run instructions and API checks, see `docs/setup.md`.

## Conventions

- Write project artifacts in English and refer to the project customer as `Customer`.
- Start each change with a task issue and use a branch named `<issue-number>-<short-description>` with lowercase hyphenated words.
- Write commit messages as one short imperative sentence starting with a capital letter, without a final period (for example, `Add glossary and agent instructions`).
- Open a pull request against `main` that closes exactly one issue with `Closes #N`; do not push directly to `main`.
- Follow the pull request template; document what changed, why, and how it was checked, and obtain a review from someone other than the author.
- Use one sentence per line in Markdown and format it with Prettier; keep repository links working.
- Never commit real API keys, `.env`, recordings, or private-only material.
- For database schema changes, append a new migration to `MIGRATIONS` in `backend/app/database.py` and add a test; do not modify migrations already on `main`.
- Follow `CONTRIBUTING.md` and `docs/definition-of-done.md` for the full team workflow.

## Do Not Edit

- `.env`: contains local secrets and configuration; each member manages their own copy, using `.env.example` as the public template.
- `backend/app/database.py` migrations already present on `main`: never rewrite an applied migration; a team member adds a new migration and test instead.
- `reports/week-01/`, `reports/week-02/`, and `reports/week-03/`: historical submitted evidence; a responsible team member should record later changes in the current week's report instead of rewriting earlier weeks.
- `docs/decisions.md`: do not silently revise Customer decisions; the member responsible for documenting a new Customer decision should add the verified decision and its evidence.
- `.github/workflows/`: do not change CI gates as part of an unrelated task; a member should use a separate reviewed pull request for workflow changes.
- `CHANGELOG.md` release sections: do not rewrite published release history; the member cutting a release maintains its release section, and user-visible changes go under `[Unreleased]`.
