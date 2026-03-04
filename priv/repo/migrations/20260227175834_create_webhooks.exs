defmodule FusionFlow.Repo.Migrations.CreateWebhooks do
  use Ecto.Migration

  def change do
    create table(:webhooks) do
      add :token, :string, null: false
      add :method, :string, null: false, default: "POST"
      add :path, :string
      add :flow_id, references(:flows, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:webhooks, [:token])
    create index(:webhooks, [:flow_id])
  end
end
