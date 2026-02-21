defmodule FusionFlow.Nodes.Start do
  def definition do
    %{
      name: "Start",
      category: :flow_control,
      icon: "hero-play",
      inputs: [],
      outputs: ["exec"],
      show: true,
      ui_fields: [],
      default_code: """
      ui do
      end
      """
    }
  end

  def handler(context, _input) do
    {:ok, context}
  end
end
