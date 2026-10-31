# Quality requirements

This is the priority matrix: one row per quality requirement, sorted active first, then by business importance from High to Low, then by technical risk from High to Low, with `QR-nn` order breaking a tie.
Each row links its file under `qr/`, which carries the requirement's six-part scenario.

The results and schedule of the quality requirement tests are in the [Quality Requirement Testing Plan](../project-plan.md#quality-requirement-testing-plan).

| QR                   | Outcome                                                                                                                                                                                | Business importance | Technical risk | Characteristic         | Sub-characteristic | Status |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------- | ---------------------- | ------------------ | ------ |
| [QR-01](qr/QR-01.md) | When the language model gives no sentence for a marked word, the learner still gets a card for that word and can ask for its sentence again, and the other words keep their sentences. | High                | Medium         | Reliability            | Fault Tolerance    | Active |
| [QR-02](qr/QR-02.md) | A developer can run the backend checks from a clean checkout of the repository, and a change that breaks one of the product's critical modules makes those checks fail.                | High                | Medium         | Maintainability        | Testability        | Active |
| [QR-03](qr/QR-03.md) | A person who is not on the team installs and runs the product by following only `docs/setup.md`, with no other help from the team.                                                     | High                | Medium         | Flexibility            | Installability     | Active |
| [QR-06](qr/QR-06.md) | No user of the product can see the model key of another user, so that a teacher never sees the key of a student.                                                                       | High                | Medium         | Security               | Confidentiality    | Active |
| [QR-04](qr/QR-04.md) | The language model key that the server holds is read from `.env`, is never committed to the repository, and appears in no log line and in no error shown to the learner.               | Medium              | Low            | Security               | Confidentiality    | Active |
| [QR-05](qr/QR-05.md) | After the answer of the language model has arrived, the product shows the cards of that answer within half a second, so that the only wait the learner has is the one for the model.   | Medium              | Low            | Performance Efficiency | Time Behaviour     | Active |
