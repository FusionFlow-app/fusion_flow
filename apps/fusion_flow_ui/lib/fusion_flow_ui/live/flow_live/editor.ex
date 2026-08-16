defmodule FusionFlowUI.FlowLive.Editor do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.{Executions, Flows}
  alias FusionFlowUI.AIChat
  alias FusionFlowUI.FlowLive.{CodeEditorManager, DependencyManager, NodePaletteManager}

  @notice_dismiss_timeout 6_000

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    case Flows.get_flow(socket.assigns.current_scope, id) do
      %FusionFlowCore.Flows.Flow{} = flow ->
        {:ok, assign(socket, initial_assigns(flow)), layout: false}

      _ ->
        {:ok,
         socket
         |> put_flash(:error, "Flow not found or access denied.")
         |> push_navigate(to: ~p"/flows")}
    end
  end

  defp initial_assigns(flow) do
    [
      current_flow: flow,
      has_changes: false,
      renaming_flow: false,
      # Node config drawer
      config_modal_open: false,
      editing_node_data: nil,
      current_node_id: nil,
      # Execution result / notice
      execution_result: nil,
      execution_notice: nil,
      show_result_modal: false,
      inspecting_result: false,
      # Node error modal
      error_modal_open: false,
      current_error_message: nil,
      current_error_node_id: nil,
      # AI chat
      chat_open: false,
      chat_messages: [],
      pending_ai_trigger: false,
      chat_loading: false,
      ai_configured: System.get_env("OPENAI_API_KEY") not in [nil, ""]
    ] ++
      CodeEditorManager.initial_assigns() ++
      NodePaletteManager.initial_assigns() ++
      DependencyManager.initial_assigns()
  end

  # Locale & Client Lifecycle
  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  @impl true
  def handle_event("client_ready", _params, socket) do
    flow = socket.assigns.current_flow

    {:noreply,
     push_event(socket, "load_graph_data", %{
       nodes: flow.nodes || [],
       connections: flow.connections || [],
       definitions: AIChat.node_definitions()
     })}
  end

  @impl true
  def handle_event("graph_changed", _params, socket) do
    {:noreply, assign(socket, has_changes: true)}
  end

  # Node Palette & Creation (delegated to NodePaletteManager)
  @impl true
  def handle_event("node_added_internally", %{"name" => name}, socket) do
    {:noreply,
     socket
     |> assign(has_changes: true)
     |> NodePaletteManager.record_recent_node(name)}
  end

  @impl true
  def handle_event("show_drag_tooltip", %{"name" => name}, socket) do
    {:noreply,
     put_flash(socket, :info, "Drag and drop the '#{name}' node onto the canvas to add it.")}
  end

  @impl true
  def handle_event("add_node", %{"name" => name}, socket) do
    {:noreply, NodePaletteManager.add_node(socket, name)}
  end

  @impl true
  def handle_event("open_create_node_modal", params, socket) do
    {:noreply, NodePaletteManager.open_create_modal(socket, params)}
  end

  @impl true
  def handle_event("close_create_node_modal", _params, socket) do
    {:noreply, NodePaletteManager.close_create_modal(socket)}
  end

  @impl true
  def handle_event("create_node_from_modal", %{"name" => name}, socket) do
    {:noreply, NodePaletteManager.create_node_from_modal(socket, name)}
  end

  @impl true
  def handle_event("filter_nodes", %{"value" => query}, socket) do
    {:noreply, NodePaletteManager.filter_modal_nodes(socket, query)}
  end

  @impl true
  def handle_event("filter_sidebar_nodes", %{"node_search" => %{"query" => query}}, socket) do
    {:noreply, NodePaletteManager.filter_sidebar_nodes(socket, query)}
  end

  @impl true
  def handle_event("toggle_node_category", %{"category" => category}, socket) do
    {:noreply, NodePaletteManager.toggle_category(socket, category)}
  end

  # Code Editor Modal (delegated to CodeEditorManager)
  @impl true
  def handle_event("open_code_editor", params, socket) do
    {:noreply, CodeEditorManager.open_from_event(socket, params)}
  end

  @impl true
  def handle_event("open_code_editor_from_config", params, socket) do
    {:noreply, CodeEditorManager.open_from_config(socket, params)}
  end

  @impl true
  def handle_event("switch_language", %{"lang" => lang}, socket) do
    {:noreply, CodeEditorManager.switch_language(socket, lang)}
  end

  @impl true
  def handle_event("switch_code_tab", %{"tab" => tab}, socket) do
    {:noreply, CodeEditorManager.switch_tab(socket, tab)}
  end

  @impl true
  def handle_event("close_modal", _params, socket) do
    {:noreply, CodeEditorManager.close(socket)}
  end

  @impl true
  def handle_event("save_code", params, socket) do
    {:noreply, CodeEditorManager.save(socket, params)}
  end

  # Node Configuration Drawer
  @impl true
  def handle_event("open_node_config", %{"nodeData" => node_data}, socket) do
    {:noreply,
     assign(socket,
       config_modal_open: true,
       editing_node_data: node_data,
       current_node_id: node_data["id"]
     )}
  end

  @impl true
  def handle_event("close_config_modal", _params, socket) do
    {:noreply,
     assign(socket, config_modal_open: false, editing_node_data: nil, current_node_id: nil)}
  end

  @impl true
  def handle_event("handle_keydown", %{"key" => "Escape"}, socket) do
    {:noreply,
     assign(socket, config_modal_open: false, editing_node_data: nil, current_node_id: nil)}
  end

  @impl true
  def handle_event("handle_keydown", _params, socket), do: {:noreply, socket}

  @impl true
  def handle_event("save_node_config", params, socket) do
    node_id = socket.assigns.current_node_id
    config_data = Map.drop(params, ["_csrf_token", "_target", "node_label"])
    node_label = params["node_label"]

    socket =
      if node_label && node_label != socket.assigns.editing_node_data["label"] do
        push_event(socket, "update_node_label", %{nodeId: node_id, label: node_label})
      else
        socket
      end

    socket = sync_node_sockets(socket, node_id, config_data)

    socket =
      socket
      |> push_event("update_node_data", %{nodeId: node_id, data: config_data})
      |> assign(
        config_modal_open: false,
        editing_node_data: nil,
        current_node_id: nil,
        inspecting_result: false
      )

    {:noreply, socket}
  end

  # Flow Saving & Renaming
  @impl true
  def handle_event("edit_flow_name", _params, socket) do
    {:noreply, assign(socket, renaming_flow: true)}
  end

  @impl true
  def handle_event("cancel_rename_flow", _params, socket) do
    {:noreply, assign(socket, renaming_flow: false)}
  end

  @impl true
  def handle_event("save_flow_name", %{"name" => new_name}, socket) do
    if String.trim(new_name) != "" do
      case Flows.update_flow(socket.assigns.current_scope, socket.assigns.current_flow, %{
             name: new_name
           }) do
        {:ok, updated_flow} ->
          {:noreply, assign(socket, current_flow: updated_flow, renaming_flow: false)}

        {:error, _} ->
          {:noreply,
           assign(socket, renaming_flow: false) |> put_flash(:error, "Failed to rename flow")}
      end
    else
      {:noreply, assign(socket, renaming_flow: false)}
    end
  end

  @impl true
  def handle_event("save_graph", _params, socket) do
    {:noreply, push_event(socket, "request_graph_data", %{})}
  end

  @impl true
  def handle_event("save_graph_data", %{"data" => data}, socket) do
    case Flows.update_flow(socket.assigns.current_scope, socket.assigns.current_flow, data) do
      {:ok, updated_flow} ->
        {:noreply, assign(socket, current_flow: updated_flow, has_changes: false)}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to save graph data.")}
    end
  end

  # Flow Execution & Run
  @impl true
  def handle_event("run_flow", _params, socket) do
    {:noreply, push_event(socket, "request_save_and_run", %{})}
  end

  @impl true
  def handle_event("save_and_run", %{"data" => data}, socket) do
    case Executions.save_and_run(socket.assigns.current_scope, socket.assigns.current_flow, data) do
      {:ok, %{flow: updated_flow, execution: execution}} ->
        {:noreply,
         socket
         |> assign(
           current_flow: updated_flow,
           has_changes: false,
           execution_result: nil,
           execution_notice: execution_notice(:queued, execution),
           show_result_modal: false,
           inspecting_result: false
         )
         |> subscribe_to_execution(execution)
         |> schedule_execution_notice_dismiss(execution.id)
         |> put_flash(:info, "Flow saved and execution queued.")
         |> push_event("clear_node_errors", %{})}

      {:error, stage, context} ->
        {:noreply, handle_run_failure(socket, stage, context)}
    end
  end

  @impl true
  def handle_event("close_result_modal", _params, socket) do
    {:noreply, assign(socket, show_result_modal: false, inspecting_result: false)}
  end

  @impl true
  def handle_event("dismiss_execution_notice", _params, socket) do
    {:noreply, assign(socket, execution_notice: nil)}
  end

  @impl true
  def handle_event("open_execution_result", %{"id" => execution_id}, socket) do
    execution = Executions.get_execution!(execution_id)

    {:noreply,
     assign(socket,
       execution_notice: nil,
       execution_result: execution_modal_result(execution),
       show_result_modal: true,
       inspecting_result: false
     )}
  end

  @impl true
  def handle_event("toggle_inspect_result", _params, socket) do
    {:noreply, assign(socket, inspecting_result: !socket.assigns.inspecting_result)}
  end

  # Error Details Modal
  @impl true
  def handle_event("show_error_details", %{"nodeId" => node_id, "message" => message}, socket) do
    {:noreply,
     assign(socket,
       error_modal_open: true,
       current_error_node_id: node_id,
       current_error_message: message
     )}
  end

  @impl true
  def handle_event("close_error_modal", _params, socket) do
    {:noreply,
     assign(socket,
       error_modal_open: false,
       current_error_node_id: nil,
       current_error_message: nil
     )}
  end

  # Dynamic Node / AST queries
  @impl true
  def handle_event("get_node_definition", %{"name" => name}, socket) do
    {:reply, %{definition: FusionFlowNodes.Nodes.get_node(name)}, socket}
  end

  @impl true
  def handle_event("parse_node_ui", %{"code" => code}, socket) do
    {:ok, ui_fields} = FusionFlowUI.CodeParser.parse_ui_definition(code)
    {:reply, %{ui_fields: ui_fields}, socket}
  end

  # Dependencies (delegated to DependencyManager)
  @impl true
  def handle_event("open_dependencies_modal", _params, socket),
    do: {:noreply, DependencyManager.open(socket)}

  @impl true
  def handle_event("close_dependencies_modal", _params, socket),
    do: {:noreply, DependencyManager.close(socket)}

  @impl true
  def handle_event("switch_dependencies_tab", %{"tab" => tab}, socket),
    do: {:noreply, DependencyManager.switch_tab(socket, tab)}

  @impl true
  def handle_event("search_dependency", %{"query" => query}, socket),
    do: {:noreply, DependencyManager.search(socket, query)}

  @impl true
  def handle_event("install_dependency", %{"name" => name, "version" => version}, socket),
    do: {:noreply, DependencyManager.install(socket, name, version)}

  # AI Chat & Assistants
  @impl true
  def handle_event("toggle_chat", _params, socket) do
    {:noreply, assign(socket, chat_open: !socket.assigns.chat_open)}
  end

  @impl true
  def handle_event("send_message", %{"content" => content}, socket) do
    if content == "" do
      {:noreply, socket}
    else
      messages = socket.assigns.chat_messages ++ [{:user, content}, {:ai, ""}]
      ai_messages = AIChat.to_api_messages(messages)

      socket = assign(socket, chat_messages: messages, chat_loading: true)
      parent = self()
      current_flow = socket.assigns.current_flow

      socket =
        start_async(socket, :ai_stream, fn ->
          {:ok, result} = FusionFlowAI.Agents.FlowCreator.chat(ai_messages, current_flow)
          AIChat.consume_stream(result.stream, parent)
        end)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_async(:ai_stream, {:ok, _result}, socket) do
    socket =
      case List.last(socket.assigns.chat_messages) do
        {:ai, content} -> apply_ai_flow(socket, content)
        _ -> socket
      end

    {:noreply, assign(socket, chat_loading: false)}
  end

  @impl true
  def handle_async(:ai_stream, {:exit, reason}, socket) do
    {:noreply,
     socket
     |> put_flash(:error, "AI Stream failed: #{inspect(reason)}")
     |> assign(chat_loading: false)}
  end

  # Process Messages (info)
  @impl true
  def handle_info({:dismiss_execution_notice, execution_id, dismiss_ref}, socket) do
    notice = socket.assigns.execution_notice

    socket =
      if notice && notice.execution_id == execution_id && notice.dismiss_ref == dismiss_ref do
        assign(socket, execution_notice: nil)
      else
        socket
      end

    {:noreply, socket}
  end

  @impl true
  def handle_info({:dismiss_execution_notice, execution_id}, socket) do
    notice = socket.assigns.execution_notice

    socket =
      if notice && notice.execution_id == execution_id && notice.status == "queued" do
        assign(socket, execution_notice: nil)
      else
        socket
      end

    {:noreply, socket}
  end

  @impl true
  def handle_info({:execution_updated, execution}, socket) do
    {:noreply, assign(socket, execution_notice: execution_notice(execution.status, execution))}
  end

  @impl true
  def handle_info({:dep_log, message}, socket),
    do: {:noreply, DependencyManager.log(socket, message)}

  @impl true
  def handle_info({:dep_install_finished, name}, socket),
    do: {:noreply, DependencyManager.install_finished(socket, name)}

  @impl true
  def handle_info({:dep_install_failed, name, reason}, socket),
    do: {:noreply, DependencyManager.install_failed(socket, name, reason)}

  @impl true
  def handle_info({:chat_stream_chunk, chunk}, socket) do
    {:noreply,
     assign(socket, chat_messages: AIChat.append_chunk(socket.assigns.chat_messages, chunk))}
  end

  @impl true
  def handle_info({:chat_stream_error, reason}, socket) do
    {:noreply, put_flash(socket, :error, "AI Error: #{inspect(reason)}")}
  end

  # Private Helpers
  defp sync_node_sockets(socket, node_id, config_data) do
    Enum.reduce(config_data, socket, fn {_key, value}, acc_socket ->
      if String.starts_with?(value, "ui do") do
        {:ok, ui_fields} = FusionFlowUI.CodeParser.parse_ui_definition(value)
        inputs = Enum.filter(ui_fields, &(&1.type == "input")) |> Enum.map(& &1.name)
        outputs = Enum.filter(ui_fields, &(&1.type == "output")) |> Enum.map(& &1.name)

        if inputs != [] or outputs != [] do
          push_event(acc_socket, "update_node_sockets", %{
            nodeId: node_id,
            inputs: inputs,
            outputs: outputs
          })
        else
          acc_socket
        end
      else
        acc_socket
      end
    end)
  end

  defp apply_ai_flow(socket, content) do
    case AIChat.extract_create_flow_json(content) do
      {:ok, %{"nodes" => raw_nodes} = json} ->
        socket
        |> push_event("load_graph_data", %{
          nodes: AIChat.normalize_nodes(raw_nodes),
          connections: Map.get(json, "connections", []),
          definitions: AIChat.node_definitions()
        })
        |> put_flash(:info, "Flow generated by AI applied successfully!")
        |> assign(has_changes: true)
        |> update(:chat_messages, fn messages ->
          List.replace_at(
            messages,
            -1,
            {:ai, "Flow created successfully! You can see it on the canvas."}
          )
        end)

      _ ->
        socket
    end
  end

  defp subscribe_to_execution(socket, execution) do
    if connected?(socket), do: Executions.subscribe_to_execution(execution)
    socket
  end

  defp schedule_execution_notice_dismiss(socket, execution_id) do
    dismiss_ref = System.unique_integer([:positive])
    notice = socket.assigns.execution_notice

    Process.send_after(
      self(),
      {:dismiss_execution_notice, execution_id, dismiss_ref},
      @notice_dismiss_timeout
    )

    if notice && notice.execution_id == execution_id do
      assign(socket, execution_notice: Map.put(notice, :dismiss_ref, dismiss_ref))
    else
      socket
    end
  end

  defp handle_run_failure(socket, stage, context) do
    socket =
      case context do
        %{flow: flow} -> assign(socket, current_flow: flow, has_changes: false)
        _ -> socket
      end

    socket
    |> assign(execution_notice: run_failure_notice(stage, context))
    |> put_flash(:error, run_failure_flash(stage))
  end

  defp run_failure_notice(:enqueue, %{execution: execution}) do
    %{
      kind: :error,
      status: "failed",
      title: "Execution was not queued",
      message: "The flow was saved, but the execution job could not be created.",
      execution_id: execution.id,
      public_id: execution.public_id
    }
  end

  defp run_failure_notice(:create, _context) do
    %{
      kind: :error,
      status: "failed",
      title: "Execution was not created",
      message: "The flow was saved, but the execution record could not be created.",
      execution_id: nil
    }
  end

  defp run_failure_notice(:save, _context) do
    %{
      kind: :error,
      status: "failed",
      title: "Flow was not saved",
      message: "The execution was not queued because the graph could not be saved.",
      execution_id: nil
    }
  end

  defp run_failure_flash(:enqueue), do: "Flow saved, but execution could not be queued."
  defp run_failure_flash(:create), do: "Flow saved, but execution could not be created."
  defp run_failure_flash(:save), do: "Failed to save flow before running."

  defp execution_notice(:queued, execution) do
    %{
      kind: :info,
      status: "queued",
      title: "Execution queued",
      message: "The flow was saved and is waiting for the worker to run.",
      execution_id: execution.id,
      public_id: execution.public_id,
      dismiss_ref: nil
    }
  end

  defp execution_notice("succeeded", execution) do
    %{
      kind: :success,
      status: "succeeded",
      title: "Execution finished",
      message: "The flow run is ready to inspect.",
      execution_id: execution.id,
      public_id: execution.public_id,
      dismiss_ref: nil
    }
  end

  defp execution_notice("failed", execution) do
    %{
      kind: :error,
      status: "failed",
      title: "Execution failed",
      message: "The flow run finished with an error. Open it to inspect the details.",
      execution_id: execution.id,
      public_id: execution.public_id,
      dismiss_ref: nil
    }
  end

  defp execution_notice(_status, execution) do
    %{
      kind: :info,
      status: "running",
      title: "Execution running",
      message: "The worker is processing this flow run.",
      execution_id: execution.id,
      public_id: execution.public_id,
      dismiss_ref: nil
    }
  end

  defp execution_modal_result(execution) do
    %{
      "execution_id" => execution.id,
      "public_id" => execution.public_id,
      "status" => execution.status,
      "result" => execution.result,
      "error" => execution.error,
      "logs" => execution.logs
    }
  end
end
