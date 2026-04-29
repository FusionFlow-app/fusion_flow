defmodule FusionFlow.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `FusionFlow.Accounts` context.
  """

  import Ecto.Query

  alias FusionFlow.Accounts
  alias FusionFlow.Accounts.Scope

  def unique_user_username, do: "user#{System.unique_integer([:positive])}"
  def unique_user_email, do: "user#{System.unique_integer()}@example.com"
  def valid_user_password, do: "hello world!"

  def valid_user_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      email: unique_user_email(),
      username: unique_user_username(),
      password: valid_user_password()
    })
  end

  def unconfirmed_user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> valid_user_attributes()
      |> Accounts.register_user()

    user
  end

  def user_fixture(attrs \\ %{}) do
    user = unconfirmed_user_fixture(attrs)

    token =
      extract_user_token(fn url ->
        Accounts.deliver_login_instructions(user, url)
      end)

    {:ok, {user, _expired_tokens}} =
      Accounts.login_user_by_magic_link(token)

    user
  end

  @doc """
  Creates a user with is_system_admin: true.
  Use in tests that need a system admin to exist (e.g. to avoid redirect to /setup).
  """
  def system_admin_fixture(attrs \\ %{}) do
    user = user_fixture(attrs)
    {:ok, admin} = Accounts.update_user(user, %{is_system_admin: true})
    admin
  end

  def user_scope_fixture do
    user = user_fixture()
    user_scope_fixture(user)
  end

  def user_scope_fixture(user) do
    Scope.for_user(user)
  end

  def set_password(user) do
    {:ok, {user, _expired_tokens}} =
      Accounts.update_user_password(user, %{password: valid_user_password()})

    user
  end

  def extract_user_token(fun) do
    {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")

    [_, token | _] =
      String.split(Map.get(captured_email, :text_body, captured_email.body), "[TOKEN]")

    token
  end

  def override_token_authenticated_at(token, authenticated_at) when is_binary(token) do
    FusionFlow.Repo.update_all(
      from(t in Accounts.UserToken,
        where: t.token == ^token
      ),
      set: [authenticated_at: authenticated_at]
    )
  end

  def generate_user_magic_link_token(user) do
    {encoded_token, user_token} = Accounts.UserToken.build_email_token(user, "login")
    FusionFlow.Repo.insert!(user_token)
    {encoded_token, user_token.token}
  end

  def offset_user_token(token, amount_to_add, unit) do
    dt = DateTime.add(DateTime.utc_now(:second), amount_to_add, unit)

    FusionFlow.Repo.update_all(
      from(ut in Accounts.UserToken, where: ut.token == ^token),
      set: [inserted_at: dt, authenticated_at: dt]
    )
  end

  @doc """
  Creates an invite for the given admin user (or a new system admin if not given).
  Accepts a map or keyword list of attrs: invited_by_user, token, expires_at, used_at.
  """
  def invite_fixture(attrs \\ %{}) do
    attrs = Enum.into(attrs, %{})
    admin = attrs[:invited_by_user] || attrs["invited_by_user"] || system_admin_fixture()

    token =
      attrs[:token] || attrs["token"] ||
        Base.url_encode64(:crypto.strong_rand_bytes(32), padding: false)

    expires_at =
      attrs[:expires_at] || attrs["expires_at"] || DateTime.add(DateTime.utc_now(), 7, :day)

    used_at = attrs[:used_at] || attrs["used_at"]

    base = %{
      token: token,
      expires_at: expires_at,
      invited_by_user_id: admin.id
    }

    base = if used_at, do: Map.put(base, :used_at, used_at), else: base

    %FusionFlow.Accounts.Invite{}
    |> FusionFlow.Accounts.Invite.changeset(base)
    |> FusionFlow.Repo.insert!()
  end
end
