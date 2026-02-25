# Contributing to FusionFlow

We welcome contributions to FusionFlow! Whether you're fixing bugs, adding new node types, or improving documentation, your help is appreciated.

## How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
4.  **Make your changes**. Please follow the existing code style and ensure tests pass.
5.  **Commit your changes** with clear, descriptive messages.
6.  **Push to your fork**:
    ```bash
    git push origin feature/my-new-feature
    ```
7.  **Open a Pull Request** against the `main` branch of the original repository.

## Development Guidelines

-   **Node Development**: New nodes should be added to `lib/fusion_flow/nodes/`. Follow the structure of existing nodes (separated `definition/0` and `handler/2`).
-   **UI Components**: We use Phoenix LiveView for the UI. Ensure any new JS components in `assets/js` are properly integrated via hooks.
-   **Code Formatting**: Always run `mix format` before committing to maintain consistent code style.

## Testing

Run all backend tests (Elixir/Phoenix):

```bash
mix test
```

Run a specific test file:

```bash
mix test test/fusion_flow_web/live/flow_live_test.exs
```

### E2E Tests (Playwright)

E2E tests are **strongly recommended** when your changes involve:

- Critical frontend changes (components, layouts, interactions)
- LiveView communication (events, hooks, push_event)
- Authentication or session flow
- The Rete node editor (context menu, nodes, connections)

Make sure the Phoenix server is running before executing:

```bash
npm run test:e2e
```

To run in headed mode (opens browser window for debugging):

```bash
npm run test:e2e:headed
```

To run a specific test file against a single browser:

```bash
npx playwright test e2e/flows/flow_editor.spec.js --project=chromium
```

> **Note**: E2E tests require the Phoenix server at `http://localhost:4000` and a seeded database (`mix ecto.setup`).
