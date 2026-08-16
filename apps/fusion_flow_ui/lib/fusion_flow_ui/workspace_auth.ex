defmodule FusionFlowUI.WorkspaceAuth do
  @moduledoc """
  Resolves workspace membership and applies RBAC scope for LiveViews.
  """

  import Phoenix.LiveView
  import Phoenix.Component

  alias FusionFlowCore.Accounts.Scope
  alias FusionFlowCore.{Policy, Workspaces}

  @doc """
  LiveView on_mount hook to resolve workspace membership and build the active Scope.
  """
  def on_mount(:mount_workspace_scope, params, session, socket) do
    user = socket.assigns[:current_scope] && socket.assigns.current_scope.user

    cond do
      is_nil(user) ->
        {:cont, socket}

      ws_id = params["ws"] || session["current_workspace_id"] ->
        workspace = Workspaces.get_workspace(ws_id)

        case workspace && Workspaces.fetch_member_workspace(user, workspace.slug) do
          {:ok, %{workspace: ws, member: member}} ->
            scope = Scope.for_membership(user, ws, member)
            user_workspaces = Workspaces.list_workspaces_for_user(user)

            {:cont,
             socket
             |> assign(
               current_scope: scope,
               current_workspace: ws,
               user_workspaces: user_workspaces
             )}

          _ ->
            resolve_default_workspace(user, socket)
        end

      slug = params["workspace_slug"] ->
        case Workspaces.fetch_member_workspace(user, slug) do
          {:ok, %{workspace: workspace, member: member}} ->
            scope = Scope.for_membership(user, workspace, member)
            user_workspaces = Workspaces.list_workspaces_for_user(user)

            {:cont,
             socket
             |> assign(
               current_scope: scope,
               current_workspace: workspace,
               user_workspaces: user_workspaces
             )}

          {:error, :not_found} ->
            socket =
              socket
              |> put_flash(:error, "Workspace not found or access denied.")
              |> redirect(to: "/")

            {:halt, socket}
        end

      true ->
        resolve_default_workspace(user, socket)
    end
  end

  defp resolve_default_workspace(user, socket) do
    case Workspaces.ensure_default_workspace(user) do
      {:ok, %{workspace: workspace, member: member}} ->
        scope = Scope.for_membership(user, workspace, member)
        user_workspaces = Workspaces.list_workspaces_for_user(user)

        {:cont,
         socket
         |> assign(
           current_scope: scope,
           current_workspace: workspace,
           user_workspaces: user_workspaces
         )}

      _ ->
        {:cont, socket}
    end
  end

  @doc """
  Ensures the current socket scope has the required permission.
  Redirects if unauthorized.
  """
  def require_permission(socket, permission) do
    scope = socket.assigns[:current_scope]

    if Policy.can?(scope, permission) do
      :ok
    else
      {:error, :unauthorized}
    end
  end
end
