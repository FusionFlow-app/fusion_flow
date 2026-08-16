defmodule FusionFlowUI.WorkspaceSessionController do
  use FusionFlowUI, :controller

  alias FusionFlowCore.Workspaces

  def switch(conn, %{"id" => workspace_id}) do
    user = conn.assigns[:current_scope] && conn.assigns.current_scope.user

    case Workspaces.get_workspace(workspace_id) do
      nil ->
        conn
        |> put_flash(:error, "Workspace not found.")
        |> redirect(to: ~p"/")

      workspace ->
        case Workspaces.fetch_member_workspace(user, workspace.slug) do
          {:ok, _} ->
            referer = get_req_header(conn, "referer") |> List.first() || "/"
            uri = URI.parse(referer)
            path = if uri.path in [nil, "", "/users/log-in"], do: "/", else: uri.path

            conn
            |> put_session(:current_workspace_id, workspace.id)
            |> redirect(to: path)

          {:error, _} ->
            conn
            |> put_flash(:error, "Access denied to workspace.")
            |> redirect(to: ~p"/")
        end
    end
  end
end
