defmodule FusionFlowCore.Flows.Webhook do
  use Ecto.Schema
  import Ecto.Changeset

  alias FusionFlowCore.Flows.Flow

  schema "webhooks" do
    field :token, :string
    field :method, :string, default: "POST"
    field :path, :string
    belongs_to :flow, Flow

    timestamps(type: :utc_datetime)
  end

  def changeset(webhook, attrs) do
    webhook
    |> cast(attrs, [:token, :method, :path])
    |> validate_required([:token, :method])
    |> unique_constraint(:token)
  end
end
