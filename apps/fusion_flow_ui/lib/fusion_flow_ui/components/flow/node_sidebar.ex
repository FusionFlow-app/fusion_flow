defmodule FusionFlowUI.Components.Flow.NodeSidebar do
  use FusionFlowUI, :html

  attr :nodes_by_category, :list, required: true
  attr :search_query, :string, default: ""
  attr :collapsed_categories, :any, required: true
  attr :recent_nodes, :list, default: []

  def node_sidebar(assigns) do
    ~H"""
    <aside class="w-64 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col z-10 shadow-lg dark:shadow-black/20">
      <div class="p-4 border-b border-gray-200 dark:border-slate-700">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          Nodes
        </h2>

        <form id="node-sidebar-search-form" phx-change="filter_sidebar_nodes" class="mt-3">
          <div class="relative">
            <.icon
              name="hero-magnifying-glass"
              class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            />
            <input
              id="node-sidebar-search"
              type="search"
              name="node_search[query]"
              value={@search_query}
              placeholder={gettext("Search nodes")}
              autocomplete="off"
              class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </form>
      </div>

      <div class="flex-1 overflow-y-auto pt-4 pb-4 space-y-6">
        <div :if={@recent_nodes != []} id="recent-node-group">
          <h3 class="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-4">
            {gettext("Recent")}
          </h3>

          <div class="space-y-0.5">
            <%= for node <- @recent_nodes do %>
              <.node_button node={node} color_class="bg-primary/10 text-primary" />
            <% end %>
          </div>
        </div>

        <%= for {category, nodes} <- @nodes_by_category do %>
          <% collapsed? = @search_query == "" && MapSet.member?(@collapsed_categories, category) %>
          <div id={"node-category-#{category}"}>
            <button
              type="button"
              phx-click="toggle_node_category"
              phx-value-category={category}
              class="mb-2 flex w-full items-center justify-between px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <span>{FusionFlowNodes.Nodes.category_label(category)}</span>
              <.icon
                name={if(collapsed?, do: "hero-chevron-right", else: "hero-chevron-down")}
                class="size-4"
              />
            </button>

            <div :if={!collapsed?} class="space-y-0.5">
              <%= for node <- nodes do %>
                <.node_button node={node} color_class={node.color} />
              <% end %>
            </div>
          </div>
        <% end %>

        <div
          :if={@nodes_by_category == []}
          id="node-sidebar-empty"
          class="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400"
        >
          {gettext("No nodes found")}
        </div>
      </div>
    </aside>
    """
  end

  attr :node, :map, required: true
  attr :color_class, :string, required: true

  defp node_button(assigns) do
    ~H"""
    <button
      draggable="true"
      data-node-name={@node.name}
      phx-click="show_drag_tooltip"
      phx-value-name={@node.name}
      title={Map.get(@node, :description) || gettext("Drag and drop onto the canvas to add")}
      class={[
        "w-full flex items-center justify-between gap-3 px-4 py-2 text-sm font-medium transition-colors",
        "text-gray-700 dark:text-slate-300 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:bg-gray-100 dark:focus:bg-slate-700/50 cursor-grab active:cursor-grabbing"
      ]}
    >
      <div class="flex min-w-0 items-center gap-3">
        <span class={[
          "w-5 h-5 rounded flex items-center justify-center shrink-0",
          @color_class
        ]}>
          <span class={[Map.get(@node, :icon, "hero-square-3-stack-3d"), "w-3.5 h-3.5"]} />
        </span>
        <span class="truncate">{@node.name}</span>
      </div>
    </button>
    """
  end
end
