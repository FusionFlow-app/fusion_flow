defmodule FusionFlowCore.Repo.Migrations.CreateInvites do
  use Ecto.Migration

  def change do
    create table(:invites) do
      add :token, :string, null: false
      add :expires_at, :utc_datetime, null: false
      add :used_at, :utc_datetime
      add :invited_by_user_id, references(:users, on_delete: :nilify_all), null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:invites, [:token])
    create index(:invites, [:invited_by_user_id])
    create index(:invites, [:expires_at, :used_at])
  end
end
