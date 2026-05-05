# FusionFlow Nodes

The `fusion_flow_nodes` application defines the behavior, structure, and validation logic for individual flow nodes.

## Responsibilities

- **Node Definitions**: Implements the logic and state structures for available nodes such as `Start`, `Condition`, `Eval`, `HttpRequest`, `Logger`, `Output`, `Variable`, and `Webhook`.
- **Flow Traversal**: Handles parsing the node connections and structuring the execution graph.
- **Extensibility**: Acts as the modular boundary for developing and registering new visual nodes into the system.
