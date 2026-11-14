# Project plan

## Milestones

### MLS-03

- **Due:** 2026-10-18
- **Sprints:** [SPRINT-03](#sprint-03)
- **Advances:** [TOS-01](threshold-of-success.md#tos-01), [TOS-04](threshold-of-success.md#tos-04)

A learner goes from a pasted text to studying generated cards in one working version, the minimum usable product of `US-01`, `US-02` and `US-03`.
The study queue, the audio, the teacher review and the interface languages build on this slice in the sprints after it.

### MLS-05

- **Due:** 2026-10-31
- **Sprints:** [SPRINT-04](#sprint-04), [SPRINT-05](#sprint-05)
- **Advances:** [TOS-01](threshold-of-success.md#tos-01), [TOS-04](threshold-of-success.md#tos-04)

A learner studies the words of one text first and the Customer opens the product in a browser on the university virtual machine, without installing anything.
The audio and the daily limits build on this version in the sprints after it.

### MLS-06

- **Due:** 2026-11-08
- **Sprints:** [SPRINT-06](#sprint-06)
- **Advances:** [TOS-04](threshold-of-success.md#tos-04)

A learner chooses which decks of cards to study, in a study queue with a list of decks and two tabs.
The work on the texts and the interface, then login, then the audio and a mobile interface follow it, in the order the Customer set ([DEC-061](decisions.md#dec-061), the Week 6 meeting).

## Sprints

### SPRINT-03

A learner pastes a text, marks the words they do not know, checks the generated cards and studies them, in one released version.

- **Due:** 2026-10-18
- **Sprint Backlog:** [the issues scheduled into SPRINT-03](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/1)

#### REL-03

Released as [v0.1.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.1.0) on 2026-10-18.

### SPRINT-04

A learner moves the words of one text to the front of the study queue, and the Customer can accept `US-01` after the retry of a failed sentence is built.

- **Due:** 2026-10-24
- **Sprint Backlog:** [the issues scheduled into SPRINT-04](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/2)
- **Planned Velocity:** 10
- **Actual Velocity:** 5; `US-04` did not finish and moved to `SPRINT-05`.

#### REL-04

Released as [v0.2.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.2.0) on 2026-10-25.

### SPRINT-05

A learner studies the words of one text first, deleting a card removes it from the study order at once, and the Customer opens the product in a browser on the university virtual machine.

- **Due:** 2026-10-31
- **Sprint Backlog:** [the issues scheduled into SPRINT-05](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/3)
- **Planned Velocity:** 8
- **Actual Velocity:** 8; `US-04` and `US-09` were accepted by the Customer and no story moved out.

#### REL-05

- **Released:** [v0.2.1](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.2.1) on 2026-10-31.
- **Checked QRs:**
  - [QR-01](quality-requirements/qr/QR-01.md)
  - [QR-02](quality-requirements/qr/QR-02.md)

  The [testing plan](#quality-requirement-testing-plan) carries each test's result.

### SPRINT-06

A learner chooses which decks to study in the study queue, with its list of decks and its two tabs.

- **Due:** 2026-11-08
- **Sprint Backlog:** [the issues scheduled into SPRINT-06](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/4)
- **Planned Velocity:** 21
- **Actual Velocity:** 21; US-11, US-12, US-13 and US-14 are closed with all their acceptance criteria met, and four tasks moved to SPRINT-07: [#165](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/165), [#172](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/172), [#204](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/204) and [#212](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/212).

#### REL-06

- **Released:** [v0.3.0](https://github.com/itpd-team-6/sentence-cards-generator-team-6/releases/tag/v0.3.0) on 2026-11-08.
- **Checked QRs:**
  - [QR-07](quality-requirements/qr/QR-07.md)

  The [testing plan](#quality-requirement-testing-plan) carries each test's result.

### SPRINT-07

A learner can revisit saved texts, manage cards and decks, and study through the updated interface, and the team has a UT-01 design ready for sessions on staging.

- **Due:** 2026-11-15
- **Sprint Backlog:** [the issues scheduled into SPRINT-07](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/5)
- **Planned Velocity:** 0
- **Candidate stories (refined, not scheduled):**
  - [US-15](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/232): keep my texts and pick more words from them later (Must Have, 8 points).
  - [US-17](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/234): find studying, adding a text and my cards in a few steps (Must Have, 5 points).
  - [US-18](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/235): edit, regenerate or hide a card inside a study session (Should Have, 5 points).

#### REL-07

### SPRINT-08

The team runs UT-01 on staging and analyzes the recorded sessions to report findings and the QR-08 QRT-01 verdict.
This goal is provisional until the sprint is planned.

- **Due:** 2026-11-21
- **Sprint Backlog:** [the issues scheduled into SPRINT-08](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestone/6)
- **Candidate stories (refined, not scheduled):**
  - [US-19](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/236): keep my cards and progress under my own account (Should Have, 8 points).

The audio of words and sentences and then a mobile interface follow, in the Customer's order, when their stories are written.

#### REL-08

### SPRINT-09

The product is polished and ready for the code freeze, with the result of each threshold goal written down.
This goal is provisional until the sprint is planned.

- **Due:** 2026-11-28

#### REL-09

## Quality Requirement Testing Plan

| QR                                        | QRT                                               | Status       | Checked                 | Planned for sprint      | Evidence                                                                                                  |
| ----------------------------------------- | ------------------------------------------------- | ------------ | ----------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| [QR-01](quality-requirements/qr/QR-01.md) | [QRT-01](quality-requirements/qr/QR-01.md#qrt-01) | Passes       | [SPRINT-05](#sprint-05) | [SPRINT-05](#sprint-05) | [Product CI run](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/41223520996) |
| [QR-02](quality-requirements/qr/QR-02.md) | [QRT-01](quality-requirements/qr/QR-02.md#qrt-01) | Passes       | [SPRINT-05](#sprint-05) | [SPRINT-05](#sprint-05) | [Product CI run](https://github.com/itpd-team-6/sentence-cards-generator-team-6/actions/runs/41223520996) |
| [QR-03](quality-requirements/qr/QR-03.md) | [QRT-01](quality-requirements/qr/QR-03.md#qrt-01) | Not verified | None                    | [SPRINT-07](#sprint-07) | None                                                                                                      |
| [QR-06](quality-requirements/qr/QR-06.md) | [QRT-01](quality-requirements/qr/QR-06.md#qrt-01) | Not verified | None                    | [SPRINT-07](#sprint-07) | None                                                                                                      |
| [QR-07](quality-requirements/qr/QR-07.md) | [QRT-01](quality-requirements/qr/QR-07.md#qrt-01) | Passes       | [SPRINT-06](#sprint-06) | [SPRINT-06](#sprint-06) | [QRT-01 evidence](../reports/week-06/qrt-01-evidence.md)                                                  |
| [QR-08](quality-requirements/qr/QR-08.md) | [QRT-01](quality-requirements/qr/QR-08.md#qrt-01) | Not verified | None                    | [SPRINT-08](#sprint-08) | None                                                                                                      |

## Progress Monitoring

- **Review:** the team's weekly review, Wednesdays at 15:00 Moscow time; it reads [threshold-of-success.md](threshold-of-success.md) and [risks.md](risks.md).
- **Checked by:** the accountable member of each scheduled issue reports its state, and the team walks the sprint backlog against the sprint's goal.
- **Visible at:** the [project's table view](https://github.com/orgs/itpd-team-6/projects/1) and the [sprints' GitHub milestones](https://github.com/itpd-team-6/sentence-cards-generator-team-6/milestones).
