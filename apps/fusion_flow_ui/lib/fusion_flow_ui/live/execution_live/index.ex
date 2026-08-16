defmodule FusionFlowUI.ExecutionLive.Index do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.Executions

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: gettext("Executions"))}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  defp apply_action(socket, :show, %{"public_id" => public_id}) do
    execution = Executions.get_execution_by_public_id!(public_id)

    socket
    |> assign(page_title: gettext("Execution"))
    |> assign(executions: Executions.list_executions())
    |> assign(selected_execution: execution)
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(page_title: gettext("Executions"))
    |> assign(executions: Executions.list_executions())
    |> assign(selected_execution: nil)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-slate-950">
      <div class="shrink-0 border-b border-gray-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 md:px-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {gettext("Executions")}
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {gettext("Track queued, running, succeeded, and failed workflow runs.")}
            </p>
          </div>
          <.link
            navigate={~p"/flows"}
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
          >
            <.icon name="hero-squares-2x2" class="h-4 w-4" />
            {gettext("Flows")}
          </.link>
        </div>
      </div>

      <div class="grid min-h-0 flex-1 overflow-hidden grid-cols-1 lg:grid-cols-[minmax(22rem,28rem)_1fr]">
        <section class="flex min-h-0 flex-col overflow-hidden border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:border-b-0 lg:border-r">
          <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-slate-800">
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
              {gettext("Recent")}
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {length(@executions)}
            </span>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
            <%= if Enum.empty?(@executions) do %>
              <div
                id="executions-empty"
                class="p-8 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {gettext("No executions recorded yet.")}
              </div>
            <% else %>
              <%= for execution <- @executions do %>
                <.link
                  id={"execution-row-#{execution.public_id}"}
                  patch={~p"/executions/#{execution.public_id}"}
                  class={[
                    "block px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-slate-800/60",
                    @selected_execution && @selected_execution.id == execution.id &&
                      "bg-indigo-50/70 dark:bg-indigo-950/30"
                  ]}
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {execution.public_id}
                    </span>
                    <.status_badge status={execution.status} />
                  </div>

                  <p class="mt-1 truncate text-xs text-gray-600 dark:text-gray-300">
                    {execution.flow && execution.flow.name}
                  </p>

                  <div class="mt-2 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                    <span>{get_trigger(execution)}</span>
                    <span>{format_datetime(execution.inserted_at)}</span>
                  </div>
                </.link>
              <% end %>
            <% end %>
          </div>
        </section>

        <section id="execution-detail" class="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          <%= if @selected_execution do %>
            <div class="space-y-6">
              <div class="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="font-mono text-xl font-bold text-gray-900 dark:text-white">
                      {@selected_execution.public_id}
                    </h2>
                    <.status_badge status={@selected_execution.status} />
                  </div>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {gettext("Flow")}:
                    <%= if @selected_execution.flow do %>
                      <.link
                        navigate={~p"/flows/#{@selected_execution.flow.id}"}
                        class="font-medium text-primary hover:underline"
                      >
                        {@selected_execution.flow.name}
                      </.link>
                    <% else %>
                      <span class="italic">{gettext("Deleted flow")}</span>
                    <% end %>
                  </p>
                  <p class="mt-1 text-xs text-gray-400">
                    Trigger: {get_trigger(@selected_execution)}
                  </p>
                  <%= if @selected_execution.flow do %>
                    <div class="mt-2">
                      <.link
                        navigate={~p"/flows/#{@selected_execution.flow.id}"}
                        class="text-xs font-semibold text-primary hover:underline"
                      >
                        Open Flow
                      </.link>
                    </div>
                  <% end %>
                </div>

                <div class="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span class="block font-medium text-gray-400 dark:text-gray-500">
                      {gettext("Started")}
                    </span>
                    <span>{format_datetime(@selected_execution.started_at)}</span>
                  </div>
                  <div>
                    <span class="block font-medium text-gray-400 dark:text-gray-500">
                      {gettext("Completed")}
                    </span>
                    <span>{format_datetime(@selected_execution.finished_at)}</span>
                  </div>
                </div>
              </div>

              <%= if @selected_execution.error do %>
                <div class="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/40">
                  <h3 class="text-sm font-semibold text-red-900 dark:text-red-200">
                    {gettext("Execution Error")}
                  </h3>
                  <pre class="mt-2 overflow-x-auto text-xs text-red-800 dark:text-red-300 font-mono whitespace-pre-wrap"><%= Jason.encode!(@selected_execution.error, pretty: true) %></pre>
                </div>
              <% end %>

              <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {gettext("Input Payload")}
                  </h3>
                  <pre class="mt-3 max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-800 dark:bg-slate-950 dark:text-gray-200"><%= Jason.encode!(@selected_execution.input || %{}, pretty: true) %></pre>
                </div>

                <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {gettext("Result / Output")}
                  </h3>
                  <pre class="mt-3 max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-800 dark:bg-slate-950 dark:text-gray-200"><%= Jason.encode!(@selected_execution.result || %{}, pretty: true) %></pre>
                </div>
              </div>

              <%= if @selected_execution.logs && @selected_execution.logs != [] do %>
                <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {gettext("Node Logs")}
                  </h3>
                  <div class="mt-3 space-y-2">
                    <%= for log <- @selected_execution.logs do %>
                      <div class="rounded-lg bg-gray-50 px-4 py-3 font-mono text-xs text-gray-700 dark:bg-slate-950 dark:text-gray-300">
                        <%= if is_map(log) do %>
                          <div class="flex items-center justify-between text-gray-400">
                            <span>node_id: {log["node_label"] || log["node_id"]}</span>
                            <span>{log["timestamp"]}</span>
                          </div>
                          <p class="mt-1 text-gray-900 dark:text-gray-100">
                            {log["message"] || log["status"]}
                          </p>
                        <% else %>
                          {inspect(log)}
                        <% end %>
                      </div>
                    <% end %>
                  </div>
                </div>
              <% end %>
            </div>
          <% else %>
            <div class="flex h-full min-h-[20rem] items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-slate-800 dark:text-gray-400">
              {gettext("Select an execution from the list to view its payload, result, and logs.")}
            </div>
          <% end %>
        </section>
      </div>
    </div>
    """
  end

  defp status_badge(assigns) do
    ~H"""
    <span class={[
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
      status_badge_classes(@status)
    ]}>
      {@status}
    </span>
    """
  end

  defp status_badge_classes("succeeded"),
    do: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"

  defp status_badge_classes("failed"),
    do: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"

  defp status_badge_classes("running"),
    do: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"

  defp status_badge_classes(_queued),
    do: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"

  defp get_trigger(execution) do
    if is_map(execution.input) do
      execution.input["trigger"] || execution.input["source"] || "manual"
    else
      "manual"
    end
  end

  defp format_datetime(nil), do: "—"

  defp format_datetime(%DateTime{} = dt) do
    Calendar.strftime(dt, "%Y-%m-%d %H:%M:%S UTC")
  end
end
