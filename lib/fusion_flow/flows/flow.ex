defmodule FusionFlow.Flows.Flow do
  use Ecto.Schema
  import Ecto.Changeset

  schema "flows" do
    field :name, :string
    field :nodes, {:array, :map}
    field :connections, {:array, :map}

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(flow, attrs) do
    flow
    |> cast(attrs, [:name, :nodes, :connections])
    |> validate_required([:name])
  end
end
