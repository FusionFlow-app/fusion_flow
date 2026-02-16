defmodule FusionFlow.Dependencies.Dependency do
  use Ecto.Schema
  import Ecto.Changeset

  schema "dependencies" do
    field :name, :string
    field :version, :string
    field :language, :string

    timestamps()
  end

  @doc false
  def changeset(dependency, attrs) do
    dependency
    |> cast(attrs, [:name, :version, :language])
    |> validate_required([:name, :version, :language])
    |> unique_constraint([:name, :language])
  end
end
