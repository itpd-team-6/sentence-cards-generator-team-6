// QRT-01 of QR-07: sends test traffic to the staging deployment, one request of which fails, and checks that
// the log point of the failed request is queryable within 5 seconds of its response and that SLI-01 returns the
// failure series with a P95 value within 1 minute of it.
//
// Run from a machine on the university network:
//   STAGING_URL=... OPENOBSERVE_URL=... OPENOBSERVE_ORG=... OPENOBSERVE_USER=... OPENOBSERVE_PASSWORD=... \
//     node scripts/check-sli.mjs
// The addresses and the credential are read from the environment; none of them is stored in the repository.

import { randomUUID } from "node:crypto";

const LOG_DEADLINE_MS = 5000;
const METRIC_DEADLINE_MS = 60000;
const POLL_MS = 250;
const METRIC_POLL_MS = 2000;
const SLI_QUERY =
  "histogram_quantile(0.95, sum by (le, route, outcome) (increase(backend_request_duration_ms_bucket[5m])))";
const FAILED_ROUTE = "/api/texts/{text_id}/cards";

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing environment variable ${name}`);
    process.exit(2);
  }
  return value.replace(/\/+$/, "");
}

const stagingUrl = required("STAGING_URL");
const openObserveUrl = required("OPENOBSERVE_URL");
const org = required("OPENOBSERVE_ORG");
const authorization =
  "Basic " +
  Buffer.from(
    `${required("OPENOBSERVE_USER")}:${required("OPENOBSERVE_PASSWORD")}`,
  ).toString("base64");

const library = randomUUID();
const productHeaders = {
  "Content-Type": "application/json",
  "X-Library-Code": library,
  "X-Event-Source": "smoke",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function productRequest(method, path, body) {
  const response = await fetch(`${stagingUrl}${path}`, {
    method,
    headers: productHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  await response.arrayBuffer();
  return {
    status: response.status,
    requestId: response.headers.get("x-request-id"),
  };
}

async function queryLog(requestId) {
  const end = Date.now() * 1000;
  const sql = `SELECT request_id, route, method, status, outcome, duration_ms FROM "backend_requests" WHERE request_id = '${requestId}'`;
  const response = await fetch(
    `${openObserveUrl}/api/${org}/_search?type=logs`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          sql,
          start_time: end - 10 * 60 * 1e6,
          end_time: end + 60 * 1e6,
          from: 0,
          size: 5,
        },
      }),
    },
  );
  if (!response.ok) throw new Error(`log query answered ${response.status}`);
  return (await response.json()).hits ?? [];
}

async function queryP95() {
  const params = new URLSearchParams({
    query: SLI_QUERY,
    time: String(Math.floor(Date.now() / 1000)),
  });
  const response = await fetch(
    `${openObserveUrl}/api/${org}/prometheus/api/v1/query?${params}`,
    {
      headers: { Authorization: authorization },
    },
  );
  if (!response.ok) throw new Error(`SLI query answered ${response.status}`);
  return (await response.json()).data?.result ?? [];
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

console.log("Sending test traffic to the staging deployment");
const first = await productRequest("GET", "/api/health");
const second = await productRequest("GET", "/api/decks");
if (first.status !== 200 || second.status >= 400)
  fail("the successful requests were not answered with success");

const failed = await productRequest("POST", "/api/texts/99999999/cards", {
  deck_ids: [1],
});
const answeredAt = Date.now();
console.log(
  `Failed request: status ${failed.status}, request_id ${failed.requestId}`,
);
if (failed.status !== 404)
  fail("the request that should fail did not answer 404");
if (!failed.requestId) fail("the response has no X-Request-ID header");

let hits = [];
while (Date.now() - answeredAt <= LOG_DEADLINE_MS) {
  hits = await queryLog(failed.requestId);
  if (hits.length > 0) break;
  await sleep(POLL_MS);
}
const logSeconds = (Date.now() - answeredAt) / 1000;
if (hits.length !== 1)
  fail(
    `no single log point for the failed request within ${LOG_DEADLINE_MS / 1000} s`,
  );
const point = hits[0];
if (
  point.route !== FAILED_ROUTE ||
  point.outcome !== "client_error" ||
  Number(point.status) !== 404
) {
  fail(`the log point has the wrong labels: ${JSON.stringify(point)}`);
}
console.log(
  `Log point found after ${logSeconds.toFixed(1)} s: ${JSON.stringify(point)}`,
);

let series = null;
while (Date.now() - answeredAt <= METRIC_DEADLINE_MS) {
  const result = await queryP95();
  series = result.find(
    (item) =>
      item.metric?.route === FAILED_ROUTE &&
      item.metric?.outcome === "client_error",
  );
  if (series && Number.isFinite(Number(series.value?.[1]))) break;
  series = null;
  await sleep(METRIC_POLL_MS);
}
const metricSeconds = (Date.now() - answeredAt) / 1000;
if (!series)
  fail(
    `SLI-01 returned no failure series with a P95 value within ${METRIC_DEADLINE_MS / 1000} s`,
  );
console.log(
  `SLI-01 failure series after ${metricSeconds.toFixed(1)} s: route ${series.metric.route}, outcome ${series.metric.outcome}, P95 ${Number(series.value[1]).toFixed(1)} ms`,
);
console.log("PASS");
