defmodule FusionFlowCore.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias FusionFlowCore.Repo

  alias FusionFlowCore.Accounts.{User, UserToken, UserNotifier, Invite}

  ## Database getters

  @doc """
  Gets a user by email.

  ## Examples

      iex> get_user_by_email("foo@example.com")
      %User{}

      iex> get_user_by_email("unknown@example.com")
      nil

  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Gets a user by email and password.

  ## Examples

      iex> get_user_by_email_and_password("foo@example.com", "correct_password")
      %User{}

      iex> get_user_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    user = Repo.get_by(User, email: email)
    if User.valid_password?(user, password), do: user
  end

  @doc """
  Gets a user by username/email and password.
  """
  def get_user_by_identifier_and_password(identifier, password)
      when is_binary(identifier) and is_binary(password) do
    user = Repo.one(from u in User, where: u.email == ^identifier or u.username == ^identifier)
    if User.valid_password?(user, password), do: user
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Lists all users, ordered by inserted_at descending.
  """
  def list_users do
    Repo.all(from u in User, order_by: [desc: u.inserted_at])
  end

  ## User registration

  @doc """
  Registers a user.

  ## Examples

      iex> register_user(%{field: value})
      {:ok, %User{}}

      iex> register_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_user(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> User.password_changeset(attrs)
    |> User.confirm_changeset()
    |> Repo.insert()
  end

  def register_user!(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> User.password_changeset(attrs)
    |> User.confirm_changeset()
    |> Repo.insert!()
  end

  @doc """
  Registers a new user and marks the invite as used in a single transaction.
  Ensures that if marking the invite fails, the user is not created (rollback).
  Returns `{:ok, user}` or `{:error, :invite_mark_failed}` or `{:error, changeset}`.
  """
  def register_user_with_invite(attrs, %Invite{} = invite) do
    Repo.transaction(fn ->
      case register_user(attrs) do
        {:ok, user} ->
          case mark_invite_used(invite) do
            {:ok, _updated_invite} ->
              user

            {:error, _changeset} ->
              Repo.rollback(:invite_mark_failed)
          end

        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end

  @doc """
  Returns whether at least one user is a system admin.
  Used to decide whether to show the setup page or normal login.
  """
  def has_system_admin? do
    import Ecto.Query
    Repo.exists?(from u in User, where: u.is_system_admin == true)
  end

  @doc """
  Registers the first user as system admin (used by the setup flow).
  """
  def register_system_admin(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> User.password_changeset(attrs)
    |> User.confirm_changeset()
    |> User.admin_changeset(%{is_system_admin: true})
    |> Repo.insert()
  end

  ## Settings

  @doc """
  Checks whether the user is in sudo mode.

  The user is in sudo mode when the last authentication was done no further
  than 20 minutes ago. The limit can be given as second argument in minutes.
  """
  def sudo_mode?(user, minutes \\ -120)

  def sudo_mode?(%User{authenticated_at: ts}, minutes) when is_struct(ts, DateTime) do
    DateTime.after?(ts, DateTime.utc_now() |> DateTime.add(minutes, :minute))
  end

  def sudo_mode?(_user, _minutes), do: false

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the user email.

  See `FusionFlowCore.Accounts.User.email_changeset/3` for a list of supported options.

  ## Examples

      iex> change_user_email(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user_email(user, attrs \\ %{}, opts \\ []) do
    User.email_changeset(user, attrs, opts)
  end

  @doc """
  Updates the user email using the given token.

  If the token matches, the user email is updated and the token is deleted.
  """
  def update_user_email(user, token) do
    context = "change:#{user.email}"

    Repo.transact(fn ->
      with {:ok, query} <- UserToken.verify_change_email_token_query(token, context),
           %UserToken{sent_to: email} <- Repo.one(query),
           {:ok, user} <- Repo.update(User.email_changeset(user, %{email: email})),
           {_count, _result} <-
             Repo.delete_all(from(UserToken, where: [user_id: ^user.id, context: ^context])) do
        {:ok, user}
      else
        _ -> {:error, :transaction_aborted}
      end
    end)
  end

  @doc """
  Updates the user email directly without confirmation.
  """
  def update_user_email_directly(user, attrs) do
    user
    |> User.email_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the user username.
  """
  def change_user_username(user, attrs \\ %{}, opts \\ []) do
    User.registration_changeset(user, attrs, opts)
  end

  @doc """
  Updates the user username.
  """
  def update_user_username(user, attrs) do
    user
    |> User.registration_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates user attributes allowed only for admins (e.g. is_system_admin).

  ## Example

      iex> update_user(user, %{is_system_admin: true})
      {:ok, %User{}}
  """
  def update_user(user, attrs) do
    user
    |> User.admin_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the user password.

  See `FusionFlowCore.Accounts.User.password_changeset/3` for a list of supported options.

  ## Examples

      iex> change_user_password(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user_password(user, attrs \\ %{}, opts \\ []) do
    User.password_changeset(user, attrs, opts)
  end

  @doc """
  Updates the user password.

  Returns a tuple with the updated user, as well as a list of expired tokens.

  ## Examples

      iex> update_user_password(user, %{password: ...})
      {:ok, {%User{}, [...]}}

      iex> update_user_password(user, %{password: "too short"})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_password(user, attrs) do
    user
    |> User.password_changeset(attrs)
    |> update_user_and_delete_all_tokens()
  end

  ## Session

  @doc """
  Generates a session token.
  """
  def generate_user_session_token(user) do
    {token, user_token} = UserToken.build_session_token(user)
    Repo.insert!(user_token)
    token
  end

  @doc """
  Gets the user with the given signed token.

  If the token is valid `{user, token_inserted_at}` is returned, otherwise `nil` is returned.
  """
  def get_user_by_session_token(token) do
    {:ok, query} = UserToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Gets the user with the given magic link token.
  """
  def get_user_by_magic_link_token(token) do
    with {:ok, query} <- UserToken.verify_magic_link_token_query(token),
         {user, _token} <- Repo.one(query) do
      user
    else
      _ -> nil
    end
  end

  @doc """
  Logs the user in by magic link.

  There are three cases to consider:

  1. The user has already confirmed their email. They are logged in
     and the magic link is expired.

  2. The user has not confirmed their email and no password is set.
     In this case, the user gets confirmed, logged in, and all tokens -
     including session ones - are expired. In theory, no other tokens
     exist but we delete all of them for best security practices.

  3. The user has not confirmed their email but a password is set.
     This cannot happen in the default implementation but may be the
     source of security pitfalls. See the "Mixing magic link and password registration" section of
     `mix help phx.gen.auth`.
  """
  def login_user_by_magic_link(token) do
    {:ok, query} = UserToken.verify_magic_link_token_query(token)

    case Repo.one(query) do
      # Prevent session fixation attacks by disallowing magic links for unconfirmed users with password
      {%User{confirmed_at: nil, hashed_password: hash}, _token} when not is_nil(hash) ->
        raise """
        magic link log in is not allowed for unconfirmed users with a password set!

        This cannot happen with the default implementation, which indicates that you
        might have adapted the code to a different use case. Please make sure to read the
        "Mixing magic link and password registration" section of `mix help phx.gen.auth`.
        """

      {%User{confirmed_at: nil} = user, _token} ->
        user
        |> User.confirm_changeset()
        |> update_user_and_delete_all_tokens()

      {user, token} ->
        Repo.delete!(token)
        {:ok, {user, []}}

      nil ->
        {:error, :not_found}
    end
  end

  @doc ~S"""
  Delivers the update email instructions to the given user.

  ## Examples

      iex> deliver_user_update_email_instructions(user, current_email, &url(~p"/users/settings/confirm-email/#{&1}"))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_user_update_email_instructions(%User{} = user, current_email, update_email_url_fun)
      when is_function(update_email_url_fun, 1) do
    {encoded_token, user_token} = UserToken.build_email_token(user, "change:#{current_email}")

    Repo.insert!(user_token)
    UserNotifier.deliver_update_email_instructions(user, update_email_url_fun.(encoded_token))
  end

  @doc """
  Delivers the magic link login instructions to the given user.
  """
  def deliver_login_instructions(%User{} = user, magic_link_url_fun)
      when is_function(magic_link_url_fun, 1) do
    {encoded_token, user_token} = UserToken.build_email_token(user, "login")
    Repo.insert!(user_token)
    UserNotifier.deliver_login_instructions(user, magic_link_url_fun.(encoded_token))
  end

  @doc """
  Deletes the signed token with the given context.
  """
  def delete_user_session_token(token) do
    Repo.delete_all(from(UserToken, where: [token: ^token, context: "session"]))
    :ok
  end

  ## Invites

  @doc """
  Returns an existing valid invite for the given admin user, or creates a new one.
  Only one unused, non-expired invite per admin is kept; reusing it avoids creating duplicates.
  """
  def create_invite_or_reuse(%User{id: user_id} = admin) do
    unless User.system_admin?(admin) do
      {:error, :forbidden}
    else
      now = DateTime.utc_now()
      validity_days = Invite.invite_validity_days()
      expires_at = DateTime.add(now, validity_days, :day)

      existing =
        Repo.one(
          from i in Invite,
            where: i.invited_by_user_id == ^user_id,
            where: is_nil(i.used_at),
            where: i.expires_at > ^now,
            order_by: [desc: i.inserted_at],
            limit: 1
        )

      if existing do
        {:ok, Repo.preload(existing, :invited_by_user)}
      else
        token = generate_invite_token()

        %Invite{}
        |> Invite.changeset(%{
          token: token,
          expires_at: expires_at,
          invited_by_user_id: user_id
        })
        |> Repo.insert()
        |> case do
          {:ok, invite} -> {:ok, Repo.preload(invite, :invited_by_user)}
          err -> err
        end
      end
    end
  end

  defp generate_invite_token do
    32
    |> :crypto.strong_rand_bytes()
    |> Base.url_encode64(padding: false)
  end

  @doc """
  Gets an invite by token. Returns nil if not found.
  """
  def get_invite_by_token(token) when is_binary(token) do
    Repo.get_by(Invite, token: token) |> Repo.preload(:invited_by_user)
  end

  @doc """
  Marks an invite as used (sets used_at to now).
  Returns {:ok, invite} or {:error, changeset}.
  """
  def mark_invite_used(%Invite{} = invite) do
    invite
    |> Invite.changeset(%{used_at: DateTime.utc_now()})
    |> Repo.update()
  end

  @doc """
  Lists invites created by the given admin user, most recent first.
  """
  def list_invites_by_admin(%User{id: user_id}) do
    Repo.all(
      from i in Invite,
        where: i.invited_by_user_id == ^user_id,
        order_by: [desc: i.inserted_at],
        preload: [:invited_by_user]
    )
  end

  ## Token helper

  defp update_user_and_delete_all_tokens(changeset) do
    Repo.transact(fn ->
      with {:ok, user} <- Repo.update(changeset) do
        tokens_to_expire = Repo.all_by(UserToken, user_id: user.id)

        Repo.delete_all(from(t in UserToken, where: t.id in ^Enum.map(tokens_to_expire, & &1.id)))

        {:ok, {user, tokens_to_expire}}
      end
    end)
  end
end
