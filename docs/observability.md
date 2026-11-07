# Observability

The signals the product emits while it runs, the service level indicators (`SLI`) read from them, and the pipeline that stores them.
The product's analytics are a separate plan: [the analytics plan](analytics.md).

## The Signals

The three signal types are the metric, the log and the trace.
The product emits a metric and a log, and no trace.

- **Metric (emitted):** `backend_request_duration_ms`, a histogram of the time the `backend` takes to answer a request, in milliseconds. It carries the labels `route` and `outcome`, and it is the source of the aggregate [`SLI-01`](#sli-01).
- **Log (emitted):** one structured log line for each request to an `/api/` path, in the stream `backend_requests`. It is the per-request point that [`SLI-01`](#sli-01) names as its source, because a request identifier is not a label of a metric.
- **Trace (not emitted):** no `SLI` needs one, so the product emits none.

No alert is defined, and an alert is a rule over a signal, not a signal of its own.

The labels that every signal of a request carries:

| Field         | Signal           | Values                                                                                          |
| ------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `request_id`  | log line         | a random 32-character identifier, also sent to the caller in the `X-Request-ID` response header |
| `route`       | log line, metric | the path template that matched, such as `/api/texts/{text_id}/cards`, or `unmatched`            |
| `outcome`     | log line, metric | `ok` for a status below 400, `client_error` for 4xx, `server_error` for 5xx                     |
| `duration_ms` | log line, metric | the time from the request to the last byte of the response, in milliseconds                     |
| `method`      | log line         | the HTTP method                                                                                 |
| `status`      | log line         | the HTTP status code                                                                            |

The route is the path template and not the path, so an identifier in a path never reaches a signal, and the signals carry no text, word, sentence, library code or learner.

## The SLIs

An `SLI` here is a number read from the signals that says how well the product serves a request.
The runtime requirements need one so far: [`QR-07`](quality-requirements/qr/QR-07.md) needs to find a failed request and to see how slow the failures are.

### SLI-01

Request latency by route and outcome

- **Status:** Active
- **Definition:** How long the `backend` takes to answer a request to an `/api/` path, in milliseconds, with the labels `route` (the path template that identifies the request's route) and `outcome` (`ok`, `client_error` or `server_error`, which identifies the failure).
  The request itself is identified by `request_id`, which only the log line carries: a per-request point is a structured log line, not a metric label.
  The failure series of the chart is the `outcome` that is not `ok`.
- **Unit:** milliseconds (P95 of the request duration).
- **Window:** the five minutes before the query time, with a point in the log within five seconds of the response and a point in the metric within one minute of the request.
- **Source:** the histogram `backend_request_duration_ms` and the log stream `backend_requests`, both emitted by the `backend` container ([`ADR-008`](architecture/adr/ADR-008.md)).
- **Query:** the aggregate is the five-minute P95 of the histogram, in PromQL, which the chart `Request latency P95 by outcome (SLI-01)` runs:

  ```promql
  histogram_quantile(0.95, sum by (le, route, outcome) (increase(backend_request_duration_ms_bucket[5m])))
  ```

  The per-request query, in SQL, finds the log point of one request by its identifier:

  ```sql
  SELECT request_id, route, method, status, outcome, duration_ms
  FROM "backend_requests"
  WHERE request_id = '<request_id>'
  ```

## The Pipeline

The `backend` is the only container that emits signals ([`ADR-008`](architecture/adr/ADR-008.md)).
It does this in `backend/app/observability.py`, in a layer around every request to an `/api/` path, with the OpenTelemetry SDK, and it exports both signals over OTLP/HTTP to OpenObserve with the user of its own environment.

- **Duration:** the layer measures with a monotonic clock, and a request that raises an error is recorded as a `server_error` with status 500.
- **Metric export:** the histogram is exported every 10 seconds, which meets the one-minute window of [`SLI-01`](#sli-01).
- **Log export:** log lines are sent in batches every 1 second, which meets the five-second window of [`SLI-01`](#sli-01).
- **Failure of the backend of observability:** a batch that cannot be sent is dropped, the answer to the learner does not change, and no request waits for an export.
- **Backend:** OpenObserve v1.1.2 on the university VM, the same program as the analytics ([`ADR-007`](architecture/adr/ADR-007.md)).
  It has the organizations `observability_staging` and `observability_production`, one for each environment, so staging carries the test traffic and production carries real traffic only.
- **Reach:** OpenObserve and its dashboards are reachable from the university network only, with a user for each organization, and their addresses and credentials are in the Moodle submission and not in this repository.
- **Retention:** 90 days for the metric and the log of each organization, which covers the five-minute window of [`SLI-01`](#sli-01) many times over.
- **Collection:** `OBSERVABILITY_ENABLED` turns it on, and it is `false` by default, on a developer's machine, and in the tests.
  With it off the `backend` writes the log line to its own output and sends nothing.
- **Deployment:** the steps, the settings and the credentials are in [the telemetry pipelines](deployment.md#the-observability-pipeline), and none of them is repeated here.

## The Dashboard

Each environment has a dashboard in its own organization: `Observability (staging)` in `observability_staging` and `Observability (production)` in `observability_production`.
Each carries the chart `Request latency P95 by outcome (SLI-01)`, which runs the query recorded under [`SLI-01`](#sli-01) and shows a separate series for each outcome.
The staging dashboard shows the test traffic of [`QR-07`](quality-requirements/qr/QR-07.md), with its failure series.
The production dashboard has the same chart and query and receives no test traffic.
Both addresses are in the Moodle submission, and the week report links one sanitized screenshot from each.
