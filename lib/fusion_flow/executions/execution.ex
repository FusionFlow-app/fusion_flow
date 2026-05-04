defmodule FusionFlow.Executions.Execution do
  use Ecto.Schema
  import Ecto.Changeset

  alias FusionFlow.Flows.Flow

  @primary_key {:id, :binary_id, autogenerate: true}
  @statuses ~w(queued running succeeded failed)

  schema "executions" do
    field :public_id, :string
    field :status, :string, default: "queued"
    field :input, :map, default: %{}
    field :result, :map
    field :error, :map
    field :logs, {:array, :map}, default: []
    field :started_at, :utc_datetime
    field :finished_at, :utc_datetime

    belongs_to :flow, Flow

    timestamps(type: :utc_datetime)
  end

  def statuses, do: @statuses

  @doc false
  def changeset(execution, attrs) do
    execution
    |> cast(attrs, [
      :public_id,
      :flow_id,
      :status,
      :input,
      :result,
      :error,
      :logs,
      :started_at,
      :finished_at
    ])
    |> validate_required([:public_id, :flow_id, :status, :input, :logs])
    |> validate_format(:public_id, ~r/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    |> validate_inclusion(:status, @statuses)
    |> assoc_constraint(:flow)
    |> check_constraint(:status, name: :executions_status_check)
    |> unique_constraint(:public_id)
  end
end
