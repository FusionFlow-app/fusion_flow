# Runtime Isolation, UI Daemon Mode and Frontend Direction

This document analyzes three near-term architecture decisions:

1. isolating Python and Elixir code runners
2. allowing the UI app to run without the visual editor
3. deciding whether to keep the current LiveView + Rete.js + Lit frontend

## 1. Runner isolation

### Current state

The current execution path is:

```text
FusionFlowWorker.FlowExecutionWorker
  -> FusionFlowNodes.Runner
  -> FusionFlowNodes.Nodes.Eval
  -> FusionFlowRuntime.Runtime.execute/3
  -> FusionFlowRuntime.Runtime.Python or FusionFlowRuntime.Runtime.Elixir
```

Current Python execution uses `Pythonx.eval/2` inside the same OS process as the BEAM worker.

Current Elixir execution uses `Code.eval_string/2` inside the same BEAM VM as the worker.

This is not acceptable for untrusted or semi-trusted workflow code.

### Why this is risky

Pythonx embeds CPython in the same OS process as the BEAM. That means Python code can affect the worker process. It is useful, but it is not a permission boundary.

`Code.eval_string/2` is even more sensitive because arbitrary Elixir code runs inside the same BEAM VM. It can access modules, spawn processes, allocate atoms indirectly, read environment, call filesystem APIs, call network APIs, run system commands if available, and damage the worker node.

The critical point:

```text
Disabling the Python GIL improves concurrency. It does not provide sandboxing.
```

So the fix needs two separate tracks:

- evolve Pythonx and use free-threaded Python where possible
- isolate runner execution at the OS/container boundary

### Decision

Keep Pythonx, but move Pythonx execution out of the main worker VM.

The worker should orchestrate jobs, persist execution state and call an isolated runner. It should not directly evaluate user code in its own BEAM process.

Recommended target:

```text
worker container / VM
  -> sandbox runner process or sandbox runner container
       -> Pythonx for Python code
       -> isolated BEAM process for Elixir code
```

### Python plan

Upgrade Pythonx from `~> 0.3.0` to `~> 0.4`.

Use Pythonx with free-threaded Python in the isolated Python runner:

```elixir
Pythonx.uv_init(
  """
  [project]
  name = "fusion-flow-python-runtime"
  version = "0.1.0"
  requires-python = "==3.14.*"
  dependencies = []
  """,
  python: "3.14t"
)
```

Set the runtime env:

```bash
PYTHON_GIL=0
```

Add a boot-time assertion in the Python runner that verifies the interpreter is free-threaded. If free-threaded Python is unavailable, fail fast in prod and allow fallback only in dev.

Important: even with `PYTHON_GIL=0`, Python code still needs OS-level isolation.

### Elixir plan

Do not run user Elixir code through `Code.eval_string/2` inside the main worker VM.

Move Elixir evaluation to a separate BEAM OS process with:

- dedicated Unix user
- isolated working directory
- limited environment variables
- no application secrets
- memory limit
- CPU limit
- execution timeout
- stdout/stderr size limit
- optional network disabled by deployment policy

The first production-grade version should use process/container isolation, not an in-VM sandbox.

### Isolation levels

Support three runtime isolation modes:

```text
in_process
  only for local development and trusted flows

external_process
  starts a short-lived runner process per execution or per node

container
  starts or dispatches to a restricted runner container
```

Default should be:

- `in_process` in `dev`
- `external_process` or `container` in `prod`

### Runner protocol

Introduce a small JSON protocol between the worker and runtime runner:

Request:

```json
{
  "execution_id": "uuid",
  "node_id": "node-id",
  "language": "python",
  "code": "result = 1 + 1",
  "context": {},
  "limits": {
    "timeout_ms": 5000,
    "max_output_bytes": 65536
  }
}
```

Response:

```json
{
  "status": "ok",
  "result": {},
  "logs": []
}
```

Error response:

```json
{
  "status": "error",
  "error": {
    "type": "runtime_error",
    "message": "..."
  },
  "logs": []
}
```

### Implementation steps

1. Add `FusionFlowRuntime.Executor` boundary that hides direct calls to Python/Elixir implementations.
2. Add `FusionFlowRuntime.Sandbox` behaviour with adapters:
   - `InProcess`
   - `ExternalProcess`
   - later `Container`
3. Keep current runtime modules as implementation details behind `InProcess`.
4. Add dedicated runner entrypoints:
   - `bin/fusion_flow_python_runner`
   - `bin/fusion_flow_elixir_runner`
5. Make `FusionFlowNodes.Nodes.Eval` call the new sandbox boundary.
6. Add timeout and max output handling.
7. Add structured runtime errors.
8. Upgrade Pythonx and configure free-threaded Python for the Python runner.
9. Add Docker runtime image support for runner mode.
10. Change production defaults to disallow `in_process`.

### Minimum production policy

For production:

```bash
FUSION_FLOW_RUNTIME_ISOLATION=external_process
FUSION_FLOW_ALLOW_IN_PROCESS_EVAL=false
PYTHON_GIL=0
```

Eventually:

```bash
FUSION_FLOW_RUNTIME_ISOLATION=container
```

### What not to do

Do not try to secure arbitrary Elixir code with only:

- process dictionary cleanup
- restricted bindings
- hiding imports
- `try/rescue`
- a GenServer wrapper
- Task timeout

Those are useful operational controls, but they are not security boundaries.

## 2. UI daemon mode

### Question

Can the UI app run with the visual part disabled, like a daemon?

### Answer

Yes, it is possible. It can make sense, but the name matters.

There are two different modes:

```text
ui_full
  Phoenix endpoint, LiveView pages, assets, visual editor, API routes

ui_api
  Phoenix endpoint and API/webhook routes, but no visual editor routes/assets dependency at runtime
```

Calling this "daemon UI" is a little confusing because a daemon usually means no HTTP UI at all. In this project, the useful mode is more like:

```text
headless UI gateway
```

It would keep HTTP/API/webhook responsibilities without serving the visual editor.

### When it makes sense

It makes sense if you want to deploy:

- API/webhook gateway without the visual editor
- internal automation endpoint
- server that only enqueues executions
- smaller attack surface for production environments where users should not edit flows

It does not replace workers. It still only receives requests and enqueues work.

### Current coupling

Today `fusion_flow_ui` includes:

- Phoenix Endpoint
- router
- controllers
- plugs
- LiveViews
- static assets
- Rete/Lit editor bundle
- Oban client

This is acceptable for normal UI deployment, but not ideal for a headless gateway.

### Recommended mode split

Add a runtime flag:

```bash
FUSION_FLOW_UI_MODE=full
```

Allowed values:

```text
full
api
```

In `full` mode:

- enable LiveViews
- serve static assets
- expose flow editor routes
- expose dashboard/executions pages

In `api` mode:

- enable API controllers
- enable webhook endpoints
- disable LiveView/editor routes
- optionally disable static asset serving

### Router plan

Split router scopes by mode:

```text
always enabled:
  /api/*
  webhook endpoints

full mode only:
  /
  /flows
  /flows/:id
  /flows/new/ai
  /executions
  /users/*
```

Authentication routes need a decision:

- keep auth routes in `api` mode only if API login/session is needed
- otherwise disable browser auth pages in `api` mode

### Release plan

Keep the same `fusion_flow_ui` release initially.

Add runtime mode:

```bash
FUSION_FLOW_UI_MODE=api
```

Later, if the split proves useful, create a separate release:

```text
fusion_flow_gateway
```

That release would include Phoenix controllers/plugs, but not LiveView/editor assets.

### Recommendation

Do not create a separate app immediately.

First implement `FUSION_FLOW_UI_MODE=api` inside `fusion_flow_ui`. If this becomes important operationally, split `fusion_flow_gateway` later.

## 3. Frontend direction

### Current frontend stack

The visual editor currently uses:

- Phoenix LiveView for server-side state and real-time feedback
- Rete.js v2 for node graph editing
- Lit for custom node/socket/control rendering
- regular Phoenix assets through `app.js` and `app.css`

### Does this stack make sense?

Yes, for the current product stage it still makes sense.

The product is a workflow orchestrator, not a general frontend-heavy SPA. LiveView is a good fit for:

- authentication
- dashboards
- execution state
- server-driven updates
- admin workflows
- real-time execution notifications

Rete.js is also a reasonable fit because the core UI is a visual graph editor. Lit custom elements are a pragmatic way to customize Rete rendering without moving the whole app to a SPA.

### Main risks

The risks are not "LiveView is wrong" or "Rete is wrong".

The risks are:

- editor state can become too complex inside a LiveView page
- large graphs can become heavy if every small editor change syncs too much to the server
- custom Rete/Lit integration can become hard to test
- TypeScript discipline is currently light
- graph validation and graph persistence need strong boundaries outside the UI

### Should we migrate now?

Recommendation: do not migrate the frontend now.

The project just went through an umbrella/runtime split. Migrating the visual editor at the same time would increase risk without solving the most severe current issue.

The severe issue is runner isolation. That should be handled first.

### What to improve now instead

Keep LiveView + Rete + Lit, but harden the boundary:

1. Move editor serialization/deserialization into a dedicated JS module with tests.
2. Define a stable graph JSON schema in core.
3. Add server-side graph validation before saving.
4. Reduce LiveView/editor coupling to coarse events:
   - load graph
   - save graph
   - validate graph
   - run flow
5. Avoid sending every editor micro-change to LiveView unless needed.
6. Add Playwright coverage for core editor workflows.

### When to reconsider migration

Reconsider the frontend stack if one of these becomes true:

- graph editor needs offline-first editing
- collaboration becomes CRDT-heavy
- Rete plugin ecosystem blocks required features
- graph size grows beyond what the current editor can handle
- frontend team wants React/Vue/Svelte specialization
- the editor needs a fully client-side domain model with complex local simulation

### Candidate alternatives

If migration becomes necessary later:

- React Flow: strongest mainstream option for React teams
- Vue Flow: reasonable if moving to Vue
- Svelte Flow: lighter, but smaller ecosystem
- custom canvas/WebGL editor: only if graph scale or interaction requirements justify the cost

For now, none of these justify a migration.

## Proposed task list

### Phase 1: Safety boundary

1. Add `FusionFlowRuntime.Sandbox` behaviour.
2. Move Eval node execution through the sandbox boundary.
3. Add `in_process` and `external_process` adapters.
4. Add timeout and max output limits.
5. Add structured runtime error persistence.
6. Add tests for timeout, runtime error and malformed output.

### Phase 2: Pythonx evolution

1. Upgrade Pythonx to `~> 0.4`.
2. Configure free-threaded Python with `python: "3.14t"`.
3. Set `PYTHON_GIL=0` in Python runner mode.
4. Add boot assertion for free-threaded Python.
5. Keep fallback only in dev.

### Phase 3: Elixir isolation

1. Add isolated Elixir runner executable/release.
2. Execute Elixir code in that external BEAM process.
3. Strip environment variables.
4. Add memory/CPU/timeout controls at process/container level.
5. Disable in-process Elixir eval in prod.

### Phase 4: Container isolation

1. Add container runner mode.
2. Add read-only filesystem where possible.
3. Add temp workdir per execution.
4. Add optional network policy.
5. Add resource limits in Docker Compose and deployment docs.

### Phase 5: Headless UI gateway

1. Add `FUSION_FLOW_UI_MODE=full|api`.
2. Split router scopes by mode.
3. Keep API/webhook routes in `api` mode.
4. Disable visual/editor routes in `api` mode.
5. Add docs and tests.

### Phase 6: Frontend hardening

1. Keep LiveView + Rete + Lit.
2. Add graph JSON schema.
3. Add server-side graph validation.
4. Add editor serialization tests.
5. Add Playwright tests for create/edit/save/run flow.

## Recommended order

Do this first:

```text
runner isolation -> Pythonx upgrade/free-threaded mode -> Elixir external runner
```

Then:

```text
headless UI gateway
```

Then:

```text
frontend hardening
```

Do not start a frontend migration now unless the editor is already blocking product requirements.

## References

- Pythonx README in this repo: `deps/pythonx/README.md`
- Pythonx documentation: https://hexdocs.pm/pythonx
- Python free-threaded CPython documentation: https://docs.python.org/3/howto/free-threading-python.html
- Rete.js documentation: https://retejs.org
