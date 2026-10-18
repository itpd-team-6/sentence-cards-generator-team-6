# Contributing

This is how the team works on the Sentence cards generator.
Read it before opening your first pull request.
To run the product and its checks, follow [`docs/setup.md`](docs/setup.md).

## How a change gets in

1. Every change starts from a **task issue** in this repository, made with the task issue template.
   The task issue has acceptance criteria, a `Responsible` member who does the work, an `Accountable` member who checks it, and a sprint milestone (`SPRINT-nn`).
2. Work on a branch named `<issue-number>-<short-description>`, with a short lowercase hyphenated description, for example `51-build-the-study-session`.
3. Commit messages are one short sentence in the imperative mood, with a capital letter and no final period, such as `Add the study session and list all the cards`.
   The sentence says what the commit does, and the pull request says why.
4. Open a pull request into `main` and fill in the [pull request template](.github/pull_request_template.md).
   A pull request closes exactly one task issue, with `Closes #N`, and carries the implementation notes: what changed and why, and what was checked and how.
5. A user-visible change adds a line to the `[Unreleased]` section of [`CHANGELOG.md`](CHANGELOG.md), and the template asks which case the change is.
6. Another member, never the author, reviews the pull request.
   The reviewer is the task's `Accountable` member: they read the change, run what it claims, tick every acceptance criterion of the task issue, and only then approve.
7. A team member merges once the approval and the repository checks are in.
   `main` is protected, so nobody pushes to it directly.

## What the reviewer checks

- The change does what the description says, and each acceptance criterion of the task issue holds on the branch.
- The repository checks are green: the link check and the Markdown check, and the backend tests (`python -m pytest` in `backend`) when the change touches code.
- No secret, recording or private-only material is in the change.
- The Markdown follows the repository's formatting: one sentence per line, formatted with Prettier.

The full list is in the [definition of done](docs/definition-of-done.md).

## Stories and releases

Each user story has acceptance criteria and is shown to the Customer, who accepts or rejects it in a decision recorded in [`docs/decisions.md`](docs/decisions.md).
Each sprint ends in a tagged release, and its changelog section is written when the tag is cut.
The plan, with its sprints, is in `docs/project-plan.md`.

## The GitHub project

The team tracks its issues in the public [GitHub project](https://github.com/orgs/itpd-team-6/projects/1).
It is a view over the issues, not a second backlog.
We use two views:

- **Table**, grouped by milestone, with the `Responsible`, `Accountable`, `Assignees` and `Milestone` columns, to see in one place who does and who checks each issue in each sprint.
- **Board**, by status, to see what is waiting, in progress or done during the weekly review.

## Dependencies

Dependabot proposes updates for the GitHub Actions, the Python packages of `backend` and the npm packages of `frontend`, weekly, as pull requests that follow the same rules.
Third-party actions are pinned to a commit.
