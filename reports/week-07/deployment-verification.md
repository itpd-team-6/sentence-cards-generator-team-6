# Deployment Verification, Week 7

What was checked on the deployed product, on which commit and when, as [Environments And Deployment](https://github.com/inno-itpd/itpd/blob/main/requirements/repository-requirements.md#environments-and-deployment) asks.
How the deployment is done is in [`docs/deployment.md`](../../docs/deployment.md).
The address of the VM is not written here: it is `<university-vm-ipv4>`, and the ports are those of the runbook.

## Release candidate

| Item                 | Staging                                  | Production                                      |
| -------------------- | ---------------------------------------- | ----------------------------------------------- |
| Commit               | `18e3d32`                                | `a3478b9`                                       |
| Port                 | `8001`                                   | `8002`                                          |
| Updated at           | 2026-11-15, 18:26 (UTC+03:00)            | 2026-11-15, 19:35 (UTC+03:00)                   |
| Core task checked at | 2026-11-15, 19:42 (UTC+03:00)            | 2026-11-15, between 19:37 and 19:39 (UTC+03:00) |
| Checked by           | nataliamotand                            | nataliamotand                                   |
| Machine              | A campus machine on the university Wi-Fi | A campus machine on the university Wi-Fi        |
| Result               | Passes                                   | Passes                                          |

Staging and production run the same code, each with its own `.env`, its own database file and its own service, as [`docs/deployment.md`](../../docs/deployment.md#environments) describes.
The two commits differ in one file, `docs/analytics.md`: no file of the product changed between them.
Before each update, the data folder of the environment, which holds the database file and the folder `libraries`, was copied on the VM.

### What was checked

The same steps ran on both environments, each in a private browser window that opened a new library:

1. The product page opened at `http://<university-vm-ipv4>:<port>` from the campus machine.
2. A pasted German text with the marked word `Zug` gave a card with a sentence and its translation.
3. The card was studied, and answering it in the study session scheduled it.
4. `/api/health` answered `{"status":"ok"}`, read on the VM itself after each service restart.

Production was checked first and staging after it, so the order of the runbook, staging first, was not followed for the core task: the staging check ran at 19:42, after the production deploy of 19:35.

### What was not checked

Only the core task was verified, as the requirement asks.
The events that carry the source and the participant code are not part of this check.
The language model answers came from Cloudflare Workers AI, whose daily quota both environments share, so no long run was made.
