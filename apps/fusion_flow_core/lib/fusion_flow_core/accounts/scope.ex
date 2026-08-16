defmodule FusionFlowCore.Accounts.Scope do
  @moduledoc """
  Defines the scope of the caller to be used throughout the app.

  The `FusionFlowCore.Accounts.Scope` carries identity, workspace context,
  and derived permissions for authorization and multi-tenancy.
  """

  alias FusionFlowCore.Accounts.User
  alias FusionFlowCore.ApiKeys.ApiKey
  alias FusionFlowCore.Policy

  defstruct user: nil,
            workspace: nil,
            member: nil,
            role: nil,
            api_key: nil,
            api_scopes: [],
            permissions: MapSet.new(),
            is_system_admin: false

  @doc """
  Creates a scope for the given user.

  Returns nil if no user is given.
  """
  def for_user(%User{is_system_admin: is_admin} = user) do
    %__MODULE__{
      user: user,
      is_system_admin: is_admin,
      permissions: if(is_admin, do: Policy.all_permissions(), else: MapSet.new())
    }
  end

  def for_user(nil), do: nil

  @doc """
  Creates a scope for an authenticated user within a specific workspace membership.
  """
  def for_membership(%User{is_system_admin: is_admin} = user, workspace, member) do
    role_atom =
      cond do
        is_atom(member.role) ->
          member.role

        is_binary(member.role) ->
          try do
            String.to_existing_atom(member.role)
          rescue
            ArgumentError -> :viewer
          end

        true ->
          :viewer
      end

    permissions =
      if is_admin do
        Policy.all_permissions()
      else
        Policy.permissions_for(role_atom)
      end

    %__MODULE__{
      user: user,
      workspace: workspace,
      member: member,
      role: role_atom,
      is_system_admin: is_admin,
      permissions: permissions
    }
  end

  @doc """
  Creates a scope for an API key.
  """
  def for_api_key(%ApiKey{user: %User{} = user} = api_key) do
    workspace =
      case Map.get(api_key, :workspace) do
        %FusionFlowCore.Workspaces.Workspace{} = ws -> ws
        _ -> nil
      end

    scopes = api_key.scopes || []

    %__MODULE__{
      user: user,
      workspace: workspace,
      api_key: api_key,
      api_scopes: scopes,
      role: :api_token,
      permissions: Policy.permissions_for_api_scopes(scopes),
      is_system_admin: false
    }
  end
end
