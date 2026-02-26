defmodule FusionFlow.Accounts.Invite do
  @moduledoc """
  Schema for user invite tokens. Invites expire after 7 days and can be used once.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @invite_validity_days 7

  schema "invites" do
    field :token, :string
    field :expires_at, :utc_datetime
    field :used_at, :utc_datetime

    belongs_to :invited_by_user, FusionFlow.Accounts.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:token, :expires_at, :used_at, :invited_by_user_id])
    |> validate_required([:token, :expires_at, :invited_by_user_id])
    |> unique_constraint(:token)
    |> foreign_key_constraint(:invited_by_user_id)
  end

  @doc "Returns the default validity in days for new invites."
  def invite_validity_days, do: @invite_validity_days

  def expired?(%__MODULE__{expires_at: expires_at}) when not is_nil(expires_at) do
    DateTime.compare(DateTime.utc_now(), expires_at) != :lt
  end

  def expired?(_), do: true

  def used?(%__MODULE__{used_at: used_at}), do: not is_nil(used_at)
  def used?(_), do: false

  def valid?(invite) do
    not expired?(invite) and not used?(invite)
  end
end
