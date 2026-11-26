# Configuration plan

**Reviewed:** 2026-11-26

The configuration this product is built, checked, delivered, and understood by.
Each item is one `CFG-nn`, grouped by what it is for, and each connection names what breaks when the edge does.
The plan was written by walking the repository as it is on `main`.
The settings of [`CFG-01`](#cfg-01) and [`CFG-02`](#cfg-02) cannot be read from the repository, so a member read them through the GitHub API on the day of the review, and only what was read is written.

## Source Control And Release

### CFG-01

The protection of `main` and the review it requires.

- **Status:** Active
- **Type:** setting
- **Purpose:** every change reaches `main` through a pull request that a member other than the author approved.
  As read on the day of the review, the setting requires one approving review, applies to administrators, and blocks force pushes and the deletion of `main`.
  Without it, a member could push to `main` with no review.
- **Owner:** @nataliamotand
- **Where:** the branch protection settings of the repository for `main`.
- **Connections:**
  - `enforces` the review step of [`CFG-09`](#cfg-09): a rule loosened in the settings while `CONTRIBUTING.md` still says another member reviews every pull request leaves a rule that only people keep.
- **What good looks like:** every change to `main` is a merged pull request with one approval from a team member other than its author, and direct pushes are blocked, per [Branch Protection](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#branch-protection).

### CFG-02

`CHANGELOG.md`, the release process and the protection of the release tags.

- **Status:** Active
- **Type:** process
- **Purpose:** whoever deploys a release learns what changed, and every release has a tag, a dated changelog section and a record in the plan.
  As read on the day of the review, the ruleset named "Protect release tags" is active for the tags that match `v*`, forbids updating, deleting and moving them, and has no bypass actor.
  Without it, a tag is a commit with no reason, and a tag could be moved after its release was published.
- **Owner:** @nataliamotand
- **Where:** `CHANGELOG.md`, the section "Stories and releases" of `CONTRIBUTING.md`, the `REL-nn` blocks of `docs/project-plan.md`, and the rulesets of the repository, the one named "Protect release tags".
- **Connections:**
  - `triggers` the release tags: a tag pushed before the changelog section is merged leaves a release whose note the changelog contradicts, and the tag cannot be moved afterwards.
  - `produces` the section that each release body links with its `[Full changelog]` line: a released section whose heading is edited after the release leaves the release body linking an anchor that is gone.
- **What good looks like:** each release has a dated section linked to its release, a new empty `[Unreleased]` is opened when it is cut, and release tags are protected from being moved or deleted, per [Cutting A Release](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/releases-requirements.md#cutting-a-release) and [Versioning And Tags](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/releases-requirements.md#versioning-and-tags).

## Checks

### CFG-03

The Markdown and link checks, `.github/workflows/lychee.yml`.

- **Status:** Active
- **Type:** workflow
- **Purpose:** a document with a broken link or malformed Markdown is found on the pull request and not by the reader.
  The `lychee` job checks the links and the `markdownlint` job checks the Markdown of every Markdown file, on pull requests and on pushes to `main`, and each fails when it finds a defect.
  Without it, a moved file or a broken table reaches a submission.
- **Owner:** @AbdelrahmanAbdel-Aal
- **Where:** `.github/workflows/lychee.yml`, with `.lycheeignore` and `.markdownlint-cli2.jsonc`.
- **Connections:**
  - `reads` `.lycheeignore`, where each exclusion states why and the day it was opened by hand in a browser: an exclusion added without its reason hides the broken link it was added for.
  - `reads` every Markdown file on the branch of the pull request: a link to a file that is still on another pull request's branch fails the check, so the merge order of the pull requests decides which one passes.
  - `reads` `.markdownlint-cli2.jsonc`: a path added to its `ignores` hides every file it matches from the Markdown check.
- **What good looks like:** both checks run on pull requests and on every push to `main`, fail when they find a defect, and every link exclusion is justified in the file that excludes it, per [Link Checking](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#link-checking) and [Continuous Integration](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#continuous-integration).

### CFG-04

The product's continuous integration, `.github/workflows/ci.yml`.

- **Status:** Active
- **Type:** CI pipeline
- **Purpose:** a change to the product is linted, format-checked, tested and built on the pull request.
  The workflow has a Frontend job and a Backend job, it has no deployment job, and it records in the file the checks that do not apply to this stack.
  Without it, a failing test is found only if the author runs it locally.
- **Owner:** @emapfff
- **Where:** `.github/workflows/ci.yml`.
- **Connections:**
  - `reads` `frontend/package-lock.json` and `backend/requirements.txt` to install the packages: a package added to `package.json` without `package-lock.json` in the same commit fails `npm ci` on the pull request.
  - `cites` the runbook [`CFG-05`](#cfg-05) in its header comment for the manual deployment: a runbook that is renamed leaves the comment pointing at a file that is gone.
- **What good looks like:** it has a named step for each check that applies, runs on pull requests and on `main`, records the checks that do not apply with the reason, and has no deployment job, per [Continuous Integration](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#continuous-integration).

## Environments And Secrets

### CFG-05

The deployment runbook, `docs/deployment.md`.

- **Status:** Active
- **Type:** document
- **Purpose:** a member on campus can reach the university VM, deploy a commit to staging and then to production, verify it and roll it back, without the member who deployed last.
  It holds placeholders instead of the real addresses.
  Without it, the deployment exists in one person's shell history.
- **Owner:** @nataliamotand
- **Where:** `docs/deployment.md`; the VM, its `.env` files and its passwords are outside the repository.
- **Connections:**
  - `reads` [`CFG-06`](#cfg-06) for the shape of the configuration: a setting added to `.env.example` and not to the runbook's configuration table is left unset in staging and in production.
  - `produces` the staging deployment on port `8001` and the production deployment on port `8002`: a port changed on the VM and not in the runbook leaves a deployment that the verification step cannot reach.
- **What good looks like:** it covers the four environments, the VM and how to reach it from the university network, the configuration, the manual deployment, the verification and the rollback, and it holds no real address, password or secret, per [Environments And Deployment](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#environments-and-deployment).

### CFG-06

The shape of the configuration, `.env.example`, and the rule that keeps the real values out.

- **Status:** Active
- **Type:** setting
- **Purpose:** a new member and the deployment learn which variables the product reads and which of them are secret, and the real values stay out of the repository.
  `.gitignore` ignores `.env` and the other secret files and keeps the example.
  Without it, a missing variable is found when a feature fails.
- **Owner:** @emapfff
- **Where:** `.env.example`, with `.env` and the other secret files ignored by `.gitignore`.
- **Connections:**
  - `cites` the rule for a committed secret in [Sensitive-Data Incident Response](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#sensitive-data-incident-response): a real value in `.env.example` makes the file a leaked credential, which has to be revoked, reported to the instructor and removed from the history.
- **What good looks like:** the example carries every variable with a placeholder and no real value, and `.env` is ignored, per [Configuration And Sensitive Information](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#configuration-and-sensitive-information).

## Dependencies And Builds

### CFG-07

The pinned actions and the dependency updates, `.github/dependabot.yml`.

- **Status:** Active
- **Type:** dependency
- **Purpose:** a third-party action runs with the repository's token at a commit the team chose, and it and the product's packages move only through a reviewed pull request.
  Every `uses:` line of the workflows names a full commit and the version in a trailing comment, and Dependabot checks the GitHub Actions, the Python packages and the npm packages every week.
  Without it, a retagged action runs code the team never read.
- **Owner:** @emapfff
- **Where:** `.github/dependabot.yml` and the `uses:` lines of every file in `.github/workflows/`.
- **Connections:**
  - `produces` the action pins of [`CFG-03`](#cfg-03) and [`CFG-04`](#cfg-04): a pin changed by hand without its version comment leaves a comment that names a different version than the commit.
  - `cites` [`CFG-01`](#cfg-01), because an update is a pull request like any other: one that nobody reviews stays open and the pin stays on the old version.
- **What good looks like:** every third-party action is pinned to a full commit with its version in a comment, and the `github-actions` ecosystem and the stack's package ecosystems are updated through reviewed pull requests, per [Pinning Third-Party Actions](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#pinning-third-party-actions) and [Contributing](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#contributing).

## Agent Context And Artifacts

### CFG-08

The team's `AGENTS.md`.

- **Status:** Active
- **Type:** document
- **Purpose:** an agent that has just cloned the repository learns the layout, the checks, the conventions and the files it must not edit, without reading the code to infer them.
  Without it, each agent session rediscovers the repository and the sessions disagree.
- **Owner:** @AbdelrahmanAbdel-Aal
- **Where:** `AGENTS.md`, in the repository root.
- **Connections:**
  - `cites` the course's [`SKILL.md`](https://github.com/inno-itpd/itpd/blob/main/SKILL.md), the router into the course requirements: if the link breaks, an agent loses the way to the rules the work is checked against.
  - `cites` this plan, `docs/configuration-plan.md`, in its layout section: a plan that is renamed leaves an agent starting from the root pointed at a file that is gone.
  - `cites` the checks of [`CFG-03`](#cfg-03) and [`CFG-04`](#cfg-04) for the commands an agent runs: a command changed in a workflow and not in `AGENTS.md` leaves an agent running a check differently from the CI.
  - `cites` [`CFG-09`](#cfg-09) for the full workflow: a guide that is renamed leaves an agent pointed at a file that is gone.
- **What good looks like:** it states the layout, the checks, the conventions and the files not to edit, each in its own section, links the course `SKILL.md` once by its URL, and links this plan in the layout, per [What It States](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/agent-instructions-requirements.md#what-it-states).

### CFG-09

`CONTRIBUTING.md`.

- **Status:** Active
- **Type:** document
- **Purpose:** a new member or a grader learns how the team works: how a change gets in, what the reviewer checks, and how releases work.
  Without it, each reviewer checks a different list.
- **Owner:** @AbdelrahmanAbdel-Aal
- **Where:** `CONTRIBUTING.md`, in the repository root.
- **Connections:**
  - `cites` the pull request template by a link: a template that is moved leaves a link that the link check of [`CFG-03`](#cfg-03) reports.
  - `reads` the results of the checks of [`CFG-03`](#cfg-03) and [`CFG-04`](#cfg-04): a check renamed in the workflows and not in the guide leaves a reviewer looking for a check that does not exist.
- **What good looks like:** it states the commit message format, the branch naming, what a pull request must contain, what the reviewer checks, and which views of the GitHub project the team uses and why, per [Contributing](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#contributing).

### CFG-10

The process that produces the weekly report.

- **Status:** Active
- **Type:** process
- **Purpose:** each week the team hands in evidence that comes from one commit of `main`, so what a grader reads is what the team submitted.
  The week's folder in `reports/` holds the report as the index of the week, the AI usage report and the meeting records, and the Moodle submission carries a permalink to the report and a snapshot of the same commit.
  Without it, the evidence and the submission describe different states of the repository.
- **Owner:** @nataliamotand
- **Where:** `reports/week-NN/` in the repository, and the Moodle submission of the week, which is outside it.
- **Connections:**
  - `cites` the link check of [`CFG-03`](#cfg-03) for its links: a report that links a file still on an unmerged pull request fails the check, and the file is missing from the snapshot.
  - `cites` the release record of [`CFG-02`](#cfg-02): the report links the release of its week, and a release that is not recorded leaves that link pointing at nothing.
  - `reads` the history of `main` kept by [`CFG-01`](#cfg-01): a merge after the commit hash is taken leaves the permalink and the snapshot describing an older state than `main`.
- **What good looks like:** the report is the index of the week, with its coverage and contribution tables, its deviations and the AI usage report beside it, and the permalink and the snapshot use the same full commit hash, per [Weekly Public Report](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/weekly-report-requirements.md#weekly-public-report) and [Permalinks And Snapshots](https://github.com/inno-itpd/itpd/blob/753d81e9c8b7b78261674c8d4836ef4e4b01d583/requirements/repository-requirements.md#permalinks-and-snapshots).
