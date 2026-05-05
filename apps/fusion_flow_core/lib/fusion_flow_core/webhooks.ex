defmodule FusionFlowCore.Webhooks do
  @moduledoc """
  Context for managing runtime webhooks.
  Webhooks are dynamically registered HTTP endpoints that trigger flow execution.

  The user's configured path (e.g. `/webhook/teste`) is normalized to a slug
  (e.g. `teste`). The webhook URL is:
  `http://host:port/api/flows/:flow_id/webhook/teste`
  """

  import Ecto.Query
  alias FusionFlowCore.Repo
  alias FusionFlowCore.Flows.{Flow, Webhook}
  alias FusionFlowCore.Webhooks.Registry

  def register_flow(%Flow{} = flow) do
    webhook_nodes =
      (flow.nodes || [])
      |> Enum.filter(fn node ->
        (node["type"] || node["label"]) == "Webhook"
      end)

    if webhook_nodes == [] do
      unregister_flow(flow)
      :ok
    else
      existing = list_by_flow(flow.id)

      Enum.each(existing, fn wh ->
        Registry.unregister(wh.flow_id, wh.token)
        Repo.delete(wh)
      end)

      Enum.each(webhook_nodes, fn node ->
        controls = node["controls"] || %{}
        method = controls["method"] || "POST"
        path = controls["path"] || "/webhook"
        slug = normalize_path(path)

        %Webhook{flow_id: flow.id}
        |> Webhook.changeset(%{token: slug, method: method, path: path})
        |> Repo.insert!(on_conflict: :replace_all, conflict_target: :token)
        |> then(&Registry.register/1)
      end)

      :ok
    end
  end

  def unregister_flow(%Flow{} = flow) do
    webhooks = list_by_flow(flow.id)

    Enum.each(webhooks, fn wh ->
      Registry.unregister(wh.flow_id, wh.token)
      Repo.delete(wh)
    end)

    :ok
  end

  def get_by_flow_and_slug(flow_id, slug) do
    flow_id = to_integer(flow_id)

    case Registry.lookup(flow_id, slug) do
      {:ok, data} ->
        {:ok, data}

      :error ->
        case Repo.get_by(Webhook, flow_id: flow_id, token: slug) do
          nil ->
            :error

          webhook ->
            Registry.register(webhook)
            {:ok, %{flow_id: webhook.flow_id, method: webhook.method, token: webhook.token}}
        end
    end
  end

  def list_by_flow(flow_id) do
    Webhook
    |> where([w], w.flow_id == ^flow_id)
    |> Repo.all()
  end

  def sync_all do
    webhooks = Repo.all(Webhook)
    Enum.each(webhooks, &Registry.register/1)
    {:ok, length(webhooks)}
  end

  @doc """
  Normalizes a user path to a slug for routing.
  Strips leading slashes and common prefixes like `/webhook/` or `/webhooks/`.

  ## Examples

      normalize_path("/webhook/teste")  => "teste"
      normalize_path("/webhooks/my/api") => "my/api"
      normalize_path("my-hook")         => "my-hook"
  """
  def normalize_path(path) do
    path
    |> String.trim_leading("/")
    |> String.replace_prefix("webhooks/", "")
    |> String.replace_prefix("webhook/", "")
    |> String.trim_leading("/")
    |> String.trim_trailing("/")
    |> case do
      "" -> "default"
      slug -> slug
    end
  end

  defp to_integer(val) when is_integer(val), do: val
  defp to_integer(val) when is_binary(val), do: String.to_integer(val)
end
