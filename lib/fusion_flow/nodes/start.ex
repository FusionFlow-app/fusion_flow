defmodule FusionFlow.Nodes.Start do
  def definition do
    %{
      name: "Start",
      category: :flow_control,
      icon: "hero-play",
      inputs: [],
      outputs: ["exec"],
      show: true,
      ui_fields: []
    }
  end

  def handler(context, _input) do
    {:ok, context}
  end
end
