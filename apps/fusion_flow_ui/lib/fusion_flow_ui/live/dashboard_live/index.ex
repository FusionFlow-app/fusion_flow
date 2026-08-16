defmodule FusionFlowUI.DashboardLive.Index do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.Flows

  @impl true
  def mount(_params, _session, socket) do
    scope = socket.assigns.current_scope
    user = scope && scope.user
    admin? = user && FusionFlowCore.Accounts.User.system_admin?(user)
    flows = if admin?, do: Flows.list_flows(scope), else: []
    active_count = length(flows)

    {:ok,
     socket
     |> assign(page_title: "Dashboard")
     |> assign(flows: flows)
     |> assign(active_count: active_count)
     |> assign(admin?: admin?)}
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{gettext("Dashboard")}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <%= if @admin? do %>
              {gettext("Welcome back to FusionFlow! Here's an overview of your automated logic.")}
            <% else %>
              {gettext("Welcome back to FusionFlow! Contact an administrator to access flows.")}
            <% end %>
          </p>
        </div>
        <%= if @admin? do %>
          <.button navigate={~p"/flows"} variant="primary">
            {gettext("Manage Flows")}
          </.button>
        <% end %>
      </div>

      <%= if @admin? do %>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {gettext("Total Workflows")}
              </h3>
              <div class="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{@active_count}</div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {gettext("Active visual orchestrations")}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {gettext("Total Nodes")}
              </h3>
              <div class="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              {length(FusionFlowNodes.Nodes.all_nodes())}
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {gettext("Available automation blocks")}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {gettext("Engine Status")}
              </h3>
              <div class="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{gettext("Online")}</div>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              {gettext("BEAM Execution cluster ready")}
            </p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {gettext("Recent Flows")}
            </h2>
            <.link
              navigate={~p"/flows"}
              class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {gettext("View all")}
            </.link>
          </div>

          <%= if Enum.empty?(@flows) do %>
            <div class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400 text-sm">
                {gettext("No flows created yet.")}
              </p>
              <.button navigate={~p"/flows"} variant="primary" class="mt-4">
                {gettext("Create Flow")}
              </.button>
            </div>
          <% else %>
            <div class="divide-y divide-gray-100 dark:divide-slate-700">
              <%= for flow <- Enum.take(@flows, 5) do %>
                <div class="py-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <.link
                        navigate={~p"/flows/#{flow.id}"}
                        class="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {flow.name}
                      </.link>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {length(flow.nodes || [])} {gettext("nodes")} • {length(
                          flow.connections || []
                        )} {gettext("connections")}
                      </p>
                    </div>
                  </div>
                  <.button
                    navigate={~p"/flows/#{flow.id}"}
                    variant="outline"
                    class="text-xs px-3 py-1.5"
                  >
                    {gettext("Edit")}
                  </.button>
                </div>
              <% end %>
            </div>
          <% end %>
        </div>
      <% end %>
    </div>
    """
  end
end
