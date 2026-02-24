defmodule FusionFlowWeb.Components.Modals.CreateNodeModal do
  use FusionFlowWeb, :html

  attr :create_node_modal_open, :boolean, required: true
  attr :available_nodes, :list, required: true
  attr :selected_position, :map, default: nil
  attr :search_query, :string, default: ""

  def create_node_modal(assigns) do
    ~H"""
    <%= if @create_node_modal_open do %>
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[70vh] border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
              <span class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <.icon name="hero-plus" class="w-5 h-5" />
              </span>
              {gettext("Create Node")}
            </h3>

            <.button
              variant="ghost"
              phx-click="close_create_node_modal"
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <.icon name="hero-x-mark" class="h-5 w-5" />
            </.button>
          </div>

          <div class="p-4 border-b border-gray-100 dark:border-slate-700">
            <div class="relative group">
              <.icon
                name="hero-magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors"
              />
              <input
                type="text"
                id="node-search"
                placeholder="Search nodes..."
                phx-hook="NodeSearch"
                value={@search_query}
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto">
            <div class="divide-y divide-gray-50 dark:divide-slate-700/50">
              <%= for node <- @available_nodes do %>
                <button
                  type="button"
                  phx-click="create_node_from_modal"
                  phx-value-name={node.name}
                  class="w-full flex items-center gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-primary-5 hover:to-transparent dark:hover:from-primary-900/20 dark:hover:to-transparent transition-all duration-200 text-left group relative"
                >
                  <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/10 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-200">
                    <.icon name={Map.get(node, :icon, "hero-square-3-stack-3d")} class="w-5 h-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {node.name}
                    </div>
                    <%= if Map.get(node, :description) do %>
                      <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {node.description}
                      </div>
                    <% else %>
                      <div class="text-sm text-gray-400 dark:text-gray-500 capitalize">
                        {node.category}
                      </div>
                    <% end %>
                  </div>
                  <.icon
                    name="hero-chevron-right"
                    class="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                  />
                </button>
              <% end %>
            </div>
          </div>

          <div class="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 flex justify-end rounded-b-xl">
            <.button
              type="button"
              variant="outline"
              phx-click="close_create_node_modal"
            >
              {gettext("Cancel")}
            </.button>
          </div>
        </div>
      </div>
    <% end %>
    """
  end
end
