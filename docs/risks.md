# Risks

| ID                  | Status | Impact | Likelihood | Risk                                                                                                                                                                                                                 |
| ------------------- | ------ | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [RISK-01](#risk-01) | Open   | High   | High       | The product depends on a free language model from an outside provider, so a refused request may stop sentence generation during a Customer meeting or a test, which would leave the core task unproven.              |
| [RISK-02](#risk-02) | Open   | High   | Medium     | No audio source is chosen and a free one may not cover Russian, English and German, so `US-07` may not give audio for all three languages, which would leave a story the Customer decided to build only partly done. |
| [RISK-03](#risk-03) | Open   | High   | Medium     | No person outside the team is found in time, or the product does not run from a clean checkout by following only `docs/setup.md`, so `TOS-02` and `TOS-03` may be missed in Week 9.                                  |

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
