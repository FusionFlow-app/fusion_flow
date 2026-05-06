# Installation Guide

This guide will help you get **FusionFlow** up and running on your local machine.

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- **Elixir** ~> 1.15
- **Erlang/OTP** 26+
- **PostgreSQL**
- **Node.js** (for assets)

---

## 🏗 Installation (Source)

Follow these steps to run FusionFlow directly from the source code.

### 1. Clone the repository
```bash
git clone https://github.com/FusionFlow-app/fusion_flow.git
cd fusion_flow
```

### 2. Install dependencies and setup
This command will install Hex and NPM dependencies, create the database, and run migrations.
```bash
mix setup
```

### 3. Start UI and worker together
Open two terminals.

In the first terminal:
```bash
cd apps/fusion_flow_ui
mix phx.server
```

In the second terminal:
```bash
cd apps/fusion_flow_worker
mix run --no-halt
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

This is the recommended local setup. The UI can render without the worker, but asynchronous executions and webhooks need the worker running.

### 4. Start only one service
If you need to isolate a process during development:

Start only the UI:
```bash
cd apps/fusion_flow_ui
mix phx.server
```

Start only the worker:
```bash
cd apps/fusion_flow_worker
mix run --no-halt
```

---

## 🐳 Installation (Docker)

Running with Docker is the fastest way to get started without worrying about local dependencies.

### 1. Clone the repository
```bash
git clone https://github.com/FusionFlow-app/fusion_flow.git
cd fusion_flow
```

### 2. Build the image
```bash
docker build -t fusion_flow .
```

### 3. Run the full stack in one container
```bash
docker run --rm -p 4000:4000 \
  --env-file .env \
  -e DATABASE_URL=ecto://postgres:postgres@host.docker.internal/fusion_flow \
  -e SECRET_KEY_BASE=replace-me \
  fusion_flow
```

No mode argument means `all`, which starts UI and worker in the same container.

### 4. Run with Docker Compose
```bash
docker compose up -d --build db ui worker
```

This is the recommended Docker setup for development because it keeps UI and worker split while starting both together.

To run everything in a single service:
```bash
docker compose --profile all up -d --build db all
```

### 5. Run only the UI
```bash
docker run --rm -p 4000:4000 \
  --env-file .env \
  -e DATABASE_URL=ecto://postgres:postgres@host.docker.internal/fusion_flow \
  -e SECRET_KEY_BASE=replace-me \
  fusion_flow ui
```

### 6. Run only the worker
```bash
docker run --rm \
  --env-file .env \
  -e DATABASE_URL=ecto://postgres:postgres@host.docker.internal/fusion_flow \
  -e SECRET_KEY_BASE=replace-me \
  fusion_flow worker
```

### 7. Access the application
Visit [`localhost:4000`](http://localhost:4000).

### 8. Concurrency and pool tuning

The default Docker setup now separates the main scaling knobs:

- `UI_POOL_SIZE=10`
- `WORKER_POOL_SIZE=3`
- `OBAN_EXECUTIONS_CONCURRENCY=5`
- `OBAN_DEFAULT_CONCURRENCY=2`

Increase worker replicas carefully and tune these values together with your Postgres limits.

### 9. API-only UI mode

The UI release can run as an HTTP API gateway without the visual interface:

```bash
FUSION_FLOW_UI_MODE=api
```

In this mode FusionFlow starts the API endpoint only:

- `/api/*` routes stay available
- webhook execution endpoints stay available
- LiveView routes are disabled
- static visual assets are not served
- `/live` is not registered

Docker example:

```bash
docker run --rm -p 4000:4000 \
  --env-file .env \
  -e DATABASE_URL=ecto://postgres:postgres@host.docker.internal/fusion_flow \
  -e SECRET_KEY_BASE=replace-me \
  -e FUSION_FLOW_UI_MODE=api \
  fusion_flow ui
```

---

## 🧪 Verification

To ensure everything is working correctly, you can run the test suite:
```bash
mix test
```

For multi-instance deployment and worker scaling, see [guides/scaling.md](./scaling.md).
