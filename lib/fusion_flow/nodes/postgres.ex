defmodule FusionFlow.Nodes.Postgres do
  def definition do
    %{
      name: "Postgres",
      category: :integration,
      icon: "🐘",
      inputs: [:exec],
      outputs: ["success", "error"],
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
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            textarea :query, label: "SQL Query", default: "SELECT * FROM users WHERE id = $1"
            json :params, label: "Parameters", default: "[1]"
          end
          """
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
