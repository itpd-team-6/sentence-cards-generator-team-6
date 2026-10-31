# Deployment Verification, Week 5

What was checked on the deployed product, on which commit and when, as [Environments And Deployment](https://github.com/inno-itpd/itpd/blob/main/requirements/repository-requirements.md#environments-and-deployment) asks.
How the deployment is done is in [`docs/deployment.md`](../../docs/deployment.md).
The address of the VM is not written here: it is `<university-vm-ipv4>`, and the ports are those of the runbook.

## Release candidate

| Item                   | Staging                                  | Production                               |
| ---------------------- | ---------------------------------------- | ---------------------------------------- |
| Commit                 | `e749a2b`                                | `e749a2b`                                |
| Port                   | `8001`                                   | `8002`                                   |
| Updated and checked at | 2026-10-30, 22:09 (UTC+03:00)            | 2026-10-30, 22:13 (UTC+03:00)            |
| Checked by             | nataliamotand                            | nataliamotand                            |
| Machine                | A campus machine on the university Wi-Fi | A campus machine on the university Wi-Fi |
| Result                 | Passes                                   | Passes                                   |

Staging and production run the same commit, each with its own `.env`, its own database file and its own service, as [`docs/deployment.md`](../../docs/deployment.md#environments) describes.

### What was checked

The same steps ran on staging first and on production after it passed:

1. The product page opened at `http://<university-vm-ipv4>:<port>` from the campus machine.
2. A pasted German text with a marked word gave a card with a sentence and its translation.
3. A card was studied: answering it in the study session scheduled it, and the page said it would come back on 2026-11-01.
4. `/api/health` answered `{"status":"ok"}`, and a card deleted in the product was gone from the cards and from the study queue, which is the behaviour of US-04.

### What was not checked

Only the core task was verified, as the requirement asks.
The language model answers came from Cloudflare Workers AI, whose daily quota both environments share, so no long run was made before the Sprint Review.

## Final commit after the Sprint Review

The Sprint Review asked for no change to the product: the Customer accepted `US-04` and `US-09` and asked for a new acceptance criterion about the browsers, which needs no code.
No rework changed the commit, so the release candidate above is the final commit, `e749a2b`.
Since that commit, `main` changed only documents and reports, and no file of the product.

On 2026-10-31, at 18:06 (UTC+03:00), nataliamotand checked on the VM that staging and production were still on `e749a2b` with no changed file, and that `/api/health` answered `{"status":"ok"}` on both ports.
The core task was last taken on production on 2026-10-31 between 16:30 and 16:33, in Firefox and Chrome on a computer and in Chrome on a phone, for `AC-04` of `US-09`, and it passed in all three.
