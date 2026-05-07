defmodule FusionFlowCore.FlowsTest do
  use FusionFlowCore.DataCase

  alias FusionFlowCore.Flows
  alias FusionFlowCore.Accounts.Scope
  import FusionFlowCore.AccountsFixtures

  defmodule Manifest do
    def get_definitions do
      [
        %{name: "Start", inputs: [], outputs: ["exec"]}
      ]
    end
  end

  describe "flows" do
    import FusionFlowCore.FlowsFixtures

    test "list_flows/0 returns all flows" do
      flow = flow_fixture()
      assert Flows.list_flows() |> Enum.map(& &1.id) |> Enum.member?(flow.id)
    end

    test "get_flow!/1 returns the flow with given id" do
      flow = flow_fixture()
      assert Flows.get_flow!(flow.id).id == flow.id
    end

    test "scoped queries only return owned flows" do
      user = user_fixture()
      owned_flow = flow_fixture(%{user: user})
      other_flow = flow_fixture()
      scope = Scope.for_user(user)

      assert Flows.list_flows(scope) |> Enum.map(& &1.id) == [owned_flow.id]
      assert Flows.get_flow!(scope, owned_flow.id).id == owned_flow.id
      assert_raise Ecto.NoResultsError, fn -> Flows.get_flow!(scope, other_flow.id) end
    end

    test "create_flow/1 with valid data creates a flow" do
      user = user_fixture()
      attrs = %{name: "Test Flow", nodes: [], connections: [], user_id: user.id}
      assert {:ok, flow} = Flows.create_flow(attrs)
      assert flow.name == "Test Flow"
      assert flow.user_id == user.id
      assert flow.nodes == []
      assert flow.connections == []
    end

    test "create_flow/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Flows.create_flow(%{})
    end

    test "create_flow/1 with invalid graph returns error changeset" do
      previous_manifest = Application.get_env(:fusion_flow_core, :graph_manifest)
      Application.put_env(:fusion_flow_core, :graph_manifest, Manifest)

      on_exit(fn ->
        if previous_manifest do
          Application.put_env(:fusion_flow_core, :graph_manifest, previous_manifest)
        else
          Application.delete_env(:fusion_flow_core, :graph_manifest)
        end
      end)

      attrs = %{
        name: "Invalid Flow",
        user_id: user_fixture().id,
        nodes: [
          %{
            "id" => "start",
            "type" => "Missing",
            "controls" => %{},
            "position" => %{"x" => 0, "y" => 0}
          }
        ],
        connections: []
      }

      assert {:error, changeset} = Flows.create_flow(attrs)
      assert "contains unknown node type" in errors_on(changeset).nodes
    end

    test "update_flow/2 with valid data updates the flow" do
      flow = flow_fixture()
      assert {:ok, updated} = Flows.update_flow(flow, %{name: "Updated Flow"})
      assert updated.name == "Updated Flow"
    end

    test "delete_flow/1 deletes the flow" do
      flow = flow_fixture()
      assert {:ok, _} = Flows.delete_flow(flow)
      assert_raise Ecto.NoResultsError, fn -> Flows.get_flow!(flow.id) end
    end

    test "change_flow/1 returns a flow changeset" do
      flow = flow_fixture()
      assert %Ecto.Changeset{} = Flows.change_flow(flow)
    end

    test "get_first_or_create_default_flow/0 returns existing flow" do
      flow = flow_fixture()
      assert {:ok, result} = Flows.get_first_or_create_default_flow()
      assert result.id == flow.id
    end

    test "get_first_or_create_default_flow/0 creates default when none exist" do
      user_fixture()
      assert Flows.list_flows() == []
      assert {:ok, flow} = Flows.get_first_or_create_default_flow()
      assert flow.name == "My First Flow"
    end
  end

  describe "execution_logs" do
    import FusionFlowCore.FlowsFixtures

    test "create_execution_log/1 with valid data creates a log" do
      flow = flow_fixture()
      attrs = %{flow_id: flow.id, status: "running", context: %{}}

      assert {:ok, log} = Flows.create_execution_log(attrs)
      assert log.status == "running"
    end

    test "create_execution_log/1 without context returns error" do
      flow = flow_fixture()
      attrs = %{flow_id: flow.id, status: "running"}

      assert {:error, %Ecto.Changeset{}} = Flows.create_execution_log(attrs)
    end
  end
end
