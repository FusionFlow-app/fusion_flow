defmodule FusionFlow.Nodes.SplitInBatches do
  def definition do
    %{
      name: "SplitInBatches",
      category: :flow_control,
      description: "Splits a list input into smaller batches for downstream processing.",
      icon: "hero-arrows-pointing-out",
      inputs: [:exec],
      outputs: ["exec"],
      show: false,
      ui_fields: [
        %{
          type: :number,
          name: :batch_size,
          label: "Batch Size",
          default: "10"
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
