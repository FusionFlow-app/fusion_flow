defmodule FusionFlowUI.WorkspaceLive.Index do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.Accounts.Scope
  alias FusionFlowCore.{Accounts, Policy, Repo, Workspaces}
  alias FusionFlowCore.Workspaces.Member

  @impl true
  def mount(_params, _session, socket) do
    scope = socket.assigns.current_scope
    user = scope.user

    workspaces = Workspaces.list_workspaces_for_user(user)
    current_ws = socket.assigns[:current_workspace] || List.first(workspaces)

    members =
      if current_ws && Policy.can?(scope, :view_members) do
        case Workspaces.list_members(scope) do
          {:ok, list} -> list
          _ -> []
        end
      else
        []
      end

    invites =
      if current_ws && Policy.can?(scope, :view_members) do
        case Accounts.list_workspace_invites(scope) do
          {:ok, list} -> list
          _ -> []
        end
      else
        []
      end

    {:ok,
     socket
     |> assign(page_title: gettext("Workspace Settings"))
     |> assign(workspaces: workspaces)
     |> assign(current_workspace: current_ws)
     |> assign(members: members)
     |> assign(invites: invites)
     |> assign(roles: Member.roles())
     |> assign(create_ws_modal: false)
     |> assign(add_member_modal: false)
     |> assign(generated_invite_url: nil)
     |> assign(new_ws_name: "")
     |> assign(new_ws_slug: "")
     |> assign(edit_ws_name: (current_ws && current_ws.name) || "")}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    if params["action"] == "new" do
      {:noreply, assign(socket, create_ws_modal: true)}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("open_create_ws_modal", _params, socket) do
    {:noreply, assign(socket, create_ws_modal: true, new_ws_name: "", new_ws_slug: "")}
  end

  @impl true
  def handle_event("close_create_ws_modal", _params, socket) do
    {:noreply, assign(socket, create_ws_modal: false)}
  end

  @impl true
  def handle_event("open_add_member_modal", _params, socket) do
    {:noreply,
     assign(socket,
       add_member_modal: true,
       generated_invite_url: nil
     )}
  end

  @impl true
  def handle_event("close_add_member_modal", _params, socket) do
    {:noreply, assign(socket, add_member_modal: false, generated_invite_url: nil)}
  end

  @impl true
  def handle_event("update_workspace", %{"name" => name}, socket) do
    scope = socket.assigns.current_scope

    case Workspaces.update_workspace(scope, %{name: name}) do
      {:ok, updated_ws} ->
        updated_scope = %{scope | workspace: updated_ws}

        {:noreply,
         socket
         |> assign(current_scope: updated_scope, current_workspace: updated_ws)
         |> put_flash(:info, gettext("Workspace updated successfully!"))
         |> reload_data()}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, gettext("Failed to update workspace."))}
    end
  end

  @impl true
  def handle_event("create_workspace", %{"name" => name, "slug" => slug}, socket) do
    user = socket.assigns.current_scope.user

    case Workspaces.create_workspace(user, %{name: name, slug: slug}) do
      {:ok, %{workspace: ws, member: member}} ->
        scope = Scope.for_membership(user, ws, member)

        {:noreply,
         socket
         |> assign(current_scope: scope, current_workspace: ws)
         |> assign(create_ws_modal: false)
         |> assign(workspaces: Workspaces.list_workspaces_for_user(user))
         |> put_flash(:info, gettext("Workspace created successfully!"))
         |> reload_data()}

      {:error, changeset} ->
        error_msg =
          Enum.map_join(changeset.errors, ", ", fn {field, {msg, _}} -> "#{field} #{msg}" end)

        {:noreply,
         put_flash(socket, :error, "#{gettext("Failed to create workspace:")} #{error_msg}")}
    end
  end

  @impl true
  def handle_event("add_member", %{"role" => role} = params, socket) do
    scope = socket.assigns.current_scope
    identifier = String.trim(params["identifier"] || "")

    if identifier == "" do
      case Accounts.create_workspace_invite(scope, %{role: role}) do
        {:ok, invite} ->
          url = invite_url(invite)

          {:noreply,
           socket
           |> assign(generated_invite_url: url)
           |> put_flash(
             :info,
             gettext("Workspace invitation link generated successfully!")
           )
           |> reload_data()}

        {:error, _} ->
          {:noreply, put_flash(socket, :error, gettext("Failed to generate invite."))}
      end
    else
      user_to_add =
        Accounts.get_user_by_email(identifier) ||
          Repo.get_by(Accounts.User, username: identifier)

      case user_to_add do
        nil ->
          case Accounts.create_workspace_invite(scope, %{email: identifier, role: role}) do
            {:ok, invite} ->
              url = invite_url(invite)

              {:noreply,
               socket
               |> assign(generated_invite_url: url)
               |> put_flash(
                 :info,
                 gettext("User not registered yet. An invite link has been generated below!")
               )
               |> reload_data()}

            {:error, _} ->
              {:noreply, put_flash(socket, :error, gettext("Failed to generate invite."))}
          end

        existing_user ->
          case Workspaces.add_member(scope, existing_user, String.to_existing_atom(role)) do
            {:ok, _member} ->
              {:noreply,
               socket
               |> assign(add_member_modal: false)
               |> put_flash(
                 :info,
                 gettext("%{username} added to workspace as %{role}!",
                   username: existing_user.username,
                   role: role
                 )
               )
               |> reload_data()}

            {:error, :already_member} ->
              {:noreply,
               put_flash(socket, :error, gettext("User is already a member of this workspace."))}

            {:error, :unauthorized} ->
              {:noreply, put_flash(socket, :error, gettext("Unauthorized to add members."))}

            {:error, _} ->
              {:noreply, put_flash(socket, :error, gettext("Failed to add member."))}
          end
      end
    end
  end

  @impl true
  def handle_event("update_role", %{"member_id" => member_id, "role" => new_role}, socket) do
    scope = socket.assigns.current_scope
    member = Repo.get!(Member, member_id)

    case Workspaces.update_member_role(scope, member, String.to_existing_atom(new_role)) do
      {:ok, _updated} ->
        {:noreply,
         socket
         |> put_flash(:info, gettext("Member role updated."))
         |> reload_data()}

      {:error, :cannot_remove_last_owner} ->
        {:noreply,
         put_flash(socket, :error, gettext("Cannot demote the last owner of the workspace."))}

      {:error, :unauthorized} ->
        {:noreply, put_flash(socket, :error, gettext("Unauthorized to change member roles."))}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, gettext("Failed to update member role."))}
    end
  end

  @impl true
  def handle_event("remove_member", %{"member_id" => member_id}, socket) do
    scope = socket.assigns.current_scope
    member = Repo.get!(Member, member_id)

    case Workspaces.remove_member(scope, member) do
      {:ok, _deleted} ->
        {:noreply,
         socket
         |> put_flash(:info, gettext("Member removed from workspace."))
         |> reload_data()}

      {:error, :cannot_remove_last_owner} ->
        {:noreply,
         put_flash(socket, :error, gettext("Cannot remove the last owner of the workspace."))}

      {:error, :unauthorized} ->
        {:noreply, put_flash(socket, :error, gettext("Unauthorized to remove members."))}
    end
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  defp reload_data(socket) do
    scope = socket.assigns.current_scope

    members =
      case Workspaces.list_members(scope) do
        {:ok, list} -> list
        _ -> []
      end

    invites =
      case Accounts.list_workspace_invites(scope) do
        {:ok, list} -> list
        _ -> []
      end

    assign(socket, members: members, invites: invites)
  end

  defp invite_url(invite) do
    FusionFlowUI.Endpoint.url() <> ~p"/users/register/#{invite.token}"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {gettext("Workspace Settings")}
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <%= if @current_scope.is_system_admin do %>
                Platform Admin
              <% else %>
                {@current_scope.role || "Member"}
              <% end %>
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {gettext("Manage team members, roles, and settings for %{name}.",
              name: (@current_workspace && @current_workspace.name) || "Active Workspace"
            )}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <.button
            phx-click="open_create_ws_modal"
            variant="outline"
            class="!text-xs sm:!text-sm !py-2 !px-3"
          >
            <.icon name="hero-plus" class="w-4 h-4 mr-1" /> {gettext("New Workspace")}
          </.button>

          <%= if Policy.can?(@current_scope, :invite_members) or Policy.can?(@current_scope, :manage_members) do %>
            <.button
              phx-click="open_add_member_modal"
              variant="primary"
              class="!text-xs sm:!text-sm !py-2 !px-3.5"
            >
              <.icon name="hero-user-plus" class="w-4 h-4 mr-1" /> {gettext("Invite / Add Member")}
            </.button>
          <% end %>
        </div>
      </div>
      
    <!-- Current Workspace Overview & Details -->
      <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 sm:gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-sm shrink-0">
              {String.at((@current_workspace && @current_workspace.name) || "W", 0) |> String.upcase()}
            </div>
            <div class="min-w-0">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                {@current_workspace && @current_workspace.name}
              </h2>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                slug:
                <span class="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {@current_workspace && @current_workspace.slug}
                </span>
              </p>
            </div>
          </div>

          <%= if Policy.can?(@current_scope, :manage_workspace) do %>
            <form phx-submit="update_workspace" class="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                name="name"
                value={@current_workspace && @current_workspace.name}
                class="flex-1 md:w-52 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-gray-900 dark:text-white"
                placeholder={gettext("Workspace Name")}
                required
              />
              <.button
                type="submit"
                variant="outline"
                class="!py-1.5 !px-3 text-xs sm:text-sm shrink-0"
              >
                {gettext("Rename")}
              </.button>
            </form>
          <% end %>
        </div>
      </div>
      
    <!-- Team Members Section -->
      <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {gettext("Team Members")} ({length(@members)})
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {gettext("People who have access to workflows and resources in this workspace.")}
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
            <thead class="bg-gray-50 dark:bg-slate-900/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3 text-left">{gettext("Member")}</th>
                <th class="px-6 py-3 text-left">{gettext("Role")}</th>
                <th class="px-6 py-3 text-left">{gettext("Joined")}</th>
                <th class="px-6 py-3 text-right">{gettext("Actions")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-800">
              <%= for member <- @members do %>
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                        {String.at(member.user.username || member.user.email, 0) |> String.upcase()}
                      </div>
                      <div>
                        <div class="font-medium text-gray-900 dark:text-white">
                          {member.user.username}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <%= if Policy.can?(@current_scope, :manage_members) and member.role != "owner" do %>
                      <form phx-change="update_role">
                        <input type="hidden" name="member_id" value={member.id} />
                        <select
                          name="role"
                          class="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg text-xs font-medium py-1 px-2.5 text-gray-900 dark:text-white"
                        >
                          <%= for r <- @roles do %>
                            <option value={r} selected={member.role == r}>
                              {String.capitalize(r)}
                            </option>
                          <% end %>
                        </select>
                      </form>
                    <% else %>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 capitalize">
                        {member.role}
                      </span>
                    <% end %>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {Calendar.strftime(member.inserted_at, "%Y-%m-%d")}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <%= if Policy.can?(@current_scope, :manage_members) and member.user_id != @current_scope.user.id do %>
                      <button
                        type="button"
                        phx-click="remove_member"
                        phx-value-member_id={member.id}
                        data-confirm={gettext("Are you sure you want to remove this member?")}
                        class="text-red-600 dark:text-red-400 hover:underline font-medium"
                      >
                        {gettext("Remove")}
                      </button>
                    <% end %>
                  </td>
                </tr>
              <% end %>
            </tbody>
          </table>
        </div>
      </div>
      
    <!-- Pending Invitations Section -->
      <%= if length(@invites) > 0 do %>
        <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {gettext("Pending Invitations")} ({length(@invites)})
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-sm">
              <thead class="bg-gray-50 dark:bg-slate-900/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th class="px-6 py-3 text-left">{gettext("Role")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Recipient")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Expires")}</th>
                  <th class="px-6 py-3 text-left">{gettext("Status")}</th>
                  <th class="px-6 py-3 text-right">{gettext("Link")}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-slate-800">
                <%= for invite <- @invites do %>
                  <tr class="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td class="px-6 py-3.5 capitalize font-semibold text-xs text-gray-800 dark:text-gray-200">
                      {invite.role || "editor"}
                    </td>
                    <td class="px-6 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                      {invite.email || gettext("Public Link")}
                    </td>
                    <td class="px-6 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                      {Calendar.strftime(invite.expires_at, "%Y-%m-%d %H:%M")}
                    </td>
                    <td class="px-6 py-3.5 text-xs">
                      <%= if Accounts.Invite.used?(invite) do %>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-500">
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
      
    <!-- Modal: Create Workspace -->
      <%= if @create_ws_modal do %>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            phx-click-away="close_create_ws_modal"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {gettext("Create New Workspace")}
              </h3>
              <button
                phx-click="close_create_ws_modal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <.icon name="hero-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <form phx-submit="create_workspace" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Workspace Name")}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Acme Production"
                  class="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Slug (URL identifier)")}
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="e.g. acme-prod"
                  class="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-gray-900 dark:text-white"
                />
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <.button type="button" variant="outline" phx-click="close_create_ws_modal">
                  {gettext("Cancel")}
                </.button>
                <.button type="submit" variant="primary">
                  {gettext("Create Workspace")}
                </.button>
              </div>
            </form>
          </div>
        </div>
      <% end %>
      
    <!-- Modal: Add Member / Invite -->
      <%= if @add_member_modal do %>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            phx-click-away="close_add_member_modal"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {gettext("Invite / Add Member to %{name}",
                  name: (@current_workspace && @current_workspace.name) || "Workspace"
                )}
              </h3>
              <button
                phx-click="close_add_member_modal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <.icon name="hero-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <form phx-submit="add_member" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Email or Username (Optional)")}
                </label>
                <input
                  type="text"
                  name="identifier"
                  placeholder={gettext("Leave empty to generate a shareable link")}
                  class="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {gettext(
                    "Provide an email/username to add immediately, or leave empty to generate an open invite link."
                  )}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {gettext("Role")}
                </label>
                <select
                  name="role"
                  class="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white"
                >
                  <option value="editor">{gettext("Editor")}</option>
                  <option value="viewer">{gettext("Viewer")}</option>
                  <option value="admin">{gettext("Admin")}</option>
                </select>
              </div>

              <%= if @generated_invite_url do %>
                <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <span class="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {gettext("Workspace Invitation Link:")}
                  </span>
                  <input
                    type="text"
                    value={@generated_invite_url}
                    readonly
                    class="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg px-2.5 py-1.5 select-all text-gray-900 dark:text-gray-100"
                  />
                </div>
              <% end %>

              <div class="flex justify-end gap-3 pt-2">
                <.button type="button" variant="outline" phx-click="close_add_member_modal">
                  {gettext("Done")}
                </.button>
                <.button type="submit" variant="primary">
                  {gettext("Add / Generate Link")}
                </.button>
              </div>
            </form>
          </div>
        </div>
      <% end %>
    </div>
    """
  end
end
