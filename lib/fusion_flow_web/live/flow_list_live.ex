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
    <div class="w-full h-[100vh] flex flex-col bg-white dark:bg-slate-900 overflow-hidden relative">
      <header class="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 h-16 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          
          <div>
            <h1 class="text-base font-bold text-gray-900 dark:text-white leading-tight">My Flows</h1>
            
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {length(@flows)} Flows available
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Flows Link (Active State) -->
          <a
            href={~p"/flows"}
            class="h-9 px-3 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md transition-all"
            title="Flows Dashboard"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg> <span class="hidden sm:inline">Flows</span>
          </a>
          <button
            phx-click="create_flow"
            class="h-9 px-4 flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
      </header>
      
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <%= for flow <- @flows do %>
              <.link navigate={~p"/flows/#{flow}"} class="block group">
                <div class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-500 dark:hover:border-indigo-500 group-hover:ring-1 group-hover:ring-indigo-500/20">
                  <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
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
                    
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      {Calendar.strftime(flow.updated_at, "%b %d, %Y")}
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {flow.name}
                  </h3>
                  
                  <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg> {length(flow.nodes || [])} nodes
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg> {length(flow.connections || [])} connections
                    </span>
                  </div>
                </div>
              </.link>
            <% end %>
          </div>
          
          <%= if Enum.empty?(@flows) do %>
            <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700">
              <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <svg
                  class="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No flows created yet
              </h3>
              
              <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-center">
                Get started by creating your first workflow automation. It's easy!
              </p>
              
              <button
                phx-click="create_flow"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
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
                Create your first flow
              </button>
            </div>
          <% end %>
        </div>
      </main>
    </div>
    """
  end
end
