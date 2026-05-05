# FusionFlow Runtime

The `fusion_flow_runtime` application acts as the immediate execution environment for dynamic operations within workflows.

## Responsibilities

- **Code Evaluation**: Orchestrates and safely evaluates user-defined scripts (e.g., Python execution via external libraries, or native evaluations) from `Eval` nodes.
- **State Pipeline Management**: Maintains and merges context state as data propagates from one node step to the next.
- **Performance & Isolation**: Ensures complex or computationally heavy node logic runs efficiently and predictably during a workflow's lifecycle.
