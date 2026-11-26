# CM Evaluation

- **Baseline:** [v0.4.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.4.0), the release of 2026-11-15.
- **Reviewed:** 2026-11-26.

## Method

@nataliamotand judged the repository on 2026-11-26 against the tag `v0.4.0`, and the evaluation goes through the same pull request review as every other change.
The team wrote one local goal for each family of artifacts and grouped the artifacts by the goal they serve, using the list of files at the baseline so that every artifact the team maintains is under one goal.
Each group was read for what it costs to keep true, and each claim about a file was checked with a command run at the tag, which is quoted where it is used as evidence.
The product's source code and its behaviour, the settings of the university's VM, and the settings that need a login are out of scope, and a setting that was read through the GitHub API is named in words.

## Deciding What The Product Should Be

- **Today:** `docs/product-vision.md`, `docs/threshold-of-success.md`, `docs/assumptions.md`, `docs/features.md`, the research under `docs/research/`, and the decision log [`docs/decisions.md`](../../docs/decisions.md), none of which the plan carries.
- **A more convenient way:** `Keep` the set as it is.
- **Why:** each question has one file at the baseline, and the files are used as a trail: the priority reason of [issue #150](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/150) cites a decision record, `DEC-042`, instead of repeating the reasoning.
  The team looked for a copy or a file with no reader in this set and did not find one.
- **Tradeoffs:** the research folder holds long comparison pages and images that a new reader will not open, and every edit to it adds to the review surface.
  The team keeps it because it is the evidence of why the product is what it is, and a decision with no evidence cannot be defended.

## Specifying What It Must Do

- **Today:** the functional requirements under `docs/functional-requirements/`, the quality requirements under `docs/quality-requirements/`, the architecture document and its ADRs under `docs/architecture/`, [`docs/glossary.md`](../../docs/glossary.md), `docs/analytics.md`, and `docs/observability.md`, none of which the plan carries.
- **A more convenient way:** `Keep` the set as it is.
- **Why:** a requirement lives in one file of its own, and the work changes it where it lives: the change of the Week 7 review added an acceptance criterion to [`FR-020`](../../docs/functional-requirements/fr/FR-020.md) instead of describing it in a second document.
  The `AGENTS.md` does not map a path to a requirements file, so no second copy of the list exists to go stale.
- **Tradeoffs:** one file for each requirement means many small files, and a change in behaviour can touch a requirement, its acceptance criteria, and the glossary together.
  The team accepts it because a reviewer can check one requirement without reading the rest.

## Verifying It

- **Today:** [`CFG-01`](../../docs/configuration-plan.md#cfg-01), the review that `main` requires; [`CFG-03`](../../docs/configuration-plan.md#cfg-03), the Markdown and link checks; [`CFG-04`](../../docs/configuration-plan.md#cfg-04), the product's CI; and, not in the plan, `.github/workflows/actionlint.yml`, the tests under `backend/tests/` and the `*.test.*` files of `frontend/src/`, the configuration of the linters and test runners (`backend/ruff.toml`, `backend/pytest.ini`, `frontend/eslint.config.js`, `frontend/.prettierrc.json`), the model evaluation scripts under `backend/scripts/`, `scripts/check-install.sh`, `scripts/check-sli.mjs`, and the usability test `UT-01` under `docs/usability-tests/`.
- **A more convenient way:** `Cut` the `backlog/**` exclusion from [`.markdownlint-cli2.jsonc`](../../.markdownlint-cli2.jsonc) and `Keep` the rest of the set.
  The file would keep its `config` and its `gitignore` setting and lose only the `ignores` list.
- **Why:** the exclusion exists for a local task tracker, and the team has none: `git ls-tree -r --name-only v0.4.0 -- backlog TODO.md` prints nothing, and `git show v0.4.0:.markdownlint-cli2.jsonc` ends with `"ignores": [ "backlog/**" ]`.
  The course allows that exclusion only for a tracker's directory and says nothing else is excluded, so the line is a setting for a directory that does not exist, and a Markdown file added under a `backlog/` path would be skipped by the check without anyone deciding it.
  The edge is recorded in [`CFG-03`](../../docs/configuration-plan.md#cfg-03): a path added to `ignores` hides every file it matches from the Markdown check.
- **Tradeoffs:** if the team ever creates a tracker in the repository, it has to add the line again, and the loss is one line and the reading of the rule to know why it is needed.
  The check itself is not weakened, because it still runs on every Markdown file that exists.

## Planning And Tracking It

- **Today:** `docs/project-plan.md`, `docs/risks.md`, `docs/definition-of-done.md`, the pull request template and the issue forms under `.github/`, the weekly folders `reports/week-NN/` that [`CFG-10`](../../docs/configuration-plan.md#cfg-10) describes, and, outside the repository, the GitHub project and the milestones.
- **A more convenient way:** `Keep` the set as it is.
- **Why:** the schedule and the stories live in the GitHub project and the issues, and the repository holds only the plan, the risks, and the evidence, so no hand-written mirror of the backlog exists to fall behind.
  The template is used by the pull requests: [pull request #339](https://github.com/itpd-team-6/sentence-cards-generator-team-6/pull/339) is written in its sections.
- **Tradeoffs:** the template asks for the changelog line even on a change that touches no user-visible behaviour, and each weekly folder holds three files for the meeting with the Customer besides the report.
  The team accepts both because the template is a few lines to delete and the meeting files are the evidence that the meeting happened.

## Delivering It

- **Today:** [`CFG-02`](../../docs/configuration-plan.md#cfg-02), the changelog, the releases, and the protection of the tags; [`CFG-05`](../../docs/configuration-plan.md#cfg-05), the deployment runbook; [`CFG-06`](../../docs/configuration-plan.md#cfg-06), `.env.example` and the rule that keeps the real values out; [`CFG-07`](../../docs/configuration-plan.md#cfg-07), the pinned actions and the dependency updates; the package manifests and the lock file of the product (`backend/requirements.txt`, `frontend/package.json`, `frontend/package-lock.json`).
- **A more convenient way:** `Replace` the one pull request per package that Dependabot opens by one grouped pull request per ecosystem for minor and patch updates, with major updates left separate, by adding a `groups` entry with the pattern `*` and the `update-types` `minor` and `patch` to each of the `pip` and `npm` ecosystems in [`.github/dependabot.yml`](../../.github/dependabot.yml).
  The `github-actions` ecosystem stays as it is, because its updates are few and each changes a pinned commit that a reviewer reads alone.
- **Why:** the configuration at the baseline has no `groups`, so every package is its own pull request that needs its own approval under [`CFG-01`](../../docs/configuration-plan.md#cfg-01), and the review surface grows with the number of packages.
  On the day of the review `gh pr list --state open --author "app/dependabot"` lists 13 open pull requests, created from 2026-10-26 to 2026-11-16, for example "Update fastapi requirement from <1,>=0.143.3 to >=0.162.0,<1 in /backend", "Update pytest requirement from <10,>=9.1.1 to >=9.2.0,<10 in /backend" and "Bump vite from 8.3.4 to 8.3.6 in /frontend".
  The oldest was still open a month after it was created, which is longer than the weekly interval of the schedule.
  The same list shows why majors stay out of the group: "Bump eslint from 9.39.5 to 10.14.0 in /frontend" and "Bump jsdom from 29.1.1 to 31.0.0 in /frontend" are major updates that need their own reading.
- **Tradeoffs:** a grouped pull request that fails the CI is blocked as a whole, and the member has to find which package broke it, where today the failing package is the pull request.
  The history of each package is also less traceable, because one commit changes several of them.
  The team accepts it because the updates the group holds are minor and patch updates that the tests and the build already check, and the loss is a search in one pull request instead of thirteen reviews.

## Keeping The Context Trustworthy

- **Today:** [`CFG-08`](../../docs/configuration-plan.md#cfg-08), `AGENTS.md`; [`CFG-09`](../../docs/configuration-plan.md#cfg-09), `CONTRIBUTING.md`; and, not in the plan, `README.md`, `docs/setup.md`, `docs/README.md`, `LICENSE`, and the documentation site built from `mkdocs.yml` by `.github/workflows/docs.yml`.
- **A more convenient way:** `Replace` the list of commands in the checks section of `AGENTS.md` by a sentence that names the workflows that run the checks, `.github/workflows/ci.yml` and `.github/workflows/lychee.yml`, and links [`docs/setup.md`](../../docs/setup.md#checks-and-tests) for the commands to run locally.
  The section stays, and it still states the checks by the workflow that runs each one.
- **Why:** the same commands are written twice: at the baseline both `AGENTS.md` and `docs/setup.md` hold `ruff check .`, `ruff format --check .`, `npm run lint`, and `npm run format:check`.
  The history shows the copy is a cost: `git log --oneline v0.4.0 -- AGENTS.md` lists `5394409 Add Ruff lint and format checks to the backend` and `9b3f7af Add frontend lint, format check and tests`, and `git log --oneline v0.4.0 -- docs/setup.md` lists the same two commits, so each new check was written in both files.
  [`CFG-08`](../../docs/configuration-plan.md#cfg-08) records the edge: a command changed in a workflow and not in `AGENTS.md` leaves an agent running a check differently from the CI.
- **Tradeoffs:** an agent has to follow one link before it can run a check, and a broken link costs more than a stale sentence would.
  The team accepts it because `AGENTS.md` already sends an agent to `docs/setup.md` for the run instructions, and the link check of [`CFG-03`](../../docs/configuration-plan.md#cfg-03) reports the link if it breaks.

## What We Could Not Judge

The snapshot and backup policy of the university's VM.
The runbook says how to redeploy a commit, and the VM belongs to the university, so the team cannot see whether a snapshot exists or when it is taken.
The risk is that a lost VM costs a redeploy and the data kept on it, and the repository and the runbook are the part of the deployment that the team can restore.

## The First Change

The team would make the markdownlint change first: it removes the `ignores` list from `.markdownlint-cli2.jsonc` and keeps the Markdown check and every other line of the file.
It is one line in one file with no effect on the product, and its main tradeoff is that the line has to be written again if the team ever creates a task tracker in the repository.
