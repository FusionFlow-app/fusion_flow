defmodule FusionFlowUI.FlowLive.CodeEditorManager do
  @moduledoc """
  Socket reducers and state management for the Monaco/Code Editor modal inside `FlowLive.Editor`.
  """

  import Phoenix.Component, only: [assign: 2]
  import Phoenix.LiveView, only: [push_event: 3]

  @doc """
  Returns the default socket assigns for the code editor modal.
  """
  def initial_assigns do
    [
      modal_open: false,
      current_node_id: nil,
      current_code_elixir: "",
      current_code_python: "",
      current_code_tab: "elixir",
      current_field_name: nil,
      current_language: "elixir",
      available_variables: []
    ]
  end

  @doc """
  Opens the code editor modal triggered from a canvas node event.
  """
  def open_from_event(
        socket,
        %{"nodeId" => node_id, "fieldName" => field_name, "language" => language} = params
      ) do
    variables = params["variables"] || []
    code_elixir = params["code_elixir"] || params["code"] || ""
    code_python = params["code_python"] || ""

    assign(socket,
      modal_open: true,
      current_node_id: node_id,
      current_code_elixir: code_elixir,
      current_code_python: code_python,
      current_code_tab: language,
      current_field_name: field_name,
      current_language: language,
      available_variables: variables
    )
  end

  def open_from_event(socket, %{"nodeId" => node_id, "code" => code}) do
    open_from_event(socket, %{
      "nodeId" => node_id,
      "code" => code,
      "fieldName" => "code",
      "language" => "elixir",
      "variables" => []
    })
  end

  @doc """
  Opens the code editor modal triggered from the node configuration drawer.
  """
  def open_from_config(socket, %{"field-name" => field_name, "language" => language}) do
    editing_data = socket.assigns.editing_node_data

    code_elixir =
      get_in(editing_data, ["controls", "code_elixir", "value"]) ||
        get_in(editing_data, ["controls", "code", "value"]) || ""

    code_python = get_in(editing_data, ["controls", "code_python", "value"]) || ""

    assign(socket,
      modal_open: true,
      current_code_elixir: code_elixir,
      current_code_python: code_python,
      current_code_tab: language,
      current_field_name: field_name,
      current_language: language
    )
  end

  @doc """
  Switches the active language (elixir vs python).
  """
  def switch_language(socket, lang) do
    assign(socket, current_language: lang)
  end

  @doc """
  Switches the active editor tab.
  """
  def switch_tab(socket, tab) do
    assign(socket, current_code_tab: tab)
  end

  @doc """
  Closes the code editor modal and resets buffer assigns.
  """
  def close(socket) do
    assign(socket,
      modal_open: false,
      current_node_id: nil,
      current_code_elixir: "",
      current_code_python: "",
      current_field_name: nil
    )
  end

  @doc """
  Saves the edited code. Updates either the node configuration drawer data or pushes
  an `update_node_code` event to Rete.js.
  """
  def save(socket, %{"code_elixir" => code_elixir, "code_python" => code_python}) do
    node_id = socket.assigns.current_node_id
    field_name = socket.assigns.current_field_name

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

      assign(socket,
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
  end
end
