# FusionFlow UI

The `fusion_flow_ui` application provides the web-based graphical interface and HTTP entry points for FusionFlow.

## Responsibilities

- **Web Dashboard**: Powered by Phoenix LiveView to provide real-time updates for flow management, execution logs, and analytics.
- **Visual Editor**: Uses `Rete.js` combined with custom Lit Web Components to provide the rich drag-and-drop node editing canvas.
- **API & Webhooks Endpoints**: Exposes standard controllers and custom plubs (e.g. `/api/flows/...`) to receive webhooks and expose execution data.
- **Authentication**: Handles user sessions, registration, and UI permissions.
