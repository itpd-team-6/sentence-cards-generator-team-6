# Risks

| ID                  | Status | Impact | Likelihood | Risk                                                                                                                                                                                                                 |
| ------------------- | ------ | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [RISK-01](#risk-01) | Open   | High   | High       | The product depends on a free language model from an outside provider, so a refused request may stop sentence generation during a Customer meeting or a test, which would leave the core task unproven.              |
| [RISK-02](#risk-02) | Open   | High   | Medium     | No audio source is chosen and a free one may not cover Russian, English and German, so `US-07` may not give audio for all three languages, which would leave a story the Customer decided to build only partly done. |
| [RISK-03](#risk-03) | Open   | High   | Medium     | No person outside the team is found in time, or the product does not run from a clean checkout by following only `docs/setup.md`, so `TOS-02` and `TOS-03` may be missed in Week 9.                                  |
| [RISK-04](#risk-04) | Open   | High   | Medium     | The usability test needs representative learners available on the university network, so recruitment may fall short of three completed sessions, which would leave QR-08 unverified.                                 |
| [RISK-05](#risk-05) | Open   | High   | Medium     | A participant may withdraw or refuse the recording, so a session may become unusable as evidence, which would reduce the counted sample for UT-01.                                                                   |
| [RISK-06](#risk-06) | Open   | High   | Medium     | The raw data repository and recordings folder require private access, so an instructor may be unable to open them, which would prevent review of the usability evidence.                                             |
| [RISK-07](#risk-07) | Open   | High   | Medium     | The usability sessions have no fixed dates yet, so the test may finish after the Submission 8 deadline, which would leave the planned QR-08 result unavailable for that submission.                                  |

## RISK-01

The product depends on a free language model from an outside provider, so a refused request may stop sentence generation during a Customer meeting or a test, which would leave the core task unproven.

- **Status:** Open
- **Impact:** High
  - Without sentences the cards stay empty, so the Customer cannot accept `US-01` and an outside person cannot finish the test of `TOS-03`.
- **Likelihood:** High
  - The provider refused a request from a Russian network with "User location is not supported for the API use" while `docs/setup.md` was being tested, as written in [issue #67](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/67).
- **Trigger:** the product shows "The language model returned an error" for a request that worked before.
- **Window:** from [SPRINT-04](project-plan.md#sprint-04) to the final project defense in Week 11.
- **Mitigation:** the model, the key and the endpoint are set in `.env` per [`DEC-009`](decisions.md#dec-009), so the provider can be changed without changing the code.
  The same refusal came from the university VM's address, so the model of the VM comes from Cloudflare Workers AI per [`DEC-044`](decisions.md#dec-044), and [`deployment.md`](deployment.md#the-language-model-provider) records its daily quota.
- **Contingency:** change `LLM_BASE_URL`, `LLM_MODEL` and `LLM_API_KEY` in `.env` to another provider whose free model answers from that machine.

## RISK-02

No audio source is chosen and a free one may not cover Russian, English and German, so `US-07` may not give audio for all three languages, which would leave a story the Customer decided to build only partly done.

- **Status:** Open
- **Impact:** High
  - [`DEC-007`](decisions.md#dec-007) gives every card audio for the word and the sentence, and a language without audio would leave the cards of that language without it.
- **Likelihood:** Medium
  - The source may be an online service or a text-to-speech model run by the learner per [`DEC-010`](decisions.md#dec-010), and the source is not chosen yet.
- **Trigger:** a sample word and sentence in one of the three languages gets no audio from the candidate source.
- **Window:** [SPRINT-04](project-plan.md#sprint-04) to [SPRINT-05](project-plan.md#sprint-05).
- **Mitigation:** the team tries each candidate source on one word and one sentence in each of the three languages before building on it.
- **Contingency:** build the audio for the languages the source covers and ask the Customer to decide, as a `DEC-nnn`, what happens to the rest.

## RISK-03

No person outside the team is found in time, or the product does not run from a clean checkout by following only `docs/setup.md`, so `TOS-02` and `TOS-03` may be missed in Week 9.

- **Status:** Open
- **Impact:** High
  - Two of the four goals of the [threshold of success](threshold-of-success.md) would be missed.
- **Likelihood:** Medium
  - The setup has been followed by a team member once, in [issue #67](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/67), and nobody outside the team has tried it.
- **Trigger:** by the end of [SPRINT-07](project-plan.md#sprint-07) no outside person has agreed to a day for the test.
- **Window:** [SPRINT-07](project-plan.md#sprint-07) to [SPRINT-09](project-plan.md#sprint-09).
- **Mitigation:** the team asks for the outside person before [SPRINT-07](project-plan.md#sprint-07) starts.
- **Contingency:** ask the Customer to name a person he accepts as outside the team and run the test with that person in Week 9.

## RISK-04

The usability test needs representative learners available on the university network, so recruitment may fall short of three completed sessions, which would leave QR-08 unverified.

- **Status:** Open
- **Impact:** High
  - [QR-08 QRT-01](quality-requirements/qr/QR-08.md#qrt-01) needs at least three counted sessions to reach a result.
- **Likelihood:** Medium
  - [UT-01](usability-tests/ut-01/README.md#participant-profile) requires adult learners who have not used the product, and its [schedule](usability-tests/ut-01/README.md#schedule) has no fixed session dates yet.
- **Trigger:** fewer than three eligible participants are available to complete sessions by the UT-01 results deadline.
- **Window:** recruitment in [SPRINT-07](project-plan.md#sprint-07) through the [SPRINT-08](project-plan.md#sprint-08) results deadline of 2026-11-21.
- **Mitigation:** recruit toward the five-session design target, check the participant profile before booking, and arrange replacement participants.
- **Contingency:** recruit replacements; when three still cannot be recruited, keep the QR/QRT row Not verified in SPRINT-08 or move it to SPRINT-09, declare the shortfall, and claim no result.

## RISK-05

A participant may withdraw or refuse the recording, so a session may become unusable as evidence, which would reduce the counted sample for UT-01.

- **Status:** Open
- **Impact:** High
  - Losing a counted session could bring the sample below the three sessions required by [QR-08](quality-requirements/qr/QR-08.md#response-measure).
- **Likelihood:** Medium
  - The [consent template](usability-tests/ut-01/consent.md) requires recording permission and allows withdrawal at any time, so a booked participant may become unavailable for a counted session.
- **Trigger:** a participant withdraws consent or refuses recording.
- **Window:** consent collection and sessions in [SPRINT-08](project-plan.md#sprint-08), with withdrawal handling until deletion after grading.
- **Mitigation:** send the consent text before booking, confirm recording permission before starting, and keep the participant-code mapping private so withdrawal requests can be acted on.
- **Contingency:** do not count the session, remove the raw text and the recording, retire the code, and recruit a replacement under the next code.

## RISK-06

The raw data repository and recordings folder require private access, so an instructor may be unable to open them, which would prevent review of the usability evidence.

- **Status:** Open
- **Impact:** High
  - The [consent and data map](usability-tests/ut-01/README.md#consent-and-data) keeps the consent records, raw notes and recordings private, so public session notes alone cannot provide access to the raw evidence.
- **Likelihood:** Medium
  - The private repository needs authentication and the recordings use a separate cloud folder, so both access paths need checking before submission.
- **Trigger:** an instructor cannot open the private usability-data repository or the recordings folder using the provided access.
- **Window:** setup in [SPRINT-07](project-plan.md#sprint-07), submission in [SPRINT-08](project-plan.md#sprint-08), and instructor review until grading.
- **Mitigation:** create the private repository and cloud folder with team and instructor access, verify both access paths before submission, and provide their links and access through Moodle.
- **Contingency:** create it with the team and the instructors, and when an instructor cannot use GitHub, give the private text through a Moodle-only archive and declare the deviation.

## RISK-07

The usability sessions have no fixed dates yet, so the test may finish after the Submission 8 deadline, which would leave the planned QR-08 result unavailable for that submission.

- **Status:** Open
- **Impact:** High
  - The [testing plan](project-plan.md#quality-requirement-testing-plan) schedules QR-08 QRT-01 in SPRINT-08, and its result needs the counted sessions and their analysis.
- **Likelihood:** Medium
  - The [UT-01 schedule](usability-tests/ut-01/README.md#schedule) leaves session dates to be arranged in SPRINT-08 and sets the results deadline at 2026-11-21.
- **Trigger:** the remaining sessions and analysis cannot be completed by 2026-11-21.
- **Window:** scheduling in [SPRINT-07](project-plan.md#sprint-07) through the end of [SPRINT-08](project-plan.md#sprint-08).
- **Mitigation:** book sessions early, check the recording and staging setup before each session, and reserve time for replacement sessions and analysis before the results deadline.
- **Contingency:** move the QR/QRT row to SPRINT-09 with a reason, declare it in the report, and claim no result.
