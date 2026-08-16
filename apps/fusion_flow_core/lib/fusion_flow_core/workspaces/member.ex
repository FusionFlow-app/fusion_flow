defmodule FusionFlowCore.Workspaces.Member do
  use Ecto.Schema
  import Ecto.Changeset

  @roles ~w(owner admin editor viewer)

  schema "workspace_members" do
    field :role, :string, default: "viewer"

    belongs_to :workspace, FusionFlowCore.Workspaces.Workspace
    belongs_to :user, FusionFlowCore.Accounts.User

    timestamps(type: :utc_datetime)
  end

  def roles, do: @roles

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:role, :workspace_id, :user_id])
    |> validate_required([:role, :workspace_id, :user_id])
    |> validate_inclusion(:role, @roles)
    |> foreign_key_constraint(:workspace_id)
    |> foreign_key_constraint(:user_id)
    |> unique_constraint([:workspace_id, :user_id],
      name: :workspace_members_workspace_id_user_id_index
    )
  end
end
