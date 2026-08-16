defmodule FusionFlowCore.Repo.Migrations.AddWorkspaceAndRoleToInvites do
  use Ecto.Migration

  def change do
    alter table(:invites) do
      add :workspace_id, references(:workspaces, on_delete: :delete_all)
      add :role, :string, default: "editor"
      add :email, :string
    end

    create index(:invites, [:workspace_id])
  end
end
