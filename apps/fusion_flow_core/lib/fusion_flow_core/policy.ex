defmodule FusionFlowCore.Policy do
  @moduledoc """
  Central authorization module for FusionFlow. Defines the role-permission matrix
  and evaluates permissions against a `%FusionFlowCore.Accounts.Scope{}`.
  """

  alias FusionFlowCore.Accounts.Scope

  @viewer_permissions MapSet.new([
                        :view_workspace,
                        :view_members,
                        :view_flows,
                        :view_executions,
                        :view_deps
                      ])

  @editor_permissions MapSet.union(
                        @viewer_permissions,
                        MapSet.new([
                          :create_flows,
                          :edit_flows,
                          :execute_flows,
                          :cancel_executions,
                          :manage_deps
                        ])
                      )

  @admin_permissions MapSet.union(
                       @editor_permissions,
                       MapSet.new([
                         :delete_flows,
                         :invite_members,
                         :manage_members,
                         :view_api_keys,
                         :manage_api_keys,
                         :manage_workspace
                       ])
                     )

  @owner_permissions MapSet.union(
                       @admin_permissions,
                       MapSet.new([
                         :transfer_ownership,
                         :delete_workspace
                       ])
                     )

  @all_permissions @owner_permissions

  @doc "Returns all permissions registered in the system."
  def all_permissions, do: @all_permissions

  @doc "Returns the MapSet of permissions for a given workspace role."
  @spec permissions_for(atom() | String.t()) :: MapSet.t(atom())
  def permissions_for(:owner), do: @owner_permissions
  def permissions_for(:admin), do: @admin_permissions
  def permissions_for(:editor), do: @editor_permissions
  def permissions_for(:viewer), do: @viewer_permissions

  def permissions_for(role) when is_binary(role) do
    case role do
      "owner" -> @owner_permissions
      "admin" -> @admin_permissions
      "editor" -> @editor_permissions
      "viewer" -> @viewer_permissions
      _ -> MapSet.new()
    end
  end

  def permissions_for(_), do: MapSet.new()

  @doc "Maps API token scope strings to permission atoms."
  @spec permissions_for_api_scopes(list(String.t())) :: MapSet.t(atom())
  def permissions_for_api_scopes(scopes) when is_list(scopes) do
    Enum.reduce(scopes, MapSet.new(), fn
      "workflows:read", acc ->
        MapSet.put(acc, :view_flows)

      "flows:read", acc ->
        MapSet.put(acc, :view_flows)

      "workflows:write", acc ->
        acc |> MapSet.put(:create_flows) |> MapSet.put(:edit_flows) |> MapSet.put(:delete_flows)

      "flows:write", acc ->
        acc |> MapSet.put(:create_flows) |> MapSet.put(:edit_flows) |> MapSet.put(:delete_flows)

      "executions:read", acc ->
        MapSet.put(acc, :view_executions)

      "executions:write", acc ->
        MapSet.put(acc, :execute_flows)

      "nodes:read", acc ->
        MapSet.put(acc, :view_flows)

      _, acc ->
        acc
    end)
  end

  def permissions_for_api_scopes(_), do: MapSet.new()

  @doc """
  Evaluates whether the given Scope holds the specified permission.
  Platform administrators with `is_system_admin: true` always evaluate to `true`.
  """
  @spec can?(Scope.t() | nil, atom()) :: boolean()
  def can?(nil, _permission), do: false
  def can?(%Scope{is_system_admin: true}, _permission), do: true

  def can?(%Scope{permissions: permissions}, permission) when is_struct(permissions, MapSet) do
    MapSet.member?(permissions, permission)
  end

  def can?(%Scope{}, _permission), do: false

  @doc """
  Authorizes an action, returning `:ok` or `{:error, :unauthorized}` for `with` pipelines.
  """
  @spec authorize(Scope.t() | nil, atom()) :: :ok | {:error, :unauthorized}
  def authorize(scope, permission) do
    if can?(scope, permission) do
      :ok
    else
      {:error, :unauthorized}
    end
  end
end
