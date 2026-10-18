# Definition of done

## Story

- Every acceptance criterion passes on `main`.
- Every task issue that works on the story has closed with its pull request merged, so each also met the Task and Pull Request lists below.
- The story issue links the evidence for each criterion.
- The accountable member has checked that each criterion is runnable, and that every link on the issue resolves.

A story closes only on the Customer's acceptance, per [Showing Working Software](https://github.com/inno-itpd/itpd/blob/main/requirements/customer-meetings-requirements.md#showing-working-software).

## Task

- Every acceptance criterion the task carries is satisfied.
- The task closes as completed, which happens when the pull request that closes it merges into `main`.

## Pull Request

- A pull request closes exactly one task issue and links it.
- The accountable reviewer ticks every task acceptance criterion before approving.
- The approval comes from a member other than the author.
- The repository checks are green: the link check and the Markdown check.
- A user-visible change updates the `[Unreleased]` section of [`CHANGELOG.md`](../CHANGELOG.md).
- The acceptance criteria this pull request claims pass on its branch, and on `main` after it merges.
- No secret, recording, or private-only material is committed.
- Implementation notes in the pull request description record the decisions made and how the change was checked.
