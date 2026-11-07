# Deployment

How the product runs in its four environments, and how a teammate on the university network deploys it by hand.
It does not repeat how to build and run the product: [`setup.md`](setup.md) says that, and this page links it where it is needed.

## Environments

| Environment | What it is                                                                                   | Where it runs                       |
| ----------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| Development | A teammate's local machine, where the product is built, run and checked.                     | A local machine, as in `setup.md`.  |
| Integration | The product CI on GitHub Actions, which runs the checks and the tests on every pull request. | GitHub Actions, outside the campus. |
| Staging     | The production-like deployment, where a release candidate is checked before production.      | The university VM, port `8001`.     |
| Production  | The live deployment, which the Customer opens from the university network.                   | The university VM, port `8002`.     |

Staging and production are two separate deployments on the same VM.
Each has its own copy of the code, its own `.env`, its own database file and its own service, so a test against staging never writes production data.
The product CI cannot deploy and cannot reach the VM, because it runs outside the university network.

## The VM and how to reach it

- **Machine:** one virtual machine from the university portal, with Ubuntu 24.04, 4 virtual CPUs, 4 GB of memory and a 60 GB disk.
  Python 3.12, Node.js 22 and Git are installed on it.
- **Network:** the VM has an IPv4 address on the university network and no domain name.
  It answers only from the university network, on the `UniversityStudent` Wi-Fi or a campus machine.
  A VPN on the connecting computer must be off, because it hides the campus route.
- **Address:** the real address is private-only and is never written in the repository.
  The commands below read it from the environment variable `VM_HOST`.
- **Account:** the VM account is `root`, with the password that the member set in the portal when the VM was created.
  The password is kept in the team's password manager, never in the repository or in an issue.
- **Connect:**

  ```bash
  export VM_HOST=<university-vm-ipv4>
  ssh root@$VM_HOST
  ```

  On Windows PowerShell, set the variable with `$env:VM_HOST = "<university-vm-ipv4>"` and connect with `ssh root@$env:VM_HOST`.

- **Check the route first:** `Test-NetConnection $env:VM_HOST -Port 22` in PowerShell must answer `TcpTestSucceeded : True` with the `Wi-Fi` interface.

At least one member on campus runs the deployment, because the product CI and a home connection cannot reach the VM.

## Configuration

The product reads `.env` in the root of its own copy of the code, and `.env` is never committed.
[`.env.example`](../.env.example) shows the names and the shape, and [`setup.md`](setup.md#configuration) explains each setting.

Staging and production each keep their own `.env` on the VM, so their secrets are separate:

| Setting         | Staging                              | Production                              |
| --------------- | ------------------------------------ | --------------------------------------- |
| `LLM_API_KEY`   | A key made for staging, kept private | A key made for production, kept private |
| `LLM_MODEL`     | The model named in `DEC-044`         | The model named in `DEC-044`            |
| `LLM_BASE_URL`  | The provider endpoint of `DEC-044`   | The provider endpoint of `DEC-044`      |
| `DATABASE_PATH` | `data/cards.db` in the staging copy  | `data/cards.db` in the production copy  |

Each learner's library is a database file in the folder `libraries` next to the `DATABASE_PATH` file, named by its library code ([`ADR-006`](architecture/adr/ADR-006.md)).
The two environments run the same code, so only the secrets and the data differ.

## The language model provider

The model of the VM comes from Cloudflare Workers AI, through its OpenAI-compatible endpoint, because Google's Gemini endpoint refuses requests from the VM's address, as [`DEC-044`](decisions.md#dec-044) and [`RISK-01`](risks.md#risk-01) record.
The product needs no code change for this: it is set only through `LLM_API_KEY`, `LLM_MODEL` and `LLM_BASE_URL`, as [`ADR-003`](architecture/adr/ADR-003.md) says.

- **Model:** `@cf/mistralai/mistral-small-3.1-24b-instruct`.
- **Endpoint:** `https://api.cloudflare.com/client/v4/accounts/<CLOUDFLARE_ACCOUNT_ID>/ai/v1`, where `<CLOUDFLARE_ACCOUNT_ID>` is the account identifier, which is private-only.
- **Daily quota:** Cloudflare's pricing page says "10,000 Neurons per day at no charge" and "All limits reset daily at 00:00 UTC" ([Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)).
  Both environments draw on the same account, so a long test in staging uses the quota that production needs.
  A refused request after the quota is spent shows the error "The language model returned an error", and the quota comes back at 03:00 Moscow time.

## Deploy by hand

Deploy from a machine on the university network.
The release candidate goes to staging first, and the same commit then goes to production.

1. Choose the commit, which is the release tag or the commit on `main` that the release is cut from, and call it `<commit>`.
2. Connect to the VM, as in [The VM and how to reach it](#the-vm-and-how-to-reach-it).
3. The first time only, make one copy of the code for each environment:

   ```bash
   mkdir -p /opt/sentence-cards
   git clone https://github.com/itpd-team-6/sentence-cards-generator-team-6.git /opt/sentence-cards/staging
   git clone https://github.com/itpd-team-6/sentence-cards-generator-team-6.git /opt/sentence-cards/production
   ```

   Then create each copy's `.env` from [`.env.example`](../.env.example), with the values of its environment.

4. Update the staging copy to the commit and rebuild it, following [`setup.md`](setup.md#install) for the install and the build:

   ```bash
   cd /opt/sentence-cards/staging
   git fetch --tags origin
   git checkout <commit>
   ```

5. Start staging with its `systemd` service, which runs the product from the `backend` folder of the copy on port `8001`, and starts it again if it fails, so it survives the end of the SSH session.
   Production has the same service on port `8002`.
   The first time only, create the file `/etc/systemd/system/sentence-cards-staging.service`, and the same file for production with `production` in the description, in the path and in the name, and port `8002`:

   ```ini
   [Unit]
   Description=Sentence cards generator (staging)
   After=network.target

   [Service]
   WorkingDirectory=/opt/sentence-cards/staging/backend
   ExecStart=/opt/sentence-cards/staging/backend/.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

   Then run `systemctl daemon-reload` and `systemctl enable --now sentence-cards-staging`.
   After each update of the code, restart the service with `systemctl restart sentence-cards-staging`, and see that it runs with `systemctl status sentence-cards-staging`.

6. Verify staging, as in [Verify a deployment](#verify-a-deployment).
7. Only when staging passes, repeat steps 4 to 6 in `/opt/sentence-cards/production` with port `8002`.
   Before the update, copy the production database file and the folder `libraries` next to it, as [Roll back](#roll-back) needs them.

## The telemetry pipelines

The product sends two kinds of telemetry to OpenObserve, which runs on the VM: the product analytics, described in [the analytics plan](analytics.md), and the observability signals.
One OpenObserve instance carries four organizations, `analytics_staging`, `analytics_production`, `observability_staging` and `observability_production`, so the data of each environment and each kind stays apart.
The address of OpenObserve and its passwords are private-only and are not in this repository.

### The analytics pipeline

1. Install OpenObserve on the VM as a `systemd` service named `openobserve`, listening on port `5080`, from a folder of its own (`/opt/openobserve`) that has its data folder and its `.env`.
   The program is copied to the VM from a computer that can download it, because the VM cannot reach the download site.
2. Open OpenObserve from a campus machine, and make the organizations `analytics_staging` and `analytics_production` under IAM, Organizations.
3. In each of the two organizations make one user for the product, with its own password, and keep the password only in the `.env` of the matching environment.
4. Set the retention of the stream `events` of each organization to 90 days, as [the analytics plan](analytics.md#the-pipeline) says.
5. In the `.env` of each environment set the variables below, with the organization and the user of that environment, and restart its service:

   | Setting              | Staging                               | Production                               |
   | -------------------- | ------------------------------------- | ---------------------------------------- |
   | `ANALYTICS_ENABLED`  | `true`                                | `true`                                   |
   | `ANALYTICS_URL`      | OpenObserve as the VM reaches it      | OpenObserve as the VM reaches it         |
   | `ANALYTICS_ORG`      | the identifier of `analytics_staging` | the identifier of `analytics_production` |
   | `ANALYTICS_STREAM`   | `events`                              | `events`                                 |
   | `ANALYTICS_USER`     | the user of the staging organization  | the user of the production organization  |
   | `ANALYTICS_PASSWORD` | its password, kept private            | its password, kept private               |

   `ANALYTICS_ORG` is the identifier that OpenObserve shows next to the name of the organization, because the address of the ingestion uses it.

6. Check the pipeline with a test event in staging only, tagged `source=smoke`:

   ```bash
   curl -X POST "$ANALYTICS_URL/api/$ANALYTICS_ORG/events/_json" -u "$ANALYTICS_USER:$ANALYTICS_PASSWORD" \
     -H "Content-Type: application/json" \
     -d '[{"event": "text_saved", "learner_id": "smoke-test", "source": "smoke", "words_marked": 1}]'
   ```

   The event list of the staging dashboard shows it, and the charts leave it out.

7. Build the dashboard of each environment in its organization with the charts of [the analytics plan](analytics.md#the-dashboard), each running the query of its metric.

### The observability pipeline

The signals, the labels and the queries are in [the observability plan](observability.md); this section only installs and configures them.

1. Open OpenObserve from a campus machine, and make the organizations `observability_staging` and `observability_production` under IAM, Organizations.
2. In each of the two organizations make one user for the product, with its own password, and keep the password only in the `.env` of the matching environment.
3. Set the retention of the metric and of the stream `backend_requests` of each organization to 90 days.
4. Install the new requirements of the `backend` on the VM, and in the `.env` of each environment set the variables below, with the organization and the user of that environment, and restart its service:

   | Setting                                 | Staging                                   | Production                                   |
   | --------------------------------------- | ----------------------------------------- | -------------------------------------------- |
   | `OBSERVABILITY_ENABLED`                 | `true`                                    | `true`                                       |
   | `OBSERVABILITY_URL`                     | OpenObserve as the VM reaches it          | OpenObserve as the VM reaches it             |
   | `OBSERVABILITY_ORG`                     | the identifier of `observability_staging` | the identifier of `observability_production` |
   | `OBSERVABILITY_USER`                    | the user of the staging organization      | the user of the production organization      |
   | `OBSERVABILITY_PASSWORD`                | its password, kept private                | its password, kept private                   |
   | `OBSERVABILITY_METRIC_INTERVAL_SECONDS` | `10`                                      | `10`                                         |
   | `OBSERVABILITY_LOG_BATCH_SECONDS`       | `1`                                       | `1`                                          |

   The metric interval and the log batch interval meet the windows of [`SLI-01`](observability.md#sli-01).

5. The query endpoint for the metric is `$OPENOBSERVE_URL/api/<organization>/prometheus/api/v1/query` and for the log it is `$OPENOBSERVE_URL/api/<organization>/_search?type=logs`, with the user and the password of the organization sent as basic authentication; [`scripts/check-sli.mjs`](../scripts/check-sli.mjs) reads them from the environment.
6. Build the dashboard of each environment in its organization with the chart of [the observability plan](observability.md#the-dashboard).
7. Check the pipeline in staging with `node scripts/check-sli.mjs`, which is the test [`QRT-01` of `QR-07`](quality-requirements/qr/QR-07.md#qrt-01).

## Verify a deployment

After each production deploy, a member opens the deployed product from a campus machine and takes the core task: paste a text, mark a word, ask for sentences, and study the cards.
[`setup.md`](setup.md#try-the-core-task) lists the steps.

1. From a campus machine, `http://<university-vm-ipv4>:8002/api/health` answers `{"status":"ok"}`, and the product page opens at `http://<university-vm-ipv4>:8002`.
2. A pasted text with one marked word gets a card with a sentence and a translation.
3. The card can be studied, and the answer schedules it.
4. The result is recorded with the release: the commit, the date, who checked it, and what happened.

A deployment that fails this check is rolled back.

## Roll back

A deployment that fails its verification returns to the previous release:

1. Stop the service of the failed environment.
2. Restore the database file and the folder `libraries` that were copied before the update, because a new migration may have changed the files and the older code does not read them.
3. Check out the previous release tag in the environment's copy of the code, rebuild it as in [`setup.md`](setup.md#install), and start it again.
4. Verify it again, as in [Verify a deployment](#verify-a-deployment).
