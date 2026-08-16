defmodule FusionFlowCore.Workspaces do
  @moduledoc """
  Context module for managing Workspaces, Memberships, and Multi-Tenancy resolution.
  """

  import Ecto.Query, warn: false
  alias FusionFlowCore.{Policy, Repo}
  alias FusionFlowCore.Accounts.{Scope, User}
  alias FusionFlowCore.Workspaces.{Member, Workspace}

  @doc """
  Creates a workspace and assigns the creator as the initial Owner.
  """
  def create_workspace(%User{id: user_id}, attrs) do
    attrs = Map.new(attrs)

    Repo.transaction(fn ->
      workspace =
        case %Workspace{} |> Workspace.changeset(attrs) |> Repo.insert() do
          {:ok, ws} -> ws
          {:error, cs} -> Repo.rollback(cs)
        end

      member =
        case %Member{}
             |> Member.changeset(%{
               workspace_id: workspace.id,
               user_id: user_id,
               role: "owner"
             })
             |> Repo.insert() do
          {:ok, m} -> m
          {:error, cs} -> Repo.rollback(cs)
        end

      %{workspace: workspace, member: member}
    end)
  end

  @doc """
  Gets a workspace by ID. Returns nil if not found.
  """
  def get_workspace(id) when is_binary(id) or is_integer(id) do
    Repo.get(Workspace, id)
  end

  def get_workspace(_), do: nil

  @doc """
  Gets a workspace by ID. Raises Ecto.NoResultsError if not found.
  """
  def get_workspace!(id), do: Repo.get!(Workspace, id)

  @doc """
  Gets a workspace by slug.
  """
  def get_workspace_by_slug(slug) when is_binary(slug) do
    Repo.get_by(Workspace, slug: slug)
  end

  @doc """
  Updates a workspace. Requires `:manage_workspace` permission.
  """
  def update_workspace(%Scope{workspace: ws} = scope, attrs) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :manage_workspace) do
      ws
      |> Workspace.changeset(attrs)
      |> Repo.update()
    end
  end

  @doc """
  Deletes a workspace. Requires `:delete_workspace` permission.
  """
  def delete_workspace(%Scope{workspace: ws} = scope) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :delete_workspace) do
      Repo.delete(ws)
    end
  end

  @doc """
  Fetches a workspace and the user's membership atomically.
  Returns `{:error, :not_found}` if either is missing to prevent workspace existence enumeration.
  """
  def fetch_member_workspace(%User{id: user_id, is_system_admin: true}, slug) do
    case Repo.get_by(Workspace, slug: slug) do
      nil ->
        {:error, :not_found}

      workspace ->
        member =
          Repo.get_by(Member, workspace_id: workspace.id, user_id: user_id) ||
            %Member{workspace_id: workspace.id, user_id: user_id, role: "owner"}

        {:ok, %{workspace: workspace, member: member}}
    end
  end

  def fetch_member_workspace(%User{id: user_id}, slug) do
    query =
      from w in Workspace,
        join: m in Member,
        on: m.workspace_id == w.id and m.user_id == ^user_id,
        where: w.slug == ^slug,
        select: {w, m}

    case Repo.one(query) do
      {workspace, member} ->
        {:ok, %{workspace: workspace, member: member}}

      nil ->
        {:error, :not_found}
    end
  end

  def fetch_member_workspace(nil, _slug), do: {:error, :not_found}

  @doc """
  Lists all workspaces a user is a member of.
  """
  def list_workspaces_for_user(%User{is_system_admin: true}) do
    Repo.all(from w in Workspace, order_by: [asc: w.name])
  end

  def list_workspaces_for_user(%User{id: user_id}) do
    query =
      from w in Workspace,
        join: m in Member,
        on: m.workspace_id == w.id,
        where: m.user_id == ^user_id,
        order_by: [asc: w.name]

    Repo.all(query)
  end

  @doc """
  Lists members of the current workspace. Requires `:view_members` permission.
  """
  def list_members(%Scope{workspace: ws} = scope) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :view_members) do
      query =
        from m in Member,
          where: m.workspace_id == ^ws.id,
          preload: [:user],
          order_by: [asc: m.inserted_at]

      {:ok, Repo.all(query)}
    end
  end

  @doc """
  Adds a member to the workspace. Requires `:manage_members` or `:invite_members` permission.
  """
  def add_member(%Scope{workspace: ws} = scope, %User{id: user_id}, role) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :manage_members) do
      %Member{}
      |> Member.changeset(%{
        workspace_id: ws.id,
        user_id: user_id,
        role: to_string(role)
      })
      |> Repo.insert()
    end
  end

  @doc """
  Updates a member's role. Protects against demoting the last owner.
  """
  def update_member_role(
        %Scope{workspace: ws} = scope,
        %Member{workspace_id: ws_id} = member,
        new_role
      )
      when not is_nil(ws) and ws.id == ws_id do
    with :ok <- Policy.authorize(scope, :manage_members),
         :ok <- validate_not_last_owner_demotion(member, new_role) do
      member
      |> Member.changeset(%{role: to_string(new_role)})
      |> Repo.update()
    end
  end

  @doc """
  Removes a member from the workspace. Protects against removing the last owner.
  """
  def remove_member(%Scope{workspace: ws} = scope, %Member{workspace_id: ws_id} = member)
      when not is_nil(ws) and ws.id == ws_id do
    with :ok <- Policy.authorize(scope, :manage_members),
         :ok <- validate_not_last_owner_removal(member) do
      Repo.delete(member)
    end
  end

  @doc """
  Ensures a user has at least one default workspace. If none exist, one is created.
  """
  def ensure_default_workspace(%User{id: user_id, username: username} = user) do
    query =
      from w in Workspace,
        join: m in Member,
        on: m.workspace_id == w.id,
        where: m.user_id == ^user_id,
        order_by: [asc: w.inserted_at]

    case Repo.all(query) do
      [first | _] ->
        member = Repo.get_by(Member, workspace_id: first.id, user_id: user_id)
        {:ok, %{workspace: first, member: member}}

      [] ->
        clean_username =
          username
          |> to_string()
          |> String.downcase()
          |> String.replace(~r/[^a-z0-9]/, "-")
          |> String.trim("-")

        slug_base = if clean_username == "", do: "workspace-#{user_id}", else: clean_username
        slug = find_available_slug(slug_base)

        create_workspace(user, %{
          name: "#{username}'s Workspace",
          slug: slug
        })
    end
  end

  defp find_available_slug(slug) do
    case get_workspace_by_slug(slug) do
      nil -> slug
      _ -> "#{slug}-#{System.unique_integer([:positive])}"
    end
  end

  defp validate_not_last_owner_demotion(%Member{role: "owner", workspace_id: ws_id}, new_role)
       when new_role not in ["owner", :owner] do
    count = count_owners(ws_id)
    if count <= 1, do: {:error, :cannot_remove_last_owner}, else: :ok
  end

  defp validate_not_last_owner_demotion(_member, _new_role), do: :ok

  defp validate_not_last_owner_removal(%Member{role: "owner", workspace_id: ws_id}) do
    count = count_owners(ws_id)
    if count <= 1, do: {:error, :cannot_remove_last_owner}, else: :ok
  end

  defp validate_not_last_owner_removal(_member), do: :ok

  defp count_owners(workspace_id) do
    Repo.one(
      from m in Member,
        where: m.workspace_id == ^workspace_id and m.role == "owner",
        select: count(m.id)
    )
  end
end
