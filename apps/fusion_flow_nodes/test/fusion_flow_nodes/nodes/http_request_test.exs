defmodule FusionFlowNodes.Nodes.HttpRequestTest do
  use ExUnit.Case, async: true

  alias FusionFlowNodes.Nodes.HttpRequest

  describe "definition/0" do
    test "returns the correct node definition" do
      definition = HttpRequest.definition()
      assert definition.name == "HTTP Request"
      assert definition.category == :integration
      assert definition.inputs == [:exec]
      assert definition.outputs == ["success", "error"]
    end
  end

  describe "handler/2 — successful responses" do
    test "routes a 200 GET response to the success output" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"status" => "ok"})
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com/v1/status", "headers" => "{}"}

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"status" => "ok"}
    end

    test "merges map input into context before executing" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com", "headers" => "{}"}
      input = %{"extra_key" => "extra_value"}

      assert {:ok, result, "success"} = HttpRequest.handler(context, input)
      assert result["extra_key"] == "extra_value"
    end

    test "ignores non-map input and uses only context" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com", "headers" => "{}"}

      assert {:ok, _result, "success"} = HttpRequest.handler(context, "not a map")
    end

    test "sends POST request with valid JSON body" do
      Req.Test.stub(HttpRequest, fn conn ->
        {:ok, body, conn} = Plug.Conn.read_body(conn)
        decoded = Jason.decode!(body)
        assert decoded == %{"name" => "Alice"}
        Req.Test.json(conn, %{"created" => true})
      end)

      context = %{
        "method" => "POST",
        "url" => "https://api.test.com/users",
        "headers" => "{}",
        "body" => "{\"name\": \"Alice\"}"
      }

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"created" => true}
    end

    test "sends POST request with plain text body when body is not valid JSON" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "POST",
        "url" => "https://api.test.com/data",
        "headers" => "{}",
        "body" => "plain text body"
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "sends PUT request with JSON body" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"updated" => true})
      end)

      context = %{
        "method" => "PUT",
        "url" => "https://api.test.com/users/1",
        "headers" => "{}",
        "body" => "{\"name\": \"Bob\"}"
      }

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"updated" => true}
    end

    test "sends PATCH request with JSON body" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"patched" => true})
      end)

      context = %{
        "method" => "PATCH",
        "url" => "https://api.test.com/users/1",
        "headers" => "{}",
        "body" => "{\"name\": \"Carol\"}"
      }

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"patched" => true}
    end

    test "does not add body to GET requests even when body is set" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com",
        "headers" => "{}",
        "body" => "{\"should\" => \"be ignored\"}"
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "does not add body for POST with empty body string" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "POST",
        "url" => "https://api.test.com/notify",
        "headers" => "{}",
        "body" => ""
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "parses and sends custom JSON headers" do
      Req.Test.stub(HttpRequest, fn conn ->
        assert Plug.Conn.get_req_header(conn, "x-api-key") == ["secret"]
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com",
        "headers" => "{\"x-api-key\": \"secret\"}"
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "falls back to empty headers when headers field is invalid JSON" do
      Req.Test.stub(HttpRequest, fn conn ->
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com",
        "headers" => "not-json"
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "uses GET as default method when method is missing" do
      Req.Test.stub(HttpRequest, fn conn ->
        assert conn.method == "GET"
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{"url" => "https://api.test.com", "headers" => "{}"}

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end

    test "routes 2xx responses (non-200) to success output" do
      Req.Test.stub(HttpRequest, fn conn ->
        conn
        |> Plug.Conn.put_resp_content_type("application/json")
        |> Plug.Conn.send_resp(201, Jason.encode!(%{"id" => 42}))
      end)

      context = %{"method" => "POST", "url" => "https://api.test.com/items", "headers" => "{}"}

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"id" => 42}
    end
  end

  describe "handler/2 — error responses" do
    test "routes 4xx responses to the error output" do
      Req.Test.stub(HttpRequest, fn conn ->
        conn
        |> Plug.Conn.put_resp_content_type("application/json")
        |> Plug.Conn.send_resp(404, Jason.encode!(%{"message" => "not found"}))
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com/missing", "headers" => "{}"}

      assert {:ok, result, "error"} = HttpRequest.handler(context, nil)
      assert result["result"]["error"] == "HTTP 404"
    end

    test "routes 5xx responses to the error output" do
      Req.Test.stub(HttpRequest, fn conn ->
        conn
        |> Plug.Conn.put_resp_content_type("application/json")
        |> Plug.Conn.send_resp(500, Jason.encode!(%{"message" => "internal error"}))
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com/broken", "headers" => "{}"}

      assert {:ok, result, "error"} = HttpRequest.handler(context, nil)
      assert result["result"]["error"] == "HTTP 500"
    end

    test "routes 3xx responses (not 2xx) to the error output" do
      Req.Test.stub(HttpRequest, fn conn ->
        conn
        |> Plug.Conn.put_resp_content_type("application/json")
        |> Plug.Conn.send_resp(301, Jason.encode!(%{"location" => "https://other.com"}))
      end)

      context = %{"method" => "GET", "url" => "https://api.test.com/redirect", "headers" => "{}"}

      assert {:ok, result, "error"} = HttpRequest.handler(context, nil)
      assert result["result"]["error"] == "HTTP 301"
    end
  end

  describe "handler/2 — variable interpolation" do
    test "interpolates context keys in URL" do
      Req.Test.stub(HttpRequest, fn conn ->
        assert conn.request_path == "/users/42"
        Req.Test.json(conn, %{"id" => 42})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com/users/{{user_id}}",
        "headers" => "{}",
        "user_id" => "42"
      }

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"id" => 42}
    end

    test "interpolates variables dict values in URL" do
      Req.Test.stub(HttpRequest, fn conn ->
        assert conn.request_path == "/orders/99"
        Req.Test.json(conn, %{"order" => 99})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com/orders/{{order_id}}",
        "headers" => "{}",
        "variables" => %{"order_id" => "99"}
      }

      assert {:ok, result, "success"} = HttpRequest.handler(context, nil)
      assert result["result"] == %{"order" => 99}
    end

    test "leaves unknown placeholders as empty string" do
      Req.Test.stub(HttpRequest, fn conn ->
        assert conn.request_path == "/users/"
        Req.Test.json(conn, %{"ok" => true})
      end)

      context = %{
        "method" => "GET",
        "url" => "https://api.test.com/users/{{missing_key}}",
        "headers" => "{}"
      }

      assert {:ok, _result, "success"} = HttpRequest.handler(context, nil)
    end
  end
end
