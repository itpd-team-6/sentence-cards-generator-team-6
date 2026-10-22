# Quality requirements

This is the priority matrix: one row per quality requirement, sorted active first, then by business importance from High to Low, then by technical risk from High to Low, with `QR-nn` order breaking a tie.
Each row links its file under `qr/`, which carries the requirement's six-part scenario.

| QR                   | Outcome                                                                                                                                                                       | Business importance | Technical risk | Characteristic  | Sub-characteristic | Status |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------- | --------------- | ------------------ | ------ |
| [QR-01](qr/QR-01.md) | When the model gives no sentence for a marked word, the learner still gets a card for that word and can ask for its sentence again, and the other words keep their sentences. | High                | Medium         | Reliability     | Fault Tolerance    | Active |
| [QR-02](qr/QR-02.md) | A developer can run the backend checks from a clean checkout, and a change that breaks one of the product's critical modules makes those checks fail.                         | High                | Medium         | Maintainability | Testability        | Active |
| [QR-03](qr/QR-03.md) | A person who is not on the team installs and runs the product by following only `docs/setup.md`.                                                                              | High                | Medium         | Flexibility     | Installability     | Active |
| [QR-05](qr/QR-05.md) | When the database schema is updated, every card the learner already has is kept, and a migration that fails leaves the database at the version it had.                        | Medium              | High           | Reliability     | Recoverability     | Active |
| [QR-04](qr/QR-04.md) | The model key is read from `.env` and never committed to the repository or shown to the learner, even in an error.                                                            | Medium              | Low            | Security        | Confidentiality    | Active |
