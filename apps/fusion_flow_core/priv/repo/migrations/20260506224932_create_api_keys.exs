defmodule FusionFlowCore.Repo.Migrations.CreateApiKeys do
  use Ecto.Migration

  def change do
    create table(:api_keys) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :name, :string, null: false
      add :prefix, :string, null: false
      add :key_hash, :binary, null: false
      add :scopes, {:array, :string}, null: false, default: []
      add :last_used_at, :utc_datetime
      add :expires_at, :utc_datetime
      add :revoked_at, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create index(:api_keys, [:user_id])
    create unique_index(:api_keys, [:prefix])
  end
end
