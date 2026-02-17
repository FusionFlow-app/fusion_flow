defmodule FusionFlow.Flows.ExecutionLog do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  schema "flow_execution_logs" do
    field :context, :map
    field :status, :string
    field :node_id, :string
    belongs_to :flow, FusionFlow.Flows.Flow

    timestamps()
  end

  @doc false
  def changeset(execution_log, attrs) do
    execution_log
    |> cast(attrs, [:flow_id, :context, :status, :node_id])
    |> validate_required([:context])
  end
end
