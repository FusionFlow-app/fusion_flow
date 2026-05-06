# FusionFlow Worker

The `fusion_flow_worker` application is the asynchronous background processing engine of the platform.

## Responsibilities

- **Job Orchestration**: Utilizes Oban to queue, supervise, and dispatch flow executions asynchronously.
- **Fault Tolerance**: Manages retries, scheduled jobs, and handles node-level crashes without stopping the core system.
- **Execution Tracking**: Records start times, end times, failures, and updates execution statuses to the database across the lifetime of a triggered flow.
