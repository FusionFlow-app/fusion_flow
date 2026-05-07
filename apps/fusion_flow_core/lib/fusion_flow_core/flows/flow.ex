defmodule FusionFlowCore.Flows.Flow do
  use Ecto.Schema
  import Ecto.Changeset

  alias FusionFlowCore.Accounts.User
  alias FusionFlowCore.Flows.GraphValidator

  schema "flows" do
    field :name, :string
    field :nodes, {:array, :map}
    field :connections, {:array, :map}

    belongs_to :user, User
    has_many :executions, FusionFlowCore.Executions.Execution

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(flow, attrs) do
    flow
    |> cast(attrs, [:name, :nodes, :connections, :user_id])
    |> validate_required([:name, :user_id])
    |> assoc_constraint(:user)
    |> validate_graph()
  end

  defp validate_graph(changeset) do
    nodes = get_field(changeset, :nodes) || []
    connections = get_field(changeset, :connections) || []

    case GraphValidator.validate(nodes, connections) do
      :ok -> changeset
      {:error, field, message} -> add_error(changeset, field, message)
    end
  end
end
