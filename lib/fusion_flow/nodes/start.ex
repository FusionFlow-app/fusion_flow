defmodule FusionFlow.Nodes.Start do
  use FusionKit.Node

  definition do
    %{
      name: "Start",
      title: "Start",
      category: :flow_control,
      color: "bg-yellow-100 text-yellow-600",
      description: "Starts manual flow execution and passes the initial context forward.",
      icon: "hero-play",
      inputs: [],
      outputs: ["exec"],
      show: true,
      ui_fields: []
    }
  end

  @impl true
  def handler(context, _input) do
    {:ok, context, "exec"}
  end
end
