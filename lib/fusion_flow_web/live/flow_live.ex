defmodule FusionFlowWeb.FlowLive do
  use FusionFlowWeb, :live_view

  @impl true
  def mount(%{"id" => id}, _session, socket) do
    flow = FusionFlow.Flows.get_flow!(id)

    {:ok,
     socket
     |> assign(
       has_changes: false,
       modal_open: false,
       renaming_flow: false,
       dependencies_modal_open: false,
       dependencies_tab: "elixir",
       search_query: "",
       search_results: [],
       installed_deps: [],
       terminal_logs: [],
       pending_restart_deps: [],
       installing_dep: nil,
       current_node_id: nil,
       current_code_elixir: "",
       current_code_python: "",
       current_code_tab: "elixir",
       current_field_name: nil,
       current_language: "elixir",
       config_modal_open: false,
       editing_node_data: nil,
       nodes_by_category: nodes_by_category(""),
       node_search_query: "",
       collapsed_node_categories: MapSet.new(),
       recent_nodes: [],
       current_flow: flow,
       execution_result: nil,
       execution_notice: nil,
       show_result_modal: false,
       error_modal_open: false,
       current_error_message: nil,
       current_error_node_id: nil,
       available_variables: [],
       chat_open: false,
       chat_messages: [],
       pending_ai_trigger: false,
       chat_loading: false,
       ai_configured: System.get_env("OPENAI_API_KEY") not in [nil, ""],
       inspecting_result: false,
       create_node_modal_open: false,
       selected_position: nil,
       available_nodes: FusionFlow.Nodes.visible_nodes(),
       filtered_nodes: FusionFlow.Nodes.visible_nodes(),
       node_modal_search_query: ""
     ), layout: false}
  end

  @impl true
  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  @impl true
  def handle_event("client_ready", _params, socket) do
    flow = socket.assigns.current_flow
    nodes = flow.nodes || []
    connections = flow.connections || []

    all_definitions =
      FusionFlow.Nodes.all_nodes()
      |> Enum.reduce(%{}, fn node, acc ->
        Map.put(acc, node.name, node)
      end)

    {:noreply,
     push_event(socket, "load_graph_data", %{
       nodes: nodes,
       connections: connections,
       definitions: all_definitions
     })}
  end

  @impl true
  def handle_event("node_added_internally", %{"name" => name, "data" => _data}, socket) do
    {:noreply,
     socket
     |> assign(has_changes: true)
     |> record_recent_node(name)}
  end

  @impl true
  def handle_event("show_drag_tooltip", %{"name" => name}, socket) do
    {:noreply,
     put_flash(socket, :info, "Drag and drop the '#{name}' node onto the canvas to add it.")}
  end

  @impl true
  def handle_event("add_node", %{"name" => name} = _params, socket) do
    definition = FusionFlow.Nodes.get_node(name)

    {:noreply,
     socket
     |> record_recent_node(name)
     |> push_event("add_node", %{name: name, definition: definition})}
  end

  @impl true
  def handle_event("run_flow", _params, socket) do
    {:noreply, push_event(socket, "request_save_and_run", %{})}
  end

  @impl true
  def handle_event("save_and_run", %{"data" => data}, socket) do
    case FusionFlow.Flows.update_flow(socket.assigns.current_flow, data) do
      {:ok, updated_flow} ->
        case FusionFlow.Executions.create_execution(%{
               flow_id: updated_flow.id,
               input: %{"trigger" => "manual"}
             }) do
          {:ok, execution} ->
            case FusionFlow.Executions.enqueue_execution(execution) do
              {:ok, _job} ->
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

              {:error, _reason} ->
                {:noreply,
                 socket
                 |> assign(current_flow: updated_flow, has_changes: false)
                 |> assign(
                   execution_notice: %{
                     kind: :error,
                     status: "failed",
                     title: "Execution was not queued",
                     message: "The flow was saved, but the execution job could not be created.",
                     execution_id: execution.id,
                     public_id: execution.public_id
                   }
                 )
                 |> put_flash(:error, "Flow saved, but execution could not be queued.")}
            end

          {:error, _changeset} ->
            {:noreply,
             socket
             |> assign(current_flow: updated_flow, has_changes: false)
             |> assign(
               execution_notice: %{
                 kind: :error,
                 status: "failed",
                 title: "Execution was not created",
                 message: "The flow was saved, but the execution record could not be created.",
                 execution_id: nil
               }
             )
             |> put_flash(:error, "Flow saved, but execution could not be created.")}
        end

      {:error, _changeset} ->
        {:noreply,
         socket
         |> assign(
           execution_notice: %{
             kind: :error,
             status: "failed",
             title: "Flow was not saved",
             message: "The execution was not queued because the graph could not be saved.",
             execution_id: nil
           }
         )
         |> put_flash(:error, "Failed to save flow before running.")}
    end
  end

  @impl true
  def handle_event("graph_changed", _params, socket) do
    {:noreply, assign(socket, has_changes: true)}
  end

  @impl true
  def handle_event(
        "open_code_editor",
        %{"nodeId" => node_id, "fieldName" => field_name, "language" => language} =
          params,
        socket
      ) do
    variables = params["variables"] || []

    code_elixir = params["code_elixir"] || params["code"] || ""
    code_python = params["code_python"] || ""

    {:noreply,
     assign(socket,
       modal_open: true,
       current_node_id: node_id,
       current_code_elixir: code_elixir,
       current_code_python: code_python,
       current_code_tab: language,
       current_field_name: field_name,
       current_language: language,
       available_variables: variables
     )}
  end

  @impl true
  def handle_event("open_code_editor", %{"nodeId" => node_id, "code" => code}, socket) do
    handle_event(
      "open_code_editor",
      %{
        "nodeId" => node_id,
        "code" => code,
        "fieldName" => "code",
        "language" => "elixir",
        "variables" => []
      },
      socket
    )
  end

  @impl true
  def handle_event("toggle_chat", _params, socket) do
    {:noreply, assign(socket, chat_open: !socket.assigns.chat_open)}
  end

  @impl true
  def handle_event(
        "open_code_editor_from_config",
        %{"field-name" => field_name, "code" => _code, "language" => language},
        socket
      ) do
    editing_data = socket.assigns.editing_node_data

    code_elixir =
      get_in(editing_data, ["controls", "code_elixir", "value"]) ||
        get_in(editing_data, ["controls", "code", "value"]) || ""

    code_python = get_in(editing_data, ["controls", "code_python", "value"]) || ""

    {:noreply,
     assign(socket,
       modal_open: true,
       current_code_elixir: code_elixir,
       current_code_python: code_python,
       current_code_tab: language,
       current_field_name: field_name,
       current_language: language
     )}
  end

  @impl true
  def handle_event("send_message", %{"content" => content}, socket) do
    if content == "" do
      {:noreply, socket}
    else
      messages = socket.assigns.chat_messages ++ [{:user, content}]
      messages = messages ++ [{:ai, ""}]

      ai_messages =
        Enum.map(messages, fn
          {:user, text} -> %{role: "user", content: text}
          {:ai, text} -> %{role: "assistant", content: text}
        end)

      ai_messages = List.delete_at(ai_messages, -1)

      socket = assign(socket, chat_messages: messages, chat_loading: true)

      parent = self()
      current_flow = socket.assigns.current_flow

      socket =
        start_async(socket, :ai_stream, fn ->
          {:ok, result} = FusionFlow.Agents.FlowCreator.chat(ai_messages, current_flow)

          Enum.reduce_while(result.stream, :ok, fn event, _acc ->
            case event do
              {:text_delta, text} ->
                send(parent, {:chat_stream_chunk, text})
                {:cont, :ok}

              {:error, reason} ->
                send(parent, {:chat_stream_error, reason})
                {:halt, {:error, reason}}

              {:finish, _reason} ->
                {:cont, :ok}

              _ ->
                {:cont, :ok}
            end
          end)

          :ok
        end)

      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("open_node_config", %{"nodeId" => _node_id, "nodeData" => node_data}, socket) do
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
     assign(socket,
       config_modal_open: false,
       editing_node_data: nil,
       current_node_id: nil
     )}
  end

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

    socket =
      Enum.reduce(config_data, socket, fn {_key, value}, acc_socket ->
        if String.starts_with?(value, "ui do") do
          {:ok, ui_fields} = FusionFlow.CodeParser.parse_ui_definition(value)

          inputs =
            Enum.filter(ui_fields, &(&1.type == "input")) |> Enum.map(& &1.name)

          outputs =
            Enum.filter(ui_fields, &(&1.type == "output")) |> Enum.map(& &1.name)

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

  @impl true
  def handle_event("switch_language", %{"lang" => lang}, socket) do
    {:noreply, assign(socket, current_language: lang)}
  end

  @impl true
  def handle_event("switch_code_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, current_code_tab: tab)}
  end

  @impl true
  def handle_event("close_modal", _params, socket) do
    {:noreply,
     assign(socket,
       modal_open: false,
       current_node_id: nil,
       current_code_elixir: "",
       current_code_python: "",
       current_field_name: nil
     )}
  end

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
      case FusionFlow.Flows.update_flow(socket.assigns.current_flow, %{name: new_name}) do
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
  def handle_event(
        "save_code",
        %{"code_elixir" => code_elixir, "code_python" => code_python},
        socket
      ) do
    node_id = socket.assigns.current_node_id
    field_name = socket.assigns.current_field_name

    socket =
      if socket.assigns.config_modal_open do
        editing_node_data = socket.assigns.editing_node_data

        current_code =
          if socket.assigns.current_language == "python", do: code_python, else: code_elixir

        updated_node_data =
          editing_node_data
          |> put_in(["controls", "code_elixir", "value"], code_elixir)
          |> put_in(["controls", "code_python", "value"], code_python)

        updated_node_data =
          if field_name && get_in(updated_node_data, ["controls", field_name]) do
            put_in(updated_node_data, ["controls", field_name, "value"], current_code)
          else
            updated_node_data
          end

        socket
        |> assign(
          modal_open: false,
          current_code_elixir: "",
          current_code_python: "",
          current_field_name: nil,
          editing_node_data: updated_node_data
        )
      else
        socket
        |> push_event("update_node_code", %{
          nodeId: node_id,
          code_elixir: code_elixir,
          code_python: code_python,
          fieldName: field_name
        })
        |> assign(
          modal_open: false,
          current_node_id: nil,
          current_code_elixir: "",
          current_code_python: "",
          current_field_name: nil
        )
      end

    {:noreply, socket}
  end

  @impl true
  def handle_event("get_node_definition", %{"name" => name}, socket) do
    definition = FusionFlow.Nodes.get_node(name)
    {:reply, %{definition: definition}, socket}
  end

  @impl true
  def handle_event("parse_node_ui", %{"code" => code}, socket) do
    {:ok, ui_fields} = FusionFlow.CodeParser.parse_ui_definition(code)
    {:reply, %{ui_fields: ui_fields}, socket}
  end

  @impl true
  def handle_event("save_graph", _params, socket) do
    {:noreply, push_event(socket, "request_graph_data", %{})}
  end

  @impl true
  def handle_event("save_graph_data", %{"data" => data}, socket) do
    case FusionFlow.Flows.update_flow(socket.assigns.current_flow, data) do
      {:ok, updated_flow} ->
        {:noreply, assign(socket, current_flow: updated_flow, has_changes: false)}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to save graph data.")}
    end
  end

  @impl true
  def handle_event("open_dependencies_modal", _params, socket) do
    installed = FusionFlow.Dependencies.list_installed_mix_deps()
    {:noreply, assign(socket, dependencies_modal_open: true, installed_deps: installed)}
  end

  @impl true
  def handle_event("close_dependencies_modal", _params, socket) do
    {:noreply,
     assign(socket, dependencies_modal_open: false, search_results: [], search_query: "")}
  end

  @impl true
  def handle_event("switch_dependencies_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, dependencies_tab: tab)}
  end

  @impl true
  def handle_event("search_dependency", %{"query" => query}, socket) do
    if String.length(query) < 2 do
      {:noreply, assign(socket, search_query: query, search_results: [])}
    else
      case FusionFlow.Dependencies.search_hex(query) do
        {:ok, results} ->
          {:noreply, assign(socket, search_query: query, search_results: results)}

        _ ->
          {:noreply, assign(socket, search_query: query, search_results: [])}
      end
    end
  end

  @impl true
  def handle_event("install_dependency", %{"name" => name, "version" => version}, socket) do
    target = self()

    Task.start(fn ->
      case FusionFlow.Dependencies.add_dependency(name, version, "elixir", stream_to: target) do
        {:ok, _} -> send(target, {:dep_install_finished, name})
        {:error, reason} -> send(target, {:dep_install_failed, name, reason})
      end
    end)

    {:noreply,
     assign(socket,
       terminal_logs: ["Starting installation of #{name}...\n"],
       installing_dep: name
     )}
  end

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
    execution = FusionFlow.Executions.get_execution!(execution_id)

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

  @impl true
  def handle_event("open_create_node_modal", %{"x" => x, "y" => y}, socket) do
    {:noreply,
     assign(socket,
       create_node_modal_open: true,
       selected_position: %{"x" => x, "y" => y}
     )}
  end

  @impl true
  def handle_event("close_create_node_modal", _params, socket) do
    {:noreply,
     assign(socket,
       create_node_modal_open: false,
       selected_position: nil,
       filtered_nodes: FusionFlow.Nodes.visible_nodes(),
       node_modal_search_query: ""
     )}
  end

  @impl true
  def handle_event("create_node_from_modal", %{"name" => name}, socket) do
    position = socket.assigns.selected_position || %{"x" => 100, "y" => 100}

    node_data = %{
      "id" => "node_#{:os.system_time(:millisecond)}_#{:rand.uniform(1000)}",
      "label" => name,
      "position" => position
    }

    socket =
      socket
      |> assign(
        create_node_modal_open: false,
        selected_position: nil,
        filtered_nodes: FusionFlow.Nodes.visible_nodes(),
        node_modal_search_query: ""
      )
      |> record_recent_node(name)
      |> push_event("add_node", %{
        name: name,
        definition: FusionFlow.Nodes.get_node(name),
        data: node_data
      })

    {:noreply, socket}
  end

  @impl true
  def handle_event("filter_nodes", %{"value" => query}, socket) do
    {:noreply,
     assign(socket,
       filtered_nodes: filter_nodes(query),
       node_modal_search_query: query
     )}
  end

  @impl true
  def handle_event("filter_sidebar_nodes", %{"node_search" => %{"query" => query}}, socket) do
    {:noreply,
     assign(socket,
       node_search_query: query,
       nodes_by_category: nodes_by_category(query)
     )}
  end

  @impl true
  def handle_event("toggle_node_category", %{"category" => category}, socket) do
    case category_from_param(category) do
      nil ->
        {:noreply, socket}

      category ->
        collapsed_categories = socket.assigns.collapsed_node_categories

        collapsed_categories =
          if MapSet.member?(collapsed_categories, category) do
            MapSet.delete(collapsed_categories, category)
          else
            MapSet.put(collapsed_categories, category)
          end

        {:noreply, assign(socket, collapsed_node_categories: collapsed_categories)}
    end
  end

  @impl true
  def handle_async(:ai_stream, {:ok, _result}, socket) do
    messages = socket.assigns.chat_messages
    {role, content} = List.last(messages)

    socket =
      if role == :ai do
        json_content =
          content
          |> String.replace(~r/^```json\s*/, "")
          |> String.replace(~r/\s*```$/, "")
          |> String.trim()

        case Jason.decode(json_content) do
          {:ok, %{"action" => "create_flow", "nodes" => raw_nodes, "connections" => connections}} ->
            nodes =
              Enum.map(raw_nodes, fn node ->
                data = node["data"] || %{}

                label = node["label"] || data["label"] || node["name"]

                position =
                  node["position"] ||
                    %{"x" => data["x"] || 0, "y" => data["y"] || 0}

                controls =
                  cond do
                    is_map(node["controls"]) and node["controls"] != %{} ->
                      node["controls"]

                    is_map(data["controls"]) and data["controls"] != %{} ->
                      data["controls"]

                    true ->
                      Map.drop(data, ["label", "x", "y", "controls"])
                  end

                controls =
                  Enum.into(controls, %{}, fn {k, v} ->
                    if is_map(v) and Map.has_key?(v, "value") do
                      {k, v["value"]}
                    else
                      {k, v}
                    end
                  end)

                controls =
                  if node["type"] == "Evaluate Code" or node["name"] == "Evaluate Code" do
                    code_val = controls["code"] || controls["code_elixir"]

                    if code_val do
                      controls
                      |> Map.put("code_elixir", code_val)
                      |> Map.delete("code")
                    else
                      controls
                    end
                  else
                    controls
                  end

                %{
                  "id" => node["id"],
                  "name" => node["name"],
                  "type" => node["type"] || node["name"],
                  "label" => label,
                  "position" => position,
                  "controls" => controls,
                  "inputs" => node["inputs"] || %{},
                  "outputs" => node["outputs"] || %{}
                }
              end)
              |> Enum.with_index()
              |> Enum.map(fn {node, index} ->
                current_y = get_in(node, ["position", "y"]) || 100
                new_x = 100 + index * 500

                Map.put(node, "position", %{"x" => new_x, "y" => current_y})
              end)

            all_definitions =
              FusionFlow.Nodes.all_nodes()
              |> Enum.reduce(%{}, fn node, acc ->
                Map.put(acc, node.name, node)
              end)

            socket
            |> push_event("load_graph_data", %{
              nodes: nodes,
              connections: connections,
              definitions: all_definitions
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
      else
        socket
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

  def handle_info({:execution_updated, execution}, socket) do
    {:noreply, assign(socket, execution_notice: execution_notice(execution.status, execution))}
  end

  def handle_info({:dep_log, message}, socket) do
    current_logs = socket.assigns.terminal_logs
    full_log_check = Enum.join(current_logs ++ [message])

    restart_needed =
      full_log_check =~ "You must restart your server" or
        full_log_check =~ "could not compile application" or
        full_log_check =~ "failure" or
        full_log_check =~ "must be recomputed" or
        full_log_check =~ "server restart"

    pending = socket.assigns.pending_restart_deps

    new_pending =
      if restart_needed and socket.assigns.installing_dep do
        [socket.assigns.installing_dep | pending] |> Enum.uniq()
      else
        pending
      end

    {:noreply,
     assign(socket,
       terminal_logs: current_logs ++ [message],
       pending_restart_deps: new_pending
     )}
  end

  @impl true
  def handle_info({:dep_install_finished, name}, socket) do
    installed = FusionFlow.Dependencies.list_installed_mix_deps()

    msg =
      if name in socket.assigns.pending_restart_deps do
        "Dependency #{name} installed, but a server restart is required."
      else
        "Dependency #{name} installed successfully!"
      end

    type = if name in socket.assigns.pending_restart_deps, do: :warning, else: :info

    {:noreply,
     socket
     |> put_flash(type, msg)
     |> assign(installed_deps: installed, installing_dep: nil)}
  end

  @impl true
  def handle_info({:dep_install_failed, name, reason}, socket) do
    {:noreply,
     socket
     |> put_flash(:error, "Failed to install #{name}: #{inspect(reason)}")
     |> assign(installing_dep: nil)}
  end

  @impl true
  def handle_info({:chat_stream_chunk, chunk}, socket) do
    messages = socket.assigns.chat_messages
    {last_role, last_content} = List.last(messages)

    updated_messages =
      if last_role == :ai do
        List.replace_at(messages, -1, {:ai, last_content <> chunk})
      else
        messages
      end

    {:noreply, assign(socket, chat_messages: updated_messages)}
  end

  @impl true
  def handle_info({:chat_stream_error, reason}, socket) do
    {:noreply, put_flash(socket, :error, "AI Error: #{inspect(reason)}")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="w-full h-[100vh] flex flex-col bg-white dark:bg-slate-950 overflow-hidden relative">
      <FusionFlowWeb.Components.Flow.FlowHeader.flow_header
        has_changes={@has_changes}
        flow={@current_flow}
        renaming_flow={@renaming_flow}
      />
      <div class="flex-1 flex overflow-hidden">
        <FusionFlowWeb.Components.Flow.NodeSidebar.node_sidebar
          nodes_by_category={@nodes_by_category}
          search_query={@node_search_query}
          collapsed_categories={@collapsed_node_categories}
          recent_nodes={@recent_nodes}
        />
        <%= if @execution_notice do %>
          <div
            id="execution-queue-notice"
            class={[
              "absolute right-5 top-20 z-40 w-[min(28rem,calc(100vw-2.5rem))] rounded-lg border bg-white px-4 py-3 shadow-xl shadow-gray-900/10 transition dark:bg-slate-900 dark:shadow-black/40",
              notice_border_class(@execution_notice.kind)
            ]}
          >
            <div class="flex items-start gap-3">
              <div class={[
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                notice_icon_class(@execution_notice.kind)
              ]}>
                <.icon name={notice_icon(@execution_notice.kind)} class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {@execution_notice.title}
                  </p>
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-normal text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                    {@execution_notice.status}
                  </span>
                </div>
                <p class="mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
                  {@execution_notice.message}
                </p>
                <%= if @execution_notice.execution_id do %>
                  <p class="mt-2 truncate font-mono text-xs text-gray-500 dark:text-gray-500">
                    execution: {@execution_notice.public_id || @execution_notice.execution_id}
                  </p>
                  <%= if execution_notice_ready?(@execution_notice) do %>
                    <button
                      id="open-execution-result"
                      type="button"
                      phx-click="open_execution_result"
                      phx-value-id={@execution_notice.execution_id}
                      class="mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      <.icon name="hero-magnifying-glass-plus" class="h-4 w-4" /> View result
                    </button>
                  <% else %>
                    <.link
                      navigate={~p"/executions/#{@execution_notice.public_id}"}
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
        <script>
          window.Translations = {
            "Run": "<%= gettext("Run") %>",
            "Waiting...": "<%= gettext("Waiting...") %>",
            "Remove Node": "<%= gettext("Remove Node") %>",
            "Configure Node": "<%= gettext("Configure Node") %>",
            "View Error": "<%= gettext("View Error") %>",
            "Edit Code": "<%= gettext("Edit Code") %>",
            "Coming Soon": "<%= gettext("Coming Soon") %>",
            "Select Integration": "<%= gettext("Select Integration") %>",
            "Drag to canvas": "<%= gettext("Drag to canvas") %>",
            "Create Node": "<%= gettext("Create Node") %>",
            "Copy": "<%= gettext("Copy") %>",
            "Paste": "<%= gettext("Paste") %>",
            "Delete Selected": "<%= gettext("Delete Selected") %>",
            "Undo": "<%= gettext("Undo") %>",
            "Redo": "<%= gettext("Redo") %>",
            "Delete connection": "<%= gettext("Delete connection") %>"
          };
        </script>

        <div
          class="flex-1 relative bg-gray-100 dark:bg-slate-900"
          id="rete-container"
          phx-update="ignore"
        >
          <div
            id="rete"
            class="absolute inset-0 w-full h-full"
            phx-hook="Rete"
          >
          </div>
        </div>
      </div>

      <FusionFlowWeb.Components.Modals.CodeEditorModal.code_editor_modal
        modal_open={@modal_open}
        current_code_tab={@current_code_tab}
        current_code_elixir={@current_code_elixir}
        current_code_python={@current_code_python}
        available_variables={@available_variables}
      />
      <FusionFlowWeb.Components.Modals.NodeConfigModal.node_config_modal
        config_modal_open={@config_modal_open}
        editing_node_data={@editing_node_data}
      />
      <FusionFlowWeb.Components.Modals.ErrorModal.error_modal
        error_modal_open={@error_modal_open}
        current_error_node_id={@current_error_node_id}
        current_error_message={@current_error_message}
      />
      <FusionFlowWeb.Components.Modals.DependenciesModal.dependencies_modal
        dependencies_modal_open={@dependencies_modal_open}
        dependencies_tab={@dependencies_tab}
        pending_restart_deps={@pending_restart_deps}
        search_query={@search_query}
        search_results={@search_results}
        installed_deps={@installed_deps}
        installing_dep={@installing_dep}
        terminal_logs={@terminal_logs}
      />
      <FusionFlowWeb.Components.Modals.ExecutionResultModal.execution_result_modal
        show_result_modal={@show_result_modal}
        execution_result={@execution_result}
        inspecting_result={@inspecting_result}
      />
      <FusionFlowWeb.Components.Modals.CreateNodeModal.create_node_modal
        create_node_modal_open={@create_node_modal_open}
        available_nodes={@filtered_nodes}
        selected_position={@selected_position}
        search_query={@node_modal_search_query}
      />
      <.live_component
        module={FusionFlowWeb.Components.ChatComponent}
        id="chat-component"
        open={@chat_open}
        messages={@chat_messages}
        loading={@chat_loading}
        ai_configured={@ai_configured}
        on_toggle="toggle_chat"
        on_send="send_message"
      />
    </div>
    """
  end

  defp filter_nodes(query) do
    all_nodes = FusionFlow.Nodes.visible_nodes()
    normalized_query = String.trim(query || "")

    if normalized_query == "" do
      all_nodes
    else
      query_lower = String.downcase(normalized_query)

      Enum.filter(all_nodes, fn node ->
        name_match = String.contains?(String.downcase(node.name), query_lower)

        category_match =
          String.contains?(String.downcase(to_string(node.category)), query_lower)

        name_match || category_match
      end)
    end
  end

  defp nodes_by_category(query) do
    query
    |> filter_nodes()
    |> Enum.group_by(& &1.category)
    |> Enum.sort_by(fn {category, _nodes} -> category_sort_index(category) end)
  end

  defp record_recent_node(socket, name) do
    case FusionFlow.Nodes.get_node(name) do
      nil ->
        socket

      node ->
        recent_nodes =
          socket.assigns.recent_nodes
          |> Enum.reject(&(&1.name == name))
          |> then(&[node | &1])
          |> Enum.take(5)

        assign(socket, recent_nodes: recent_nodes)
    end
  end

  defp subscribe_to_execution(socket, execution) do
    if connected?(socket) do
      FusionFlow.Executions.subscribe_to_execution(execution)
    end

    socket
  end

  defp schedule_execution_notice_dismiss(socket, execution_id) do
    dismiss_ref = System.unique_integer([:positive])
    notice = socket.assigns.execution_notice
    Process.send_after(self(), {:dismiss_execution_notice, execution_id, dismiss_ref}, 6_000)

    if notice && notice.execution_id == execution_id do
      assign(socket, execution_notice: Map.put(notice, :dismiss_ref, dismiss_ref))
    else
      socket
    end
  end

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

  defp execution_notice_ready?(%{status: status}) when status in ["succeeded", "failed"], do: true
  defp execution_notice_ready?(_notice), do: false

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

  defp category_sort_index(:trigger), do: 0
  defp category_sort_index(:flow_control), do: 1
  defp category_sort_index(:data_manipulation), do: 2
  defp category_sort_index(:code), do: 3
  defp category_sort_index(:integration), do: 4
  defp category_sort_index(:utility), do: 5
  defp category_sort_index(_), do: 6

  defp category_from_param(category) do
    FusionFlow.Nodes.visible_nodes()
    |> Enum.map(& &1.category)
    |> Enum.uniq()
    |> Enum.find(&(to_string(&1) == category))
  end
end
