defmodule FusionFlowCore.Repo.Migrations.CreateWorkspacesAndMembers do
  use Ecto.Migration

  def change do
    create table(:workspaces) do
      add :name, :string, null: false
      add :slug, :string, null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:workspaces, [:slug])

    create table(:workspace_members) do
      add :workspace_id, references(:workspaces, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :role, :string, null: false, default: "viewer"

      timestamps(type: :utc_datetime)
    end

    create unique_index(:workspace_members, [:workspace_id, :user_id])
    create index(:workspace_members, [:user_id])

    alter table(:flows) do
      add :workspace_id, references(:workspaces, on_delete: :nilify_all)
    end

    create index(:flows, [:workspace_id])

    alter table(:api_keys) do
      add :workspace_id, references(:workspaces, on_delete: :nilify_all)
    end

    create index(:api_keys, [:workspace_id])

    alter table(:executions) do
      add :workspace_id, references(:workspaces, on_delete: :nilify_all)
    end

    create index(:executions, [:workspace_id])
  end
end
