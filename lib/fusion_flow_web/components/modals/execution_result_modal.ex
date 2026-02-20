defmodule FusionFlowWeb.Components.Modals.ExecutionResultModal do
  use FusionFlowWeb, :html

  attr :show_result_modal, :boolean, required: true
  attr :execution_result, :map, default: nil

  def execution_result_modal(assigns) do
    ~H"""
    <%= if @show_result_modal do %>
      <div class="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-3/4 max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Execution Result</h3>
            <button
              phx-click="close_result_modal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[60vh] bg-white dark:bg-slate-900">
            <%= if @execution_result && map_size(@execution_result) > 0 do %>
              <div class="space-y-4">
                <%= for {key, value} <- Enum.sort(@execution_result) do %>
                  <%= if is_binary(key) and not String.starts_with?(key, "flow_") do %>
                    <div class="flex flex-col sm:flex-row sm:items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                      <div class="sm:w-1/3 min-w-[120px]">
                        <span class="text-sm font-semibold text-gray-700 dark:text-slate-300 break-words">
                          {key}
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm text-gray-900 dark:text-slate-100 font-mono bg-white dark:bg-slate-950 rounded px-2 py-1 border border-gray-200 dark:border-slate-700 overflow-x-auto">
                          <%= if is_binary(value) do %>
                            {value}
                          <% else %>
                            {inspect(value, pretty: true, limit: :infinity)}
                          <% end %>
                        </div>
                      </div>
                    </div>
                  <% end %>
                <% end %>
              </div>
            <% else %>
              <div class="text-center py-12">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                  <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-medium text-gray-900 dark:text-slate-200">No output data</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  The flow finished without producing any visible output.
                </p>
              </div>
            <% end %>
          </div>

          <div class="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
            <button
              phx-click="close_result_modal"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    <% end %>
    """
  end
end
