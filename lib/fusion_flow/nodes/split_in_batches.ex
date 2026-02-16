defmodule FusionFlow.Nodes.SplitInBatches do
  def definition do
    %{
      name: "SplitInBatches",
      category: :flow_control,
      icon: "✂",
      inputs: [:exec],
      outputs: ["exec"],
      ui_fields: [
        %{
          type: :number,
          name: :batch_size,
          label: "Batch Size",
          default: "10"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            number :batch_size, label: "Batch Size", default: "10"
          end
          """
        }
      ]
    }
  end

  def handler(context, input) do
    batch_size = String.to_integer(context["batch_size"] || "10")
    input_list = input || []

    batches = Enum.chunk_every(input_list, batch_size)

    {:ok, batches}
  end
end
