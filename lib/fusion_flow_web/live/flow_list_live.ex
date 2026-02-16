defmodule FusionFlowWeb.FlowListLive do
  use FusionFlowWeb, :live_view

  alias FusionFlow.Flows

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, flows: Flows.list_flows(), page_title: "My Flows")}
  end

  @impl true
  def handle_event("create_flow", _params, socket) do
    case Flows.create_flow(%{
           name: "New Flow #{System.unique_integer([:positive])}",
           nodes: [],
           connections: []
         }) do
      {:ok, flow} ->
        {:noreply, push_navigate(socket, to: ~p"/flows/#{flow}")}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to create flow.")}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-4xl mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Flows</h1>
        
        <button
          phx-click="create_flow"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          New Flow
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <%= for flow <- @flows do %>
          <.link navigate={~p"/flows/#{flow}"} class="block group">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-500">
              <div class="flex justify-between items-start mb-4">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {Calendar.strftime(flow.updated_at, "%b %d, %Y")}
                </span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {flow.name}
              </h3>
              
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {length(flow.nodes || [])} nodes • {length(flow.connections || [])} connections
              </p>
            </div>
          </.link>
        <% end %>
      </div>
      
      <%= if Enum.empty?(@flows) do %>
        <div class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400 mb-4">No flows created yet.</p>
          
          <button
            phx-click="create_flow"
            class="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Create your first flow
          </button>
        </div>
      <% end %>
    </div>
    """
  end
end
