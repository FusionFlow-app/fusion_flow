defmodule FusionFlow.Nodes.Merge do
  def definition do
    %{
      name: "Merge",
      category: :flow_control,
      icon: "⭀",
      inputs: [:in1, :in2, :in3],
      outputs: ["exec"],
      ui_fields: [
        %{
          type: :select,
          name: :mode,
          label: "Merge Mode",
          options: [
            %{label: "Wait All", value: "wait_all"},
            %{label: "Any", value: "any"}
          ],
          default: "any"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            select :mode, ["wait_all", "any"], default: "any"
          end
          """
        }
      ]
    }
  end

  def handler(_context, _input) do
    {:ok, :merged}
  end
end
