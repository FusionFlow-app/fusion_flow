defmodule FusionFlowCore.Flows do
  @moduledoc """
  The Flows context.
  """

  import Ecto.Query, warn: false
  alias FusionFlowCore.{Policy, Repo}

  alias FusionFlowCore.Accounts.Scope
  alias FusionFlowCore.Flows.Flow
  alias FusionFlowCore.Pagination

  @doc """
  Returns the list of flows.
  """
  def list_flows do
    Repo.all(Flow)
  end

  def list_flows(%Scope{workspace: ws} = scope) when not is_nil(ws) do
    case Policy.authorize(scope, :view_flows) do
      :ok ->
        scope
        |> scope_query()
        |> Repo.all()

      {:error, _} ->
        []
    end
  end

  def list_flows(%Scope{} = scope) do
    scope
    |> scope_query()
    |> Repo.all()
  end

  def list_flows_page(%Scope{} = scope, opts \\ %{}) do
    scope
    |> scope_query()
    |> order_by([f], desc: f.inserted_at)
    |> Pagination.paginate(Repo, opts)
  end

  @doc """
  Gets a single flow.
  Raises `Ecto.NoResultsError` if the Flow does not exist.
  """
  def get_flow!(id), do: Repo.get!(Flow, id)

  def get_flow!(%Scope{workspace: ws} = scope, id) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :view_flows) do
      scope
      |> scope_query()
      |> Repo.get!(id)
    end
  end

  def get_flow!(%Scope{} = scope, id) do
    scope
    |> scope_query()
    |> Repo.get!(id)
  end

  def get_flow(id), do: Repo.get(Flow, id)

  def get_flow(%Scope{workspace: ws} = scope, id) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :view_flows) do
      scope
      |> scope_query()
      |> Repo.get(id)
    end
  end

  def get_flow(%Scope{} = scope, id) do
    scope
    |> scope_query()
    |> Repo.get(id)
  end

  @doc """
  Creates a flow.
  """
  def create_flow(attrs \\ %{}) do
    result =
      %Flow{}
      |> Flow.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, flow} ->
        FusionFlowCore.Webhooks.register_flow(flow)
        {:ok, flow}

      error ->
        error
    end
  end

  def create_flow(
        %Scope{workspace: %FusionFlowCore.Workspaces.Workspace{id: ws_id}, user: user} = scope,
        attrs
      ) do
    with :ok <- Policy.authorize(scope, :create_flows) do
      attrs =
        attrs
        |> Map.new()
        |> Map.drop([:user_id, "user_id", :workspace_id, "workspace_id"])
        |> put_field(:user_id, user && user.id)
        |> put_field(:workspace_id, ws_id)

      create_flow(attrs)
    end
  end

  def create_flow(%Scope{user: %{id: user_id}} = scope, attrs) do
    with :ok <- Policy.authorize(scope, :create_flows) do
      attrs =
        attrs
        |> Map.new()
        |> Map.drop([:user_id, "user_id"])
        |> put_owner_id(user_id)

      create_flow(attrs)
    end
  end

  @doc """
  Updates a flow.
  """
  def update_flow(%Flow{} = flow, attrs) do
    result =
      flow
      |> Flow.changeset(attrs)
      |> Repo.update()

    case result do
      {:ok, updated_flow} ->
        FusionFlowCore.Flows.Cache.invalidate(updated_flow.id)
        FusionFlowCore.Webhooks.register_flow(updated_flow)
        {:ok, updated_flow}

      error ->
        error
    end
  end

  def update_flow(%Scope{workspace: ws} = scope, %Flow{} = flow, attrs) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :edit_flows),
         %Flow{} = flow <- get_flow!(scope, flow.id) do
      attrs =
        attrs
        |> Map.new()
        |> Map.drop([:user_id, "user_id", :workspace_id, "workspace_id"])

      update_flow(flow, attrs)
    end
  end

  def update_flow(%Scope{} = scope, %Flow{} = flow, attrs) do
    flow = get_flow!(scope, flow.id)

    attrs =
      attrs
      |> Map.new()
      |> Map.drop([:user_id, "user_id"])

    update_flow(flow, attrs)
  end

  @doc """
  Deletes a flow.
  """
  def delete_flow(%Flow{} = flow) do
    FusionFlowCore.Flows.Cache.invalidate(flow.id)
    FusionFlowCore.Webhooks.unregister_flow(flow)
    Repo.delete(flow)
  end

  def delete_flow(%Scope{workspace: ws} = scope, %Flow{} = flow) when not is_nil(ws) do
    with :ok <- Policy.authorize(scope, :delete_flows),
         %Flow{} = flow <- get_flow!(scope, flow.id) do
      delete_flow(flow)
    end
  end

  def delete_flow(%Scope{} = scope, %Flow{} = flow) do
    flow = get_flow!(scope, flow.id)
    delete_flow(flow)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking flow changes.
  """
  def change_flow(%Flow{} = flow, attrs \\ %{}) do
    Flow.changeset(flow, attrs)
  end

  def get_first_or_create_default_flow, do: get_or_create_default_flow()

  def get_or_create_default_flow do
    case Repo.one(from f in Flow, order_by: [asc: f.id], limit: 1) do
      nil ->
        case default_owner_id() do
          nil ->
            {:error,
             Flow.changeset(%Flow{}, %{name: "My First Flow", nodes: [], connections: []})}

          user_id ->
            create_flow(%{
              name: "My First Flow",
              nodes: [],
              connections: [],
              user_id: user_id
            })
        end

      flow ->
        {:ok, flow}
    end
  end

  defp scope_query(%Scope{is_system_admin: true}) do
    from(f in Flow)
  end

  defp scope_query(%Scope{workspace: %{id: ws_id}, user: %{id: user_id}}) do
    from f in Flow,
      where: f.workspace_id == ^ws_id or (is_nil(f.workspace_id) and f.user_id == ^user_id)
  end

  defp scope_query(%Scope{workspace: %{id: ws_id}}) do
    from f in Flow, where: f.workspace_id == ^ws_id
  end

  defp scope_query(%Scope{user: %{id: user_id}}) do
    from f in Flow, where: f.user_id == ^user_id
  end

  defp default_owner_id do
    Repo.one(
      from u in FusionFlowCore.Accounts.User,
        order_by: [desc: u.is_system_admin, asc: u.inserted_at, asc: u.id],
        select: u.id,
        limit: 1
    )
  end

  defp put_owner_id(attrs, user_id) do
    put_field(attrs, :user_id, user_id)
  end

  defp put_field(attrs, key_atom, value) do
    key =
      if attrs |> Map.keys() |> Enum.any?(&is_binary/1) do
        to_string(key_atom)
      else
        key_atom
      end

    Map.put(attrs, key, value)
  end

  alias FusionFlowCore.Flows.ExecutionLog

  @doc """
  Creates a flow execution log.
  """
  def create_execution_log(attrs \\ %{}) do
    %ExecutionLog{}
    |> ExecutionLog.changeset(attrs)
    |> Repo.insert()
  end
end
