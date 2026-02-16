defmodule FusionFlow.Nodes.HttpRequest do
  def definition do
    %{
      name: "HTTP Request",
      category: :integration,
      icon: "⇄",
      inputs: [:exec],
      outputs: ["success", "error"],
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
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            select :method, ["GET", "POST", "PUT", "DELETE", "PATCH"], default: "GET"
            text :url, label: "Endpoint URL", default: "https://api.example.com"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    method = String.to_atom(String.downcase(context["method"] || "get"))
    url = context["url"]

    if Code.ensure_loaded?(Req) do
      case Req.request(method: method, url: url) do
        {:ok, response} -> {:ok, response.body}
        {:error, error} -> {:error, error}
      end
    end
  end
end
