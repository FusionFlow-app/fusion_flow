defmodule FusionFlowUI.UserLive.Index do
  use FusionFlowUI, :live_view

  import Ecto.Query

  alias FusionFlowCore.{Accounts, Repo}
  alias FusionFlowCore.Accounts.Invite
  alias FusionFlowCore.Workspaces.Member

  @impl true
  def mount(_params, _session, socket) do
    scope = socket.assigns.current_scope
    user = scope.user
    current_ws = scope.workspace

    invites =
      if current_ws do
        case Accounts.list_workspace_invites(scope) do
          {:ok, list} -> list
          _ -> []
        end
      else
        Accounts.list_invites_by_admin(user)
      end

    workspace_roles =
      if current_ws do
        from(m in Member, where: m.workspace_id == ^current_ws.id, select: {m.user_id, m.role})
        |> Repo.all()
        |> Map.new()
      else
        %{}
      end

    current_invite = get_current_valid_invite(invites)

    {:ok,
     socket
     |> assign(:page_title, gettext("Users & Invites"))
     |> assign(:users, Accounts.list_users())
     |> assign(:current_workspace, current_ws)
     |> assign(:workspace_roles, workspace_roles)
     |> assign(:invites, invites)
     |> assign(:current_invite, current_invite)
     |> assign(:selected_role, "editor")}
  end

  @impl true
  def handle_event("generate_invite", params, socket) do
    scope = socket.assigns.current_scope
    current_ws = scope.workspace

    attrs = %{
      role: params["role"] || "editor",
      email: params["email"]
    }

    result =
      if current_ws do
        Accounts.create_workspace_invite(scope, attrs)
      else
        Accounts.create_invite_or_reuse(scope.user, attrs)
      end

    case result do
      {:ok, invite} ->
        invites =
          if current_ws do
            case Accounts.list_workspace_invites(scope) do
              {:ok, list} -> list
              _ -> []
            end
          else
            Accounts.list_invites_by_admin(scope.user)
          end

        ws_name =
          (invite.workspace && invite.workspace.name) || (current_ws && current_ws.name) ||
            "Workspace"

        {:noreply,
         socket
         |> assign(:invites, invites)
         |> assign(:current_invite, invite)
         |> put_flash(
           :info,
           gettext(
             "Invite link generated for %{workspace} (%{role}). It expires in %{days} days.",
             workspace: ws_name,
             role: String.capitalize(invite.role || "editor"),
             days: Invite.invite_validity_days()
           )
         )}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, gettext("Failed to generate invite."))}
    end
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/users?locale=#{locale}")}
  end

  defp get_current_valid_invite(invites) do
    invites
    |> Enum.find(fn i -> Invite.valid?(i) end)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {gettext("Users & Invitations")}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {gettext(
            "Manage platform users and generate invitations for your current active workspace."
          )}
        </p>
      </div>
      
    <!-- Generate Invite Section -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <.icon name="hero-envelope" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {gettext("Invite to Current Workspace")}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {gettext(
              "New members will join your current workspace (%{name}) with the specified role.",
              name: (@current_workspace && @current_workspace.name) || "Active Workspace"
            )}
          </p>
        </div>

        <div class="p-6 space-y-6">
          <form phx-submit="generate_invite" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Workspace")}
                </label>
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-white">
                  <div class="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {String.at((@current_workspace && @current_workspace.name) || "W", 0)
                    |> String.upcase()}
                  </div>
                  <span class="truncate">
                    {(@current_workspace && @current_workspace.name) || "Active Workspace"}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Role in Workspace")}
                </label>
                <select
                  name="role"
                  class="w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="editor" selected={@selected_role == "editor"}>
                    {gettext("Editor")}
                  </option>
                  <option value="viewer" selected={@selected_role == "viewer"}>
                    {gettext("Viewer")}
                  </option>
                  <option value="admin" selected={@selected_role == "admin"}>
                    {gettext("Admin")}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Recipient Email (Optional)")}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. colleague@company.com"
                  class="w-full bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="pt-2 flex justify-start">
              <.button type="submit" variant="primary">
                <.icon name="hero-envelope" class="h-4 w-4 mr-1" />
                {gettext("Generate invite link")}
              </.button>
            </div>
          </form>

          <%= if @current_invite do %>
            <div class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-fade-in">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {gettext("Latest Generated Link:")}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    {(@current_invite.workspace && @current_invite.workspace.name) ||
                      (@current_workspace && @current_workspace.name) || "Workspace"} • {String.capitalize(
                      @current_invite.role || "editor"
                    )}
                  </span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {gettext("Valid until")} {Calendar.strftime(
                    @current_invite.expires_at,
                    "%Y-%m-%d %H:%M"
                  )}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  id="invite-url"
                  name="invite_url"
                  value={invite_url(@current_invite)}
                  readonly
                  class="flex-1 text-xs font-mono bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2 text-gray-800 dark:text-gray-200 select-all"
                />
                <.button
                  href={invite_url(@current_invite)}
                  target="_blank"
                  variant="outline"
                >
                  <.icon name="hero-arrow-top-right-on-square" class="h-4 w-4 mr-1" />
                  {gettext("Open link")}
                </.button>
              </div>
            </div>
          <% end %>
        </div>
      </div>
      
    <!-- Active Invitations Table -->
      <%= if length(@invites) > 0 do %>
        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {gettext("Workspace Invitations")} ({length(@invites)})
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm">
              <thead class="bg-gray-50 dark:bg-slate-900/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th class="px-6 py-3 text-left">{gettext("Workspace")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Role")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Recipient")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Expires")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Status")}</th>
                  <th class="px-6 py-3 text-right">{gettext("Link")}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                <%= for invite <- @invites do %>
                  <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td class="px-6 py-3.5 font-medium text-gray-900 dark:text-white">
                      {(invite.workspace && invite.workspace.name) ||
                        (@current_workspace && @current_workspace.name) || "Workspace"}
                    </td>
                    <td class="px-6 py-3.5 capitalize text-gray-700 dark:text-gray-300 font-semibold text-xs">
                      {invite.role || "editor"}
                    </td>
                    <td class="px-6 py-3.5 text-gray-600 dark:text-gray-400 text-xs">
                      {invite.email || gettext("Public Link")}
                    </td>
                    <td class="px-6 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      {Calendar.strftime(invite.expires_at, "%Y-%m-%d %H:%M")}
                    </td>
                    <td class="px-6 py-3.5 text-xs">
                      <%= if Invite.used?(invite) do %>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                          {gettext("Used")}
                        </span>
                      <% else %>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                          {gettext("Active")}
                        </span>
                      <% end %>
                    </td>
                    <td class="px-6 py-3.5 text-right">
                      <a
                        href={invite_url(invite)}
                        target="_blank"
                        class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {gettext("Open")}
                      </a>
                    </td>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        </div>
      <% end %>
      
    <!-- All Users Table -->
      <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {gettext("All users")}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {length(@users)} {gettext("users")}
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {gettext("Username")}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {gettext("Email")}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {gettext("Workspace Role")}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {gettext("Platform Admin")}
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {gettext("Joined")}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <%= for user <- @users do %>
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <%= if role = @workspace_roles[user.id] do %>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize">
                        {role}
                      </span>
                    <% else %>
                      <span class="text-gray-400 dark:text-gray-600 text-xs">-</span>
                    <% end %>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <%= if user.is_system_admin do %>
                      <span class="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {gettext("Yes")}
                      </span>
                    <% else %>
                      {gettext("No")}
                    <% end %>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {Calendar.strftime(user.inserted_at, "%Y-%m-%d")}
                  </td>
                </tr>
              <% end %>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    """
  end

  defp invite_url(invite) do
    FusionFlowUI.Endpoint.url() <> ~p"/users/register/#{invite.token}"
  end
end
