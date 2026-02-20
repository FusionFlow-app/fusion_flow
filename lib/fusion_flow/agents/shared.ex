defmodule FusionFlow.Agents.Shared do
  alias FusionFlow.Nodes.Registry

  def nodes_description do
    Registry.all_nodes()
    |> Enum.map(fn node ->
      """
      - Type: #{node.name}
        Category: #{node.category}
        Inputs: #{inspect(node[:inputs] || [])}
        Outputs: #{inspect(node[:outputs] || [])}
        Description: A node to perform #{node.name} operations.
      """
    end)
    |> Enum.join("\n")
  end

  def current_flow_description(nil), do: ""

  def current_flow_description(current_flow) do
    """
    **CURRENT FLOW STATE:**
    Nodes: #{Jason.encode!(current_flow.nodes || [])}
    Connections: #{Jason.encode!(current_flow.connections || [])}

    Use this state as the baseline for any modifications. If the user asks to "add" or "change" something, you must generate the FULL new flow JSON including existing nodes/connections plus your changes.
    """
  end

  def flow_generation_rules do
    """
    **JSON OUTPUT FORMAT FOR FLOW CREATION:**

    The JSON structure must be:

    {
      "action": "create_flow",
      "nodes": [
        {
          "id": "unique_id_1",
          "type": "Node Name (must match exactly from Available Nodes)",
          "label": "Custom Label",
          "controls": {
             "code_elixir": "...",
             "code_python": "...",
             "language": "elixir"
          },
          "position": { "x": 100, "y": 100 },
          "inputs": {},
          "outputs": {}
        },
        ...
      ],
      "connections": [
        {
          "source": "unique_id_1",
          "sourceOutput": "output_name",
          "target": "unique_id_2",
          "targetInput": "input_name"
        },
        ...
      ]
    }

    **IMPORTANT RULES FOR FLOW GENERATION:**
    -   **PREFER MODIFYING EXISTING NODES** over creating new ones if the request is a simple logic change.
    -   **CRITICAL: Use "type" instead of "name"** for the node type.
    -   **CRITICAL: Controls for "Evaluate Code"**: Must include `code_elixir`, `code_python`, and `language`.
    -   **CRITICAL: Controls for "Output"**: Must include `status` and `code`.
    -   **Variable Usage in Eval Nodes**:
        -   The input to the node is available as `input`.
        -   The result of the previous node is available directly as `result`.
        -   Use `variable(:atom_name)` to access other context variables.
        -   **CRITICAL:** Do NOT assign to `result`. Just write the expression.
    -   Use unique string IDs for nodes.
    -   Ensure `sourceOutput` and `targetInput` match the defined inputs/outputs.
    -   **CRITICAL:** Position nodes using a `position` object with `x` and `y`.
    -   **CRITICAL:** Space nodes FAR APART (x increment >= 400).
    -   **CRITICAL:** ALWAYS start the flow with a `Start` node and end with an `Output` node.
    """
  end

  def example_json do
    """
    **EXAMPLE:**
    User: "Create a flow that adds 5 + 5 and then adds 10."
    Assistant:
    {
      "action": "create_flow",
      "nodes": [
        {
          "id": "node_1",
          "type": "Start",
          "label": "Start",
          "controls": {},
          "position": { "x": 100, "y": 100 },
          "inputs": {},
          "outputs": {}
        },
        {
          "id": "node_2",
          "type": "Evaluate Code",
          "label": "Add 5 + 5",
          "controls": { "code_elixir": "5 + 5", "language": "elixir", "code_python": "" },
          "position": { "x": 500, "y": 100 },
          "inputs": {},
          "outputs": {}
        },
        {
          "id": "node_3",
          "type": "Evaluate Code",
          "label": "Add 10 more",
          "controls": { "code_elixir": "result + 10", "language": "elixir", "code_python": "" },
          "position": { "x": 900, "y": 100 },
          "inputs": {},
          "outputs": {}
        },
        {
          "id": "node_4",
          "type": "Output",
          "label": "Result",
          "controls": { "status": "success", "code": "ui do\\n  text :status, label: \\"Final Status\\", default: \\"success\\"\\nend\\n" },
          "position": { "x": 1300, "y": 100 },
          "inputs": {},
          "outputs": {}
        }
      ],
      "connections": [
        {
          "source": "node_1",
          "sourceOutput": "exec",
          "target": "node_2",
          "targetInput": "exec"
        },
        {
          "source": "node_2",
          "sourceOutput": "exec",
          "target": "node_3",
          "targetInput": "exec"
        },
        {
          "source": "node_3",
          "sourceOutput": "exec",
          "target": "node_4",
          "targetInput": "exec"
        }
      ]
    }
    """
  end
end
