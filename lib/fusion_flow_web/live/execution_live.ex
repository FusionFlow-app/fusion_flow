defmodule FusionFlowWeb.ExecutionLive do
  use FusionFlowWeb, :live_view

  alias FusionFlow.Executions

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

          <div id="executions-list" class="min-h-0 flex-1 overflow-y-auto">
            <%= if Enum.empty?(@executions) do %>
              <div id="executions-empty" class="px-5 py-10 text-center">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500">
                  <.icon name="hero-queue-list" class="h-6 w-6" />
                </div>
                <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                  {gettext("No executions yet")}
                </p>
              </div>
            <% else %>
              <div class="divide-y divide-gray-200 dark:divide-slate-800">
                <%= for execution <- @executions do %>
                  <.link
                    id={"execution-row-#{execution.public_id}"}
                    navigate={~p"/executions/#{execution.public_id}"}
                    class={[
                      "block px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-slate-800/70",
                      @selected_execution && @selected_execution.id == execution.id &&
                        "bg-indigo-50/70 dark:bg-indigo-950/30"
                    ]}
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {flow_name(execution)}
                        </p>
                        <p class="mt-1 truncate font-mono text-xs text-gray-500 dark:text-gray-500">
                          {execution.public_id}
                        </p>
                      </div>
                      <span class={status_badge_class(execution.status)}>
                        {execution.status}
                      </span>
                    </div>
                    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {format_datetime(execution.inserted_at)}
                    </p>
                  </.link>
                <% end %>
              </div>
            <% end %>
          </div>
        </section>

        <section id="execution-detail-scroll" class="min-h-0 overflow-y-auto px-6 py-6 md:px-8">
          <%= if @selected_execution do %>
            <div id="execution-detail" class="space-y-6">
              <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      {flow_name(@selected_execution)}
                    </h2>
                    <span class={status_badge_class(@selected_execution.status)}>
                      {@selected_execution.status}
                    </span>
                  </div>
                  <p class="mt-2 font-mono text-xs text-gray-500 dark:text-gray-500">
                    {@selected_execution.public_id}
                  </p>
                </div>
                <.link
                  :if={@selected_execution.flow_id}
                  navigate={~p"/flows/#{@selected_execution.flow_id}"}
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  <.icon name="hero-arrow-top-right-on-square" class="h-4 w-4" />
                  {gettext("Open Flow")}
                </.link>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <.metric
                  label={gettext("Queued")}
                  value={format_datetime(@selected_execution.inserted_at)}
                />
                <.metric
                  label={gettext("Started")}
                  value={format_datetime(@selected_execution.started_at)}
                />
                <.metric
                  label={gettext("Finished")}
                  value={format_datetime(@selected_execution.finished_at)}
                />
              </div>

              <.json_panel title={gettext("Input")} value={@selected_execution.input} />
              <.json_panel title={gettext("Result")} value={@selected_execution.result} />
              <.json_panel title={gettext("Error")} value={@selected_execution.error} />
              <.json_panel title={gettext("Logs")} value={@selected_execution.logs} />
            </div>
          <% else %>
            <div
              id="execution-detail-empty"
              class="flex min-h-[24rem] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="text-center">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500">
                  <.icon name="hero-cursor-arrow-rays" class="h-6 w-6" />
                </div>
                <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                  {gettext("Select an execution")}
                </p>
              </div>
            </div>
          <% end %>
        </section>
      </div>
    </div>
    """
  end

  attr :label, :string, required: true
  attr :value, :string, required: true

  defp metric(assigns) do
    ~H"""
    <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-medium uppercase tracking-normal text-gray-500 dark:text-gray-400">
        {@label}
      </p>
      <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        {@value}
      </p>
    </div>
    """
  end

  attr :title, :string, required: true
  attr :value, :any, required: true

  defp json_panel(assigns) do
    ~H"""
    <section class="rounded-lg border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-gray-200 px-4 py-3 dark:border-slate-800">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{@title}</h3>
      </div>
      <pre class="max-h-80 overflow-auto p-4 text-xs leading-5 text-gray-800 dark:text-gray-300"><code>{json_value(@value)}</code></pre>
    </section>
    """
  end

  defp flow_name(%{flow: %{name: name}}) when is_binary(name), do: name
  defp flow_name(_execution), do: gettext("Deleted flow")

  defp status_badge_class("queued") do
    "shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
  end

  defp status_badge_class("running") do
    "shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
  end

  defp status_badge_class("succeeded") do
    "shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
  end

  defp status_badge_class("failed") do
    "shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300"
  end

  defp status_badge_class(_status) do
    "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-300"
  end

  defp format_datetime(nil), do: "-"

  defp format_datetime(%DateTime{} = datetime) do
    Calendar.strftime(datetime, "%Y-%m-%d %H:%M:%S UTC")
  end

  defp json_value(nil), do: "-"
  defp json_value(value), do: Jason.encode!(value, pretty: true)
end
