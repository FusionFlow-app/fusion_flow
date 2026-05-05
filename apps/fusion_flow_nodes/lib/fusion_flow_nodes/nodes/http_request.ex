defmodule FusionFlowNodes.Nodes.HttpRequest do
  use FusionKit.Node

  definition do
    %{
      name: "HTTP Request",
      title: "HTTP Request",
      category: :integration,
      color: "bg-orange-100 text-orange-600",
      description: "Calls an external HTTP endpoint and routes success or error responses.",
      icon: "hero-globe-alt",
      inputs: [:exec],
      outputs: ["success", "error"],
      show: true,
      ui_fields: [
        %{
          type: :select,
          name: :method,
          label: "Method",
          options: [
            %{label: "GET", value: "GET"},
            %{label: "POST", value: "POST"},
            %{label: "PUT", value: "PUT"},
            %{label: "DELETE", value: "DELETE"},
            %{label: "PATCH", value: "PATCH"}
          ],
          default: "GET"
        },
        %{
          type: :text,
          name: :url,
          label: "Endpoint URL",
          default: "https://api.example.com"
        },
        %{
          type: :text,
          name: :headers,
          label: "Headers (JSON)",
          default: "{}"
        },
        %{
          type: :text,
          name: :body,
          label: "Body",
          default: ""
        }
      ]
    }
  end

  @impl true
  def handler(context, input) do
    context = if is_map(input), do: Map.merge(context, input), else: context

    method = String.to_atom(String.downcase(context["method"] || "get"))
    url = interpolate(context["url"] || "", context)
    headers_str = interpolate(context["headers"] || "{}", context)
    body_str = interpolate(context["body"] || "", context)

    headers =
      case Jason.decode(headers_str) do
        {:ok, h} when is_map(h) -> Map.to_list(h)
        _ -> []
      end

    req_opts = [
      method: method,
      url: url,
      headers: headers,
      retry: false
    ]

    req_opts =
      if method in [:post, :put, :patch] and body_str != "" do
        case Jason.decode(body_str) do
          {:ok, json} -> req_opts ++ [json: json]
          {:error, _} -> req_opts ++ [body: body_str]
        end
      else
        req_opts
      end

    case Req.request(req_opts) do
      {:ok, %{status: status, body: body}} when status >= 200 and status < 300 ->
        {:ok, Map.put(context, "result", body), "success"}

      {:ok, %{status: status, body: body}} ->
        {:ok, Map.put(context, "result", %{"error" => "HTTP #{status}", "body" => body}), "error"}

      {:error, reason} ->
        {:ok, Map.put(context, "result", %{"error" => inspect(reason)}), "error"}
    end
  end

  defp interpolate(string, context) do
    Regex.replace(~r/\{\{(.*?)\}\}/, string, fn _, key ->
      trimmed_key = String.trim(key)
      val = get_context_value(context, trimmed_key)
      to_string(val || "")
    end)
  end

  defp get_context_value(context, key) do
    context
    |> Map.get("variables", %{})
    |> Map.get(key, Map.get(context, key))
  end
end
