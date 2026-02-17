defmodule FusionFlow.Nodes.Output do
  alias FusionFlow.Flows

  def definition do
    %{
      name: "Output",
      category: :flow_control,
      icon: "🏁",
      inputs: [:exec],
      outputs: [],
      ui_fields: [
        %{
          type: :text,
          name: :status,
          label: "Final Status",
          default: "success"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            text :status, label: "Final Status", default: "success"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    flow_id = context["flow_id"]
    status = context["status"] || "success"

    log_context = Map.drop(context, ["flow_id", "status"])

    case Flows.create_execution_log(%{
           flow_id: flow_id,
           context: log_context,
           status: status,
           node_id: "Output"
         }) do
      {:ok, _log} ->
        IO.puts("Execução finalizada e log salva no Postgres.")
        {:ok, context}

      {:error, changeset} ->
        IO.inspect(changeset, label: "Erro ao salvar log")
        {:error, "Failed to save execution log"}
    end
  end
end
