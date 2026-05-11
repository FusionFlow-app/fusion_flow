defmodule FusionFlowUI.Components.Modals.NodeConfigModal do
  use FusionFlowUI, :html

  attr :config_modal_open, :boolean, required: true
  attr :editing_node_data, :map, default: nil

  def node_config_modal(assigns) do
    ~H"""
    <div class={[
      "fixed top-0 right-0 h-full w-[400px] z-[100] bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-xl dark:shadow-none flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
      if(@config_modal_open, do: "translate-x-0", else: "translate-x-full")
    ]}>
      <%= if @editing_node_data do %>
        <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div class="flex items-center gap-3 min-w-0">
            <span class="shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
              <.icon name={node_icon(@editing_node_data["type"])} class="w-5 h-5" />
            </span>
            <div class="min-w-0">
              <p class="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {@editing_node_data["type"] || @editing_node_data["label"]}
              </p>
              <%= if @editing_node_data["type"] && @editing_node_data["label"] != @editing_node_data["type"] do %>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {@editing_node_data["label"]}
                </p>
              <% end %>
            </div>
          </div>
          <button
            phx-click="close_config_modal"
            class="shrink-0 flex items-center justify-center w-9 h-9 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <.icon name="hero-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <form phx-submit="save_node_config" class="flex-1 flex flex-col overflow-hidden">
          <div class="flex-1 p-6 overflow-y-auto space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Node Name
              </label>
              <input
                type="text"
                name="node_label"
                value={@editing_node_data["label"]}
                class="w-full px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-150"
              />
            </div>

            <%= if @editing_node_data["controls"] do %>
              <%= for {key, control} <- @editing_node_data["controls"] do %>
                <%= if control["type"] == "hidden" do %>
                  <input type="hidden" name={key} value={control["value"]} />
                <% else %>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 capitalize">
                      {control["label"] || String.replace(key, "_", " ")}
                    </label>
                    <%= case control["type"] do %>
                      <% "select" -> %>
                        <div class="relative">
                          <select
                            name={key}
                            class="w-full px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-150 appearance-none pr-10"
                          >
                            <%= for option <- control["options"] || [] do %>
                              <%= if is_map(option) do %>
                                <option
                                  value={option["value"]}
                                  selected={option["value"] == control["value"]}
                                >
                                  {option["label"]}
                                </option>
                              <% else %>
                                <option value={option} selected={option == control["value"]}>
                                  {option}
                                </option>
                              <% end %>
                            <% end %>
                          </select>
                          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <.icon name="hero-chevron-down" class="w-4 h-4" />
                          </span>
                        </div>
                      <% "variable-select" -> %>
                        <div class="relative">
                          <select
                            name={key}
                            class="w-full px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-150 appearance-none pr-10"
                          >
                            <option value="">Select a variable...</option>
                            <%= for var <- @editing_node_data["variables"] || [] do %>
                              <option value={var} selected={var == control["value"]}>{var}</option>
                            <% end %>
                          </select>
                          <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <.icon name="hero-chevron-down" class="w-4 h-4" />
                          </span>
                        </div>
                      <% "code-icon" -> %>
                        <div class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                          <pre class="p-3 text-xs font-mono text-gray-300 bg-slate-800 dark:bg-slate-950 overflow-hidden leading-relaxed min-h-[72px]"><code>{String.slice(to_string(control["value"]), 0, 150)}</code></pre>
                          <.button
                            type="button"
                            variant="primary"
                            phx-click="open_code_editor_from_config"
                            phx-value-field-name={key}
                            phx-value-code={control["value"]}
                            phx-value-language={control["language"] || "elixir"}
                            class="absolute bottom-2 right-2 px-3 py-1.5 text-xs h-auto"
                            title="Open Code Editor"
                          >
                            <.icon name="hero-code-bracket" class="w-3.5 h-3.5 mr-1" /> Edit Code
                          </.button>
                          <input type="hidden" name={key} value={control["value"]} />
                        </div>
                      <% "code-button" -> %>
                        <div class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                          <pre class="p-3 text-xs font-mono text-gray-300 bg-slate-800 dark:bg-slate-950 overflow-hidden leading-relaxed min-h-[72px]"><code>{String.slice(to_string(control["value"]), 0, 150)}</code></pre>
                          <.button
                            type="button"
                            variant="primary"
                            phx-click="open_code_editor_from_config"
                            phx-value-field-name={key}
                            phx-value-code={control["value"]}
                            phx-value-language={control["language"] || "elixir"}
                            class="absolute bottom-2 right-2 px-3 py-1.5 text-xs h-auto"
                          >
                            <.icon name="hero-code-bracket" class="w-3.5 h-3.5 mr-1" /> {gettext(
                              "Edit Code"
                            )}
                          </.button>
                          <input type="hidden" name={key} value={control["value"]} />
                        </div>
                      <% _ -> %>
                        <%= if String.length(to_string(control["value"])) > 50 do %>
                          <textarea
                            name={key}
                            rows="4"
                            class="w-full px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-150"
                          >{control["value"]}</textarea>
                        <% else %>
                          <input
                            type="text"
                            name={key}
                            value={control["value"]}
                            class="w-full px-4 py-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-150"
                          />
                        <% end %>
                    <% end %>
                  </div>
                <% end %>
              <% end %>
            <% else %>
              <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                No configuration options available for this node.
              </p>
            <% end %>
          </div>

          <div class="sticky bottom-0 z-10 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              type="button"
              phx-click="close_config_modal"
              class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {gettext("Cancel")}
            </button>
            <button
              type="submit"
              class="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
            >
              {gettext("Save")}
            </button>
          </div>
        </form>
      <% end %>
    </div>
    """
  end

  defp node_icon(nil), do: "hero-cube"

  defp node_icon(type) do
    case FusionFlowNodes.Nodes.get_node(type) do
      nil -> "hero-cube"
      node -> node.icon || "hero-cube"
    end
  end
end
