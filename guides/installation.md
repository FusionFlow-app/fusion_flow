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

### 3. Start the server
```bash
mix phx.server
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

---

## 🐳 Installation (Docker)

Running with Docker is the fastest way to get started without worrying about local dependencies.

### 1. Clone the repository
```bash
git clone https://github.com/FusionFlow-app/fusion_flow.git
cd fusion_flow
```

### 2. Start with Docker Compose
```bash
docker compose up -d --build
```
This command will automatically:
- Build the application image.
- Start the database (Postgres).
- Run necessary migrations and seeds.
- Start the server.

### 3. Access the application
Visit [`localhost:4000`](http://localhost:4000).

---

## 🧪 Verification

To ensure everything is working correctly, you can run the test suite:
```bash
mix test
```
