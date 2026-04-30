defmodule FusionFlow.Nodes.Output do
  use FusionKit.Node

  alias FusionFlow.Flows

  definition do
    %{
      name: "Output",
      title: "Output",
      category: :flow_control,
      color: "bg-yellow-100 text-yellow-600",
      description: "Finishes the flow and stores the final execution context as a log entry.",
      icon: "hero-check-circle",
      inputs: [:exec],
      outputs: [],
      show: true,
      ui_fields: [
        %{
          type: :text,
          name: :status,
          label: "Final Status",
          default: "success"
        }
      ]
    }
  end

  @impl true
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
        {:ok, context, "exec"}

      {:error, _changeset} ->
        {:ok, context, "exec"}
    end
  end
end
