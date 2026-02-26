defmodule FusionFlowWeb.UserLive.Index do
  use FusionFlowWeb, :live_view

  alias FusionFlow.Accounts
  alias FusionFlow.Accounts.Invite

  @impl true
  def mount(_params, _session, socket) do
    user = socket.assigns.current_scope.user
    users = Accounts.list_users()
    invites = Accounts.list_invites_by_admin(user)
    current_invite = get_current_valid_invite(invites)

    {:ok,
     socket
     |> assign(:page_title, gettext("Users"))
     |> assign(:users, users)
     |> assign(:invites, invites)
     |> assign(:current_invite, current_invite)}
  end

  @impl true
  def handle_event("generate_invite", _params, socket) do
    user = socket.assigns.current_scope.user

    case Accounts.create_invite_or_reuse(user) do
      {:ok, _invite} ->
        invites = Accounts.list_invites_by_admin(user)
        current_invite = get_current_valid_invite(invites)

        {:noreply,
         socket
         |> assign(:invites, invites)
         |> assign(:current_invite, current_invite)
         |> put_flash(:info, gettext("Invite link generated. It expires in %{days} days.", days: Invite.invite_validity_days()))}

      {:error, _changeset} ->
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
    <div class="p-6 md:p-8 w-full max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{gettext("Users")}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {gettext("Manage users and invite new people. Invites expire in %{days} days.", days: Invite.invite_validity_days())}
          </p>
        </div>

        <div class="space-y-8">
          <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {gettext("Invite link")}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {gettext("Generate a link to invite a new user. If you already have a valid invite, the same link is shown.")}
              </p>
            </div>
            <div class="p-6 space-y-4">
              <.button phx-click="generate_invite" variant="primary">
                <.icon name="hero-envelope" class="h-4 w-4 mr-1" />
                {gettext("Generate invite link")}
              </.button>
              <%= if @current_invite do %>
                <div class="mt-4 space-y-4">
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {gettext("Valid until")} {Calendar.strftime(@current_invite.expires_at, "%Y-%m-%d %H:%M")}
                  </p>
                  <div class="flex flex-wrap items-end gap-3">
                    <div class="flex-1 min-w-0">
                      <.input
                        type="text"
                        id="invite-url"
                        name="invite_url"
                        value={invite_url(@current_invite)}
                        label={gettext("Invite URL")}
                        readonly
                      />
                    </div>
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

          <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
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
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {gettext("Username")}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {gettext("Email")}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {gettext("Admin")}
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <%= if user.is_system_admin do %>
                          <span class="text-indigo-600 dark:text-indigo-400">{gettext("Yes")}</span>
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
      </div>
    """
  end

  defp invite_url(invite) do
    FusionFlowWeb.Endpoint.url() <> ~p"/users/register/#{invite.token}"
  end
end
