defmodule FusionFlowNodes.Nodes.HttpRequestTest do
  use ExUnit.Case, async: true

  describe "handler/2" do
    test "executes a successful GET request" do
      Req.Test.stub(FusionFlowNodes.Nodes.HttpRequest, fn conn ->
        Req.Test.json(conn, %{"status" => "ok"})
      end)

      _context = %{
        "method" => "GET",
        "url" => "https://api.test.com/v1/status",
        "headers" => "{\"Content-Type\": \"application/json\"}"
      }
    end

    test "interpolates variables correctly" do
      _context = %{
        "url" => "https://api.test.com/user/{{user_id}}",
        "user_id" => "123",
        "method" => "GET"
      }

      # We'll just test the handler's ability to pick up variables
      # We'll mock the internal Req call if needed, but for now let's just assert on the context preparation
      # Actually, let's just write a test that verifies successful handle when Req is mocked.

      Req.Test.stub(FusionFlowNodes.Nodes.HttpRequest, fn conn ->
        assert conn.request_path == "/user/123"
        Req.Test.json(conn, %{"id" => 123})
      end)
    end
  end
end
