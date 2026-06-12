defmodule FusionFlowUI.AIChatTest do
  use ExUnit.Case, async: true

  alias FusionFlowUI.AIChat

  describe "to_api_messages/1" do
    test "maps roles and drops the trailing assistant placeholder" do
      messages = [{:user, "hi"}, {:ai, "hello"}, {:user, "again"}, {:ai, ""}]

      assert AIChat.to_api_messages(messages) == [
               %{role: "user", content: "hi"},
               %{role: "assistant", content: "hello"},
               %{role: "user", content: "again"}
             ]
    end
  end

  describe "append_chunk/2" do
    test "appends to the last assistant message" do
      messages = [{:user, "hi"}, {:ai, "par"}]

      assert AIChat.append_chunk(messages, "tial") == [{:user, "hi"}, {:ai, "partial"}]
    end

    test "leaves messages untouched when the last is not an assistant message" do
      messages = [{:ai, "done"}, {:user, "hi"}]

      assert AIChat.append_chunk(messages, "x") == messages
    end
  end

  describe "consume_stream/2" do
    test "forwards text deltas and returns the accumulated reply" do
      stream = [{:text_delta, "He"}, {:text_delta, "llo"}, {:finish, :stop}]

      assert AIChat.consume_stream(stream, self()) == "Hello"
      assert_received {:chat_stream_chunk, "He"}
      assert_received {:chat_stream_chunk, "llo"}
    end

    test "forwards and returns an error, halting the stream" do
      stream = [{:text_delta, "He"}, {:error, :boom}, {:text_delta, "never"}]

      assert AIChat.consume_stream(stream, self()) == {:error, :boom}
      assert_received {:chat_stream_chunk, "He"}
      assert_received {:chat_stream_error, :boom}
      refute_received {:chat_stream_chunk, "never"}
    end
  end

  describe "extract_create_flow_json/1" do
    test "parses a fenced JSON reply" do
      content = "```json\n{\"action\": \"create_flow\", \"nodes\": []}\n```"

      assert {:ok, %{"action" => "create_flow", "nodes" => []}} =
               AIChat.extract_create_flow_json(content)
    end

    test "parses JSON embedded in surrounding prose" do
      content =
        ~s(Sure! Here it is: {"action": "create_flow", "nodes": [], "connections": []} done)

      assert {:ok, %{"action" => "create_flow"}} = AIChat.extract_create_flow_json(content)
    end

    test "returns :error for non create_flow content" do
      assert :error = AIChat.extract_create_flow_json("just a normal reply")
      assert :error = AIChat.extract_create_flow_json(~s({"action": "something_else"}))
    end
  end

  describe "normalize_nodes/1" do
    test "fills defaults, flattens control values and lays nodes out horizontally" do
      raw = [
        %{"id" => "a", "name" => "Webhook", "controls" => %{"path" => %{"value" => "/in"}}},
        %{"id" => "b", "name" => "Log"}
      ]

      assert [first, second] = AIChat.normalize_nodes(raw)

      assert first["id"] == "a"
      assert first["type"] == "Webhook"
      assert first["label"] == "Webhook"
      # control value maps are flattened to their raw value
      assert first["controls"] == %{"path" => "/in"}
      assert first["inputs"] == %{}
      assert first["outputs"] == %{}
      # x comes from the layout; y defaults to 0 when the node carries no position
      assert first["position"] == %{"x" => 100, "y" => 0}

      # second node is shifted to the right
      assert second["position"]["x"] == 600
    end

    test "normalizes Evaluate Code controls" do
      raw = [%{"id" => "a", "name" => "Evaluate Code", "controls" => %{"code" => "1 + 1"}}]

      assert [node] = AIChat.normalize_nodes(raw)

      assert node["controls"]["code_elixir"] == "1 + 1"
      assert node["controls"]["code_python"] == ""
      assert node["controls"]["language"] == "elixir"
      refute Map.has_key?(node["controls"], "code")
    end

    test "normalizes Output controls with defaults" do
      raw = [%{"id" => "a", "name" => "Output", "controls" => %{}}]

      assert [node] = AIChat.normalize_nodes(raw)

      assert node["controls"]["status"] == "success"
      assert node["controls"]["code"] =~ "ui do"
    end

    test "reads label/position/controls from a nested data map" do
      raw = [
        %{
          "id" => "a",
          "name" => "Log",
          "data" => %{"label" => "My Log", "x" => 5, "y" => 9, "level" => "info"}
        }
      ]

      assert [node] = AIChat.normalize_nodes(raw)

      assert node["label"] == "My Log"
      # controls fall back to the data map (minus reserved keys)
      assert node["controls"] == %{"level" => "info"}
      # y is preserved from data, x is recomputed by the layout
      assert node["position"] == %{"x" => 100, "y" => 9}
    end
  end
end
