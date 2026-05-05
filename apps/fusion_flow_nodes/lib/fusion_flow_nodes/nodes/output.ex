defmodule FusionFlowNodes.Nodes.Output do
  use FusionKit.Node

  definition do
    %{
      name: "Output",
      title: "Output",
      category: :flow_control,
      color: "bg-yellow-100 text-yellow-600",
      description: "Finishes the flow and returns the final execution context.",
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
    {:ok, context, "exec"}
  end
end
