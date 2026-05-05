# FusionFlow Core

The `fusion_flow_core` application is the foundational business logic layer of the FusionFlow platform.

## Responsibilities

- **Database Schemas & Contexts**: Contains Ecto schemas, migrations, and contexts for core resources like `Flows`, `Executions`, `Accounts` (users), and `Webhooks`.
- **Data Integrity**: Manages all interactions with the PostgreSQL database.
- **Shared Domain Logic**: Provides the centralized domain API consumed by other apps within the umbrella (UI, Worker, Nodes, and Runtime).
