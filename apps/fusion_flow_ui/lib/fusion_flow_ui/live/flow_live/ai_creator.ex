defmodule FusionFlowUI.FlowLive.AICreator do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.Flows
  alias FusionFlowAI.Agents.FlowPlanner
  alias FusionFlowUI.AIChat

  @impl true
  def mount(_params, _session, socket) do
    ai_configured? = System.get_env("OPENAI_API_KEY") not in [nil, ""]

    if ai_configured? do
      {:ok,
       assign(socket,
         page_title: gettext("Create Flow with AI"),
         messages: [],
         loading: false,
         ai_awaiting_approval: false,
         temp_flow_data: nil,
         ai_configured: true
       )}
    else
      {:ok,
       socket
       |> put_flash(:error, gettext("OpenAI API Key is not configured."))
       |> push_navigate(to: ~p"/flows")
       |> assign(ai_configured: false)}
    end
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, push_navigate(socket, to: ~p"/flows/new/ai?locale=#{locale}")}
  end

  @impl true
  def handle_event("send_message", %{"content" => content}, socket) do
    if content == "" do
      {:noreply, socket}
    else
      messages = socket.assigns.messages ++ [{:user, content}, {:ai, ""}]
      ai_messages = AIChat.to_api_messages(messages)

      socket =
        assign(socket,
          messages: messages,
          loading: true,
          ai_awaiting_approval: false,
          temp_flow_data: nil
        )

      parent = self()
      locale = socket.assigns.locale

      socket =
        start_async(socket, :ai_stream, fn ->
          {:ok, result} = FlowPlanner.chat(ai_messages, nil, locale)
          AIChat.consume_stream(result.stream, parent)
        end)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("approve_flow", _params, socket) do
    case socket.assigns.temp_flow_data do
      %{"name" => name, "nodes" => raw_nodes} = flow_data ->
        connections = Map.get(flow_data, "connections", [])
        nodes = AIChat.normalize_nodes(raw_nodes)

        case Flows.create_flow(socket.assigns.current_scope, %{
               name: name || "AI Generated Flow",
               nodes: nodes,
               connections: connections
             }) do
          {:ok, flow} ->
            {:noreply,
             socket
             |> put_flash(:info, gettext("Flow created successfully!"))
             |> push_navigate(to: ~p"/flows/#{flow.id}")}

          {:error, _changeset} ->
            {:noreply, put_flash(socket, :error, gettext("Failed to create flow from AI."))}
        end

      _ ->
        {:noreply, put_flash(socket, :error, gettext("No flow data to approve."))}
    end
  end

  @impl true
  def handle_async(:ai_stream, {:ok, _result}, socket) do
    socket =
      case List.last(socket.assigns.messages) do
        {:ai, content} ->
          case AIChat.extract_create_flow_json(content) do
            {:ok, json} ->
              assign(socket,
                ai_awaiting_approval: true,
                temp_flow_data: json
              )

            :error ->
              socket
          end

        _ ->
          socket
      end

    {:noreply, assign(socket, loading: false)}
  end

  @impl true
  def handle_async(:ai_stream, {:exit, reason}, socket) do
    {:noreply,
     socket
     |> put_flash(:error, gettext("AI Stream failed: %{reason}", reason: inspect(reason)))
     |> assign(loading: false)}
  end

  @impl true
  def handle_info({:chat_stream_chunk, chunk}, socket) do
    {:noreply, assign(socket, messages: AIChat.append_chunk(socket.assigns.messages, chunk))}
  end

  @impl true
  def handle_info({:chat_stream_error, reason}, socket) do
    {:noreply,
     socket
     |> put_flash(:error, gettext("AI Error: %{reason}", reason: inspect(reason)))
     |> assign(loading: false)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-slate-950 overflow-hidden">
      <!-- Top header -->
      <div class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">
              {gettext("AI Flow Creator")}
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {gettext("Describe the workflow you want, and let AI build the nodes and connections.")}
            </p>
          </div>
        </div>
        <.button navigate={~p"/flows"} variant="ghost" class="text-sm">
          {gettext("Cancel")}
        </.button>
      </div>
      
    <!-- Chat messages area -->
      <div
        class="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full"
        id="chat-messages-container"
        phx-hook="ScrollToBottom"
      >
        <%= if Enum.empty?(@messages) do %>
          <div class="h-full flex flex-col items-center justify-center text-center py-12">
            <div class="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {gettext("How can I help you automate today?")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
              {gettext(
                "You can say things like \"Fetch data from an API and send a webhook\" or \"Set a variable and evaluate some python code\"."
              )}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              <button
                phx-click="send_message"
                phx-value-content={
                  gettext("Create a flow with a webhook that receives data, and logs the output")
                }
                class="p-3 text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-xs text-gray-700 dark:text-gray-300 shadow-sm"
              >
                "{gettext("Create a flow with a webhook that receives data, and logs the output")}"
              </button>
              <button
                phx-click="send_message"
                phx-value-content={
                  gettext("Fetch data via HTTP request and run Python evaluation logic")
                }
                class="p-3 text-left bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-xs text-gray-700 dark:text-gray-300 shadow-sm"
              >
                "{gettext("Fetch data via HTTP request and run Python evaluation logic")}"
              </button>
            </div>
          </div>
        <% else %>
          <%= for {sender, content} <- @messages do %>
            <div class={"flex gap-4 #{if sender == :user, do: "justify-end", else: "justify-start"}"}>
              <%= if sender == :ai do %>
                <div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 text-xs font-bold">
                  AI
                </div>
              <% end %>
              <div class={"max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm #{if sender == :user, do: "bg-indigo-600 text-white rounded-br-none", else: "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none"}"}>
                <%= if sender == :ai do %>
                  <div class="prose dark:prose-invert text-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                    <%= cond do %>
                      <% content == "" and @loading -> %>
                        <div class="flex items-center gap-2 text-gray-400">
                          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              class="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                              fill="none"
                            >
                            </circle>
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            >
                            </path>
                          </svg>
                          <span>{gettext("Thinking and designing your flow...")}</span>
                        </div>
                      <% true -> %>
                        {content}
                    <% end %>
                  </div>
                <% else %>
                  <p class="text-sm whitespace-pre-wrap">{content}</p>
                <% end %>
              </div>
              <%= if sender == :user do %>
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0 text-xs font-bold">
                  {String.at(@current_scope.user.username || @current_scope.user.email, 0)
                  |> String.upcase()}
                </div>
              <% end %>
            </div>
          <% end %>
          
    <!-- Approval action bar if JSON ready -->
          <%= if @ai_awaiting_approval do %>
            <div class="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div>
                <h4 class="font-bold text-purple-950 dark:text-purple-200 text-sm">
                  {gettext("Flow blueprint is ready!")}
                </h4>
                <p class="text-xs text-purple-800 dark:text-purple-300 mt-0.5">
                  {gettext("Click approve to create this flow and open the visual canvas.")}
                </p>
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <.button
                  phx-click="approve_flow"
                  variant="primary"
                  class="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {gettext("Approve & Create Flow")}
                </.button>
              </div>
            </div>
          <% end %>
        <% end %>
      </div>
      
    <!-- Input prompt bar -->
      <div class="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto">
          <form phx-submit="send_message" class="flex gap-2">
            <input
              type="text"
              name="content"
              id="ai-flow-prompt-input"
              phx-hook="FocusInput"
              autocomplete="off"
              disabled={@loading}
              placeholder={gettext("Describe changes or explain what the flow should do...")}
              class="flex-1 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-purple-500 focus:border-purple-500 dark:text-white"
            />
            <.button
              type="submit"
              variant="primary"
              disabled={@loading}
              class="bg-purple-600 hover:bg-purple-700 px-5 rounded-xl"
            >
              <%= if @loading do %>
                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  >
                  </circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  >
                  </path>
                </svg>
              <% else %>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              <% end %>
            </.button>
          </form>
        </div>
      </div>
    </div>
    """
  end
end
