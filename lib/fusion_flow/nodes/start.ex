defmodule FusionFlow.Nodes.Start do
  def definition do
    %{
      name: "Start",
      category: :flow_control,
      icon: "▶",
      inputs: [],
      outputs: ["exec"],
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
