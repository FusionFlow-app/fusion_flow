defmodule FusionFlowNodes.Nodes.WebhookTest do
  use ExUnit.Case, async: true

  alias FusionFlowNodes.Nodes.Webhook

  describe "definition/0" do
    test "returns the correct node definition" do
      definition = Webhook.definition()
      assert definition.name == "Webhook"
      assert definition.category == :trigger
      assert definition.inputs == []
      assert definition.outputs == [:exec]
    end
  end

  describe "handler/2" do
    test "sets webhook_method and webhook_path from context" do
      context = %{"method" => "POST", "path" => "/my-hook"}

      assert {:ok, result, :exec} = Webhook.handler(context, nil)
      assert result["webhook_method"] == "POST"
      assert result["webhook_path"] == "/my-hook"
    end

    test "uses POST as default webhook_method when method is absent" do
      context = %{"path" => "/hook"}

      assert {:ok, result, :exec} = Webhook.handler(context, nil)
      assert result["webhook_method"] == "POST"
    end

    test "uses /webhook as default path when path is absent" do
      context = %{"method" => "GET"}

      assert {:ok, result, :exec} = Webhook.handler(context, nil)
      assert result["webhook_path"] == "/webhook"
    end

    test "uses both defaults when context is empty" do
      assert {:ok, result, :exec} = Webhook.handler(%{}, nil)
      assert result["webhook_method"] == "POST"
      assert result["webhook_path"] == "/webhook"
    end

    test "preserves existing context keys in result" do
      context = %{"method" => "DELETE", "path" => "/resource", "flow_id" => "abc123"}

      assert {:ok, result, :exec} = Webhook.handler(context, nil)
      assert result["flow_id"] == "abc123"
      assert result["webhook_method"] == "DELETE"
    end

    test "ignores the input argument" do
      context = %{"method" => "PUT", "path" => "/update"}

      assert {:ok, result_nil, :exec} = Webhook.handler(context, nil)
      assert {:ok, result_val, :exec} = Webhook.handler(context, %{"some" => "input"})

      assert result_nil["webhook_method"] == result_val["webhook_method"]
      assert result_nil["webhook_path"] == result_val["webhook_path"]
    end
  end
end
