# Benchmark

Webhook load tests using [k6](https://grafana.com/docs/k6/) (Grafana Labs). Run via Docker only.

## Scenarios

| File                  | VUs  | Iterations | Description              |
|-----------------------|------|------------|--------------------------|
| `webhook_smoke.js`    | 5    | 100        | Smoke test (light load)  |
| `webhook_get.js`      | 100  | 100k       | Baseline GET             |
| `webhook_post.js`     | 100  | 100k       | Baseline POST            |
| `webhook_stress.js`   | 300  | 200k       | Stress (peak traffic)    |
| `webhook_sustained.js`| 150  | 500k       | Sustained load           |

## Usage (Docker)

Start the app first (e.g. `mix phx.server` or your stack). From the **project root**:

**Git Bash (Windows)** — use `MSYS_NO_PATHCONV=1` so `/scripts` is not rewritten to a local path:

```bash
MSYS_NO_PATHCONV=1 docker run --rm \
  -e BASE_URL=http://host.docker.internal:4000 \
  -v "$(pwd)/benchmark:/scripts" \
  -w /scripts \
  grafana/k6:latest \
  run webhook_smoke.js
```

**PowerShell (Windows):**

```powershell
docker run --rm `
  -e BASE_URL=http://host.docker.internal:4000 `
  -v "${PWD}/benchmark:/scripts" `
  -w /scripts `
  grafana/k6:latest `
  run webhook_smoke.js
```

**Linux / macOS:**

```bash
docker run --rm \
  -e BASE_URL=http://localhost:4000 \
  -v "$(pwd)/benchmark:/scripts" \
  -w /scripts \
  grafana/k6:latest \
  run webhook_smoke.js
```

Replace `webhook_smoke.js` with `webhook_get.js`, `webhook_stress.js`, etc. as needed.

- **Linux (no host.docker.internal):** use `http://172.17.0.1:4000` or your host gateway for `BASE_URL`.

## Thresholds

Each scenario defines limits; k6 exits with code 99 if they are exceeded:

- `http_req_duration` — max P95 latency
- `http_req_failed` — max error rate
