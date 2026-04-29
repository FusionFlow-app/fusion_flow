defmodule FusionFlowWeb.FlowLiveTest do
  use FusionFlowWeb.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlow.FlowsFixtures
  import FusionFlow.AccountsFixtures

  setup %{conn: conn} do
    admin = system_admin_fixture()
    %{conn: log_in_user(conn, admin), user: admin}
  end

  describe "mount" do
    test "requires authentication" do
      conn = Phoenix.ConnTest.build_conn()
      flow = flow_fixture()

      assert {:error, redirect} = live(conn, ~p"/flows/#{flow.id}")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "redirects non-admin to root" do
      user = user_fixture()
      flow = flow_fixture()

      conn =
        Phoenix.ConnTest.build_conn()
        |> Phoenix.ConnTest.init_test_session(%{})
        |> log_in_user(user)

      assert {:error, {:redirect, %{to: path}}} = live(conn, ~p"/flows/#{flow.id}")
      assert path == ~p"/"
    end

    test "loads flow and displays its name", %{conn: conn} do
      flow = flow_fixture(%{name: "My Awesome Flow"})

      {:ok, _lv, html} = live(conn, ~p"/flows/#{flow.id}")

      assert html =~ "My Awesome Flow"
      assert html =~ "FusionFlow"
    end

    test "shows node sidebar with categories", %{conn: conn} do
      flow = flow_fixture()

      {:ok, _lv, html} = live(conn, ~p"/flows/#{flow.id}")

      assert html =~ "Nodes"
      assert html =~ "Start"
      assert html =~ "Evaluate Code"
      assert html =~ "Variable"
      assert html =~ "Output"
      assert html =~ "Logger"
    end

    test "shows node descriptions as hover titles", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      assert has_element?(
               lv,
               ~s([data-node-name="Evaluate Code"][title="Runs Elixir or Python code with access to the current flow context."])
             )

      assert has_element?(
               lv,
               ~s([data-node-name=Logger][title="Writes a message to the application logs without changing the flow context."])
             )
    end

    test "filters nodes in the sidebar", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      lv
      |> form("#node-sidebar-search-form", node_search: %{query: "Eval"})
      |> render_change()

      assert has_element?(lv, ~s([data-node-name="Evaluate Code"]))
      refute has_element?(lv, ~s([data-node-name="Logger"]))
    end

    test "collapses and expands node categories", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      assert has_element?(lv, "#node-category-code [data-node-name=\"Evaluate Code\"]")

      render_click(lv, "toggle_node_category", %{"category" => "code"})
      refute has_element?(lv, "#node-category-code [data-node-name=\"Evaluate Code\"]")

      render_click(lv, "toggle_node_category", %{"category" => "code"})
      assert has_element?(lv, "#node-category-code [data-node-name=\"Evaluate Code\"]")
    end

    test "shows recently used nodes after adding a node", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      refute has_element?(lv, "#recent-node-group")

      render_click(lv, "add_node", %{"name" => "Variable"})

      assert has_element?(lv, "#recent-node-group [data-node-name=Variable]")
    end

    test "renders the rete editor container", %{conn: conn} do
      flow = flow_fixture()

      {:ok, _lv, html} = live(conn, ~p"/flows/#{flow.id}")

      assert html =~ ~s(id="rete-container")
      assert html =~ ~s(id="rete")
      assert html =~ ~s(phx-hook="Rete")
    end

    test "renders header action buttons", %{conn: conn} do
      flow = flow_fixture()

      {:ok, _lv, html} = live(conn, ~p"/flows/#{flow.id}")

      assert html =~ "Run Flow"
      assert html =~ "Dependencies"
      assert html =~ "Flows"
    end
  end

  describe "flow name renaming" do
    test "enter rename mode and cancel", %{conn: conn} do
      flow = flow_fixture(%{name: "Original Name"})

      {:ok, lv, html} = live(conn, ~p"/flows/#{flow.id}")

      assert html =~ "Original Name"
      refute html =~ ~s(id="flow-name-input")

      html = render_click(lv, "edit_flow_name")
      assert html =~ ~s(id="flow-name-input")

      html = render_click(lv, "cancel_rename_flow")
      refute html =~ ~s(id="flow-name-input")
      assert html =~ "Original Name"
    end

    test "renames flow successfully", %{conn: conn} do
      flow = flow_fixture(%{name: "Old Name"})

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "edit_flow_name")

      html = render_submit(lv, "save_flow_name", %{"name" => "New Name"})
      assert html =~ "New Name"
      refute html =~ ~s(id="flow-name-input")

      updated_flow = FusionFlow.Flows.get_flow!(flow.id)
      assert updated_flow.name == "New Name"
    end

    test "does not rename with empty name", %{conn: conn} do
      flow = flow_fixture(%{name: "Keep This"})

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "edit_flow_name")
      html = render_submit(lv, "save_flow_name", %{"name" => "  "})

      assert html =~ "Keep This"
    end
  end

  describe "client_ready event" do
    test "pushes load_graph_data with nodes and connections", %{conn: conn} do
      flow =
        flow_fixture(%{
          name: "Graph Flow",
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Variable",
              "label" => "Variable",
              "controls" => %{"var_name" => "x", "var_value" => "42", "var_type" => "Integer"}
            }
          ],
          connections: [
            %{"source" => "1", "sourceOutput" => "exec", "target" => "2", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      assert render_hook(lv, "client_ready", %{})
    end
  end

  describe "add_node event" do
    test "pushes add_node event for Start node", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "add_node", %{"name" => "Start"})
    end

    test "pushes add_node event for Evaluate Code node", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "add_node", %{"name" => "Evaluate Code"})
    end

    test "pushes add_node event for Variable node", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "add_node", %{"name" => "Variable"})
    end
  end

  describe "show_drag_tooltip event" do
    test "handles show_drag_tooltip without crashing", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "show_drag_tooltip", %{"name" => "Logger"})
    end
  end

  describe "graph_changed event" do
    test "marks flow as having unsaved changes", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, html} = live(conn, ~p"/flows/#{flow.id}")

      refute html =~ "unsaved changes"

      html = render_hook(lv, "graph_changed", %{})
      assert html =~ "unsaved changes"
      assert html =~ "Save Changes"
    end
  end

  describe "node_added_internally event" do
    test "marks has_changes after node added", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, html} = live(conn, ~p"/flows/#{flow.id}")

      refute html =~ "unsaved changes"

      html = render_hook(lv, "node_added_internally", %{"name" => "Start", "data" => %{}})
      assert html =~ "unsaved changes"
    end
  end

  describe "save_graph_data event" do
    test "saves graph data and clears has_changes", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "graph_changed", %{})

      html =
        render_hook(lv, "save_graph_data", %{
          "data" => %{
            "nodes" => [
              %{"id" => "n1", "type" => "Start", "label" => "Start", "controls" => %{}}
            ],
            "connections" => []
          }
        })

      refute html =~ "unsaved changes"

      updated_flow = FusionFlow.Flows.get_flow!(flow.id)
      assert length(updated_flow.nodes) == 1
      assert hd(updated_flow.nodes)["type"] == "Start"
    end
  end

  describe "open_code_editor event" do
    test "opens code editor modal with full params", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "open_code_editor", %{
          "nodeId" => "node_1",
          "fieldName" => "code",
          "language" => "elixir",
          "code_elixir" => "IO.puts(\"hello\")",
          "code_python" => "print('hello')",
          "variables" => ["x", "y"]
        })

      assert html =~ "IO.puts"
    end

    test "opens code editor with minimal params", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_code_editor", %{
        "nodeId" => "node_1",
        "code" => "1 + 1"
      })
    end

    test "closes code editor modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_code_editor", %{
        "nodeId" => "node_1",
        "code" => "1 + 1"
      })

      render_click(lv, "close_modal")
    end
  end

  describe "save_code event" do
    test "saves code and closes modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_code_editor", %{
        "nodeId" => "node_1",
        "fieldName" => "code",
        "language" => "elixir",
        "code_elixir" => "",
        "code_python" => ""
      })

      render_click(lv, "save_code", %{
        "code_elixir" => "IO.puts(:updated)",
        "code_python" => "print('updated')"
      })
    end

    test "saves code while config modal is open", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_node_config", %{
        "nodeId" => "n1",
        "nodeData" => %{
          "id" => "n1",
          "label" => "Evaluate Code",
          "controls" => %{
            "code_elixir" => %{"value" => "old code", "type" => "code-button"},
            "code_python" => %{"value" => "", "type" => "code-button"},
            "code" => %{"value" => "old code", "type" => "code-button"}
          }
        }
      })

      render_hook(lv, "open_code_editor", %{
        "nodeId" => "n1",
        "fieldName" => "code",
        "language" => "elixir",
        "code_elixir" => "old code",
        "code_python" => ""
      })

      render_click(lv, "save_code", %{
        "code_elixir" => "new_code()",
        "code_python" => ""
      })
    end
  end

  describe "switch_code_tab event" do
    test "switches between elixir and python tabs", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_code_editor", %{
        "nodeId" => "n1",
        "fieldName" => "code",
        "language" => "elixir",
        "code_elixir" => "IO.puts(:hi)",
        "code_python" => "print('hi')"
      })

      render_click(lv, "switch_code_tab", %{"tab" => "python"})
      render_click(lv, "switch_code_tab", %{"tab" => "elixir"})
    end
  end

  describe "open_node_config / save_node_config / close_config_modal" do
    test "opens config modal with node data", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "open_node_config", %{
          "nodeId" => "n1",
          "nodeData" => %{
            "id" => "n1",
            "label" => "My Logger",
            "controls" => %{
              "level" => %{
                "value" => "info",
                "type" => "select",
                "label" => "Level",
                "options" => [
                  %{"label" => "Info", "value" => "info"},
                  %{"label" => "Error", "value" => "error"}
                ]
              },
              "message" => %{
                "value" => "hello",
                "type" => "text",
                "label" => "Message"
              }
            }
          }
        })

      assert html =~ "Configure My Logger"
      assert html =~ "Node Name"
      assert html =~ "Save Configuration"
      assert html =~ "Cancel"
    end

    test "saves node config and closes modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_node_config", %{
        "nodeId" => "n1",
        "nodeData" => %{
          "id" => "n1",
          "label" => "My Logger",
          "controls" => %{
            "message" => %{"value" => "hello", "type" => "text", "label" => "Message"}
          }
        }
      })

      render_submit(lv, "save_node_config", %{
        "node_label" => "Renamed Logger",
        "message" => "updated message"
      })

      refute has_element?(lv, "[phx-click=close_config_modal]")
    end

    test "closes config modal without saving", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_node_config", %{
        "nodeId" => "n1",
        "nodeData" => %{
          "id" => "n1",
          "label" => "Some Node",
          "controls" => %{}
        }
      })

      html = render_click(lv, "close_config_modal")
      refute html =~ "Configure Some Node"
    end

    test "shows 'no configuration' for node without controls", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "open_node_config", %{
          "nodeId" => "s1",
          "nodeData" => %{
            "id" => "s1",
            "label" => "Start",
            "controls" => nil
          }
        })

      assert html =~ "No configuration options"
    end
  end

  describe "create_node_modal" do
    test "opens and closes the create node modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      refute has_element?(lv, "[phx-click=close_create_node_modal]")

      render_hook(lv, "open_create_node_modal", %{"x" => 200, "y" => 300})

      assert has_element?(lv, "[phx-click=close_create_node_modal]")
      assert has_element?(lv, "[phx-click=create_node_from_modal][phx-value-name=Start]")

      assert has_element?(
               lv,
               "[phx-click=create_node_from_modal][phx-value-name=\"Evaluate Code\"]"
             )

      render_click(lv, "close_create_node_modal")
      refute has_element?(lv, "[phx-click=close_create_node_modal]")
    end

    test "creates node from modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_create_node_modal", %{"x" => 100, "y" => 100})

      render_click(lv, "create_node_from_modal", %{"name" => "Variable"})
      refute has_element?(lv, "[phx-click=close_create_node_modal]")
    end

    test "filters nodes by search query", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "open_create_node_modal", %{"x" => 100, "y" => 100})

      render_hook(lv, "filter_nodes", %{"value" => "Eval"})

      assert has_element?(
               lv,
               "[phx-click=create_node_from_modal][phx-value-name=\"Evaluate Code\"]"
             )

      refute has_element?(lv, "[phx-click=create_node_from_modal][phx-value-name=Logger]")

      render_hook(lv, "filter_nodes", %{"value" => ""})
      assert has_element?(lv, "[phx-click=create_node_from_modal][phx-value-name=Logger]")

      assert has_element?(
               lv,
               "[phx-click=create_node_from_modal][phx-value-name=\"Evaluate Code\"]"
             )
    end
  end

  describe "error_modal" do
    test "opens and closes error modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "show_error_details", %{
          "nodeId" => "eval_1",
          "message" => "undefined function foo/0"
        })

      assert html =~ "Node Execution Error"
      assert html =~ "eval_1"
      assert html =~ "undefined function foo/0"

      html = render_click(lv, "close_error_modal")
      refute html =~ "Node Execution Error"
    end
  end

  describe "execution_result_modal" do
    test "shows and closes result modal after execution", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "done"}
            }
          ],
          connections: [
            %{"source" => "1", "sourceOutput" => "exec", "target" => "2", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "save_and_run", %{
          "data" => %{
            "nodes" => flow.nodes,
            "connections" => flow.connections
          }
        })

      assert html =~ "Execution Output"
      assert html =~ "done"
      assert html =~ "Inspect Full Context"

      html = render_click(lv, "close_result_modal")
      refute html =~ "Execution Output"
    end

    test "toggles inspect mode in result modal", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Variable",
              "label" => "Variable",
              "controls" => %{
                "var_name" => "greeting",
                "var_value" => "Hello!",
                "var_type" => "String"
              }
            },
            %{
              "id" => "3",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "success"}
            }
          ],
          connections: [
            %{
              "source" => "1",
              "sourceOutput" => "exec",
              "target" => "2",
              "targetInput" => "exec"
            },
            %{"source" => "2", "sourceOutput" => "exec", "target" => "3", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "save_and_run", %{
        "data" => %{"nodes" => flow.nodes, "connections" => flow.connections}
      })

      html = render_click(lv, "toggle_inspect_result")
      assert html =~ "Full Context JSON"
      assert html =~ "greeting"

      html = render_click(lv, "toggle_inspect_result")
      assert html =~ "Output"
    end
  end

  describe "save_and_run with errors" do
    test "does not show result modal when execution fails", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Evaluate Code",
              "label" => "Evaluate Code",
              "controls" => %{
                "code_elixir" => "raise \"boom\"",
                "language" => "elixir"
              }
            }
          ],
          connections: [
            %{"source" => "1", "sourceOutput" => "exec", "target" => "2", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "save_and_run", %{
          "data" => %{"nodes" => flow.nodes, "connections" => flow.connections}
        })

      refute html =~ "Execution Output"
    end

    test "does not show result modal when no Start node", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{
              "id" => "1",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "ok"}
            }
          ],
          connections: []
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "save_and_run", %{
          "data" => %{"nodes" => flow.nodes, "connections" => flow.connections}
        })

      refute html =~ "Execution Output"
    end
  end

  describe "save_and_run full pipeline" do
    test "executes Start -> Variable -> Output flow and shows result modal", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Variable",
              "label" => "Variable",
              "controls" => %{
                "var_name" => "counter",
                "var_value" => "10",
                "var_type" => "Integer"
              }
            },
            %{
              "id" => "3",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "complete"}
            }
          ],
          connections: [
            %{
              "source" => "1",
              "sourceOutput" => "exec",
              "target" => "2",
              "targetInput" => "exec"
            },
            %{"source" => "2", "sourceOutput" => "exec", "target" => "3", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "save_and_run", %{
          "data" => %{"nodes" => flow.nodes, "connections" => flow.connections}
        })

      assert html =~ "Execution Output"
      assert html =~ "complete"
    end

    test "executes Start -> Evaluate Code -> Output flow and shows result", %{conn: conn} do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Evaluate Code",
              "label" => "Evaluate Code",
              "controls" => %{
                "code_elixir" => "Map.put(context, \"result\", 42)",
                "language" => "elixir"
              }
            },
            %{
              "id" => "3",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "success"}
            }
          ],
          connections: [
            %{
              "source" => "1",
              "sourceOutput" => "exec",
              "target" => "2",
              "targetInput" => "exec"
            },
            %{"source" => "2", "sourceOutput" => "exec", "target" => "3", "targetInput" => "exec"}
          ]
        })

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html =
        render_hook(lv, "save_and_run", %{
          "data" => %{"nodes" => flow.nodes, "connections" => flow.connections}
        })

      assert html =~ "Execution Output"
      assert html =~ "42"
    end
  end

  describe "get_node_definition event" do
    test "handles get_node_definition without crashing", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "get_node_definition", %{"name" => "Start"})
    end
  end

  describe "parse_node_ui event" do
    test "handles parse_node_ui without crashing", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_hook(lv, "parse_node_ui", %{
        "code" => """
        ui do
          input "data_in"
          output "data_out"
        end
        """
      })
    end
  end

  describe "dependencies modal" do
    test "opens and closes dependencies modal", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      html = render_click(lv, "open_dependencies_modal")
      assert html =~ "Project Dependencies"

      render_click(lv, "close_dependencies_modal")
    end

    test "switches dependencies tab", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "open_dependencies_modal")
      render_click(lv, "switch_dependencies_tab", %{"tab" => "python"})
      render_click(lv, "switch_dependencies_tab", %{"tab" => "elixir"})
    end
  end

  describe "switch_language event" do
    test "switches code language", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "switch_language", %{"lang" => "python"})
      render_click(lv, "switch_language", %{"lang" => "elixir"})
    end
  end

  describe "chat toggle" do
    test "toggles chat panel open and closed", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "toggle_chat")
      render_click(lv, "toggle_chat")
    end
  end

  describe "change_locale event" do
    test "redirects when locale changes", %{conn: conn} do
      flow = flow_fixture()

      {:ok, lv, _html} = live(conn, ~p"/flows/#{flow.id}")

      render_click(lv, "change_locale", %{"locale" => "pt_BR"})
      assert_redirect(lv, "/?locale=pt_BR")
    end
  end
end
