defmodule FusionFlow.Nodes.Postgres do
  def definition do
    %{
      name: "Postgres",
      category: :integration,
      description: "Runs a parameterized SQL query against a PostgreSQL database.",
      icon: "hero-circle-stack",
      inputs: [:exec],
      outputs: ["success", "error"],
      show: false,
      ui_fields: [
        %{
          type: :code,
          name: :query,
          label: "SQL Query",
          language: "sql",
          default: "SELECT * FROM users WHERE id = $1"
        },
        %{
          type: :json,
          name: :params,
          label: "Parameters (JSON)",
          default: "[1]"
        }
      ]
    }
  end

  def handler(context, _input) do
    _query = context["query"]
    _params = Jason.decode!(context["params"] || "[]")

    {:ok, :simulated_result}
  end
end
