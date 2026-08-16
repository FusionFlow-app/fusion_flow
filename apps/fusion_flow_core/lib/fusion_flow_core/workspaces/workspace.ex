defmodule FusionFlowCore.Workspaces.Workspace do
  use Ecto.Schema
  import Ecto.Changeset

  schema "workspaces" do
    field :name, :string
    field :slug, :string

    has_many :memberships, FusionFlowCore.Workspaces.Member
    has_many :users, through: [:memberships, :user]
    has_many :flows, FusionFlowCore.Flows.Flow
    has_many :api_keys, FusionFlowCore.ApiKeys.ApiKey
    has_many :executions, FusionFlowCore.Executions.Execution

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(workspace, attrs) do
    workspace
    |> cast(attrs, [:name, :slug])
    |> validate_required([:name, :slug])
    |> validate_length(:name, min: 2, max: 100)
    |> validate_format(:slug, ~r/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      message: "must be lowercase alphanumeric with hyphens"
    )
    |> validate_length(:slug, min: 3, max: 48)
    |> unique_constraint(:slug)
  end
end
