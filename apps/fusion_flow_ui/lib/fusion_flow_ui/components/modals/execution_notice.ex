defmodule FusionFlowUI.Components.Modals.ExecutionNotice do
  @moduledoc """
  Floating notice that reports the status of the current flow execution
  (queued / running / succeeded / failed).

  The notice map is built by the LiveView; this component only renders it and
  owns the purely presentational styling (border/icon variants). The action
  events (`open_execution_result`, `dismiss_execution_notice`) are handled by
  the parent LiveView.
  """
  use FusionFlowUI, :html

  attr :notice, :map, default: nil

  def execution_notice(assigns) do
    ~H"""
    <%= if @notice do %>
      <div
        id="execution-queue-notice"
        class={[
          "absolute right-5 top-20 z-40 w-[min(28rem,calc(100vw-2.5rem))] rounded-lg border bg-white px-4 py-3 shadow-xl shadow-gray-900/10 transition dark:bg-slate-900 dark:shadow-black/40",
          notice_border_class(@notice.kind)
        ]}
      >
        <div class="flex items-start gap-3">
          <div class={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            notice_icon_class(@notice.kind)
          ]}>
            <.icon name={notice_icon(@notice.kind)} class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {@notice.title}
              </p>
              <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-normal text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                {@notice.status}
              </span>
            </div>
            <p class="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
              {@notice.message}
            </p>
            <%= if @notice.execution_id do %>
              <p class="mt-2 truncate font-mono text-xs text-gray-500 dark:text-gray-500">
                execution: {@notice.public_id || @notice.execution_id}
              </p>
              <%= if execution_notice_ready?(@notice) do %>
                <button
                  id="open-execution-result"
                  type="button"
                  phx-click="open_execution_result"
                  phx-value-id={@notice.execution_id}
                  class="mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <.icon name="hero-magnifying-glass-plus" class="h-4 w-4" /> View result
                </button>
              <% else %>
                <.link
                  navigate={~p"/executions/#{@notice.public_id}"}
                  class="mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <.icon name="hero-arrow-top-right-on-square" class="h-4 w-4" /> View execution
                </.link>
              <% end %>
            <% end %>
          </div>
          <button
            id="dismiss-execution-notice"
            type="button"
            phx-click="dismiss_execution_notice"
            class="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200"
            aria-label="Dismiss execution notice"
          >
            <.icon name="hero-x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>
    <% end %>
    """
  end

  defp execution_notice_ready?(%{status: status}) when status in ["succeeded", "failed"], do: true
  defp execution_notice_ready?(_notice), do: false

  defp notice_border_class(:error), do: "border-red-200 dark:border-red-900/60"
  defp notice_border_class(:success), do: "border-emerald-200 dark:border-emerald-900/60"
  defp notice_border_class(_kind), do: "border-indigo-200 dark:border-indigo-900/60"

  defp notice_icon_class(:error),
    do: "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300"

  defp notice_icon_class(:success) do
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
  end

  defp notice_icon_class(_kind) do
    "bg-indigo-50 text-primary dark:bg-indigo-950/60 dark:text-indigo-300"
  end

  defp notice_icon(:error), do: "hero-exclamation-triangle"
  defp notice_icon(:success), do: "hero-check-circle"
  defp notice_icon(_kind), do: "hero-queue-list"
end
