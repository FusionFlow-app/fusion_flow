defmodule FusionFlowCore.Flows do
  @moduledoc """
  The Flows context.
  """

  import Ecto.Query, warn: false
  alias FusionFlowCore.Repo

  alias FusionFlowCore.Accounts.Scope
  alias FusionFlowCore.Flows.Flow
  alias FusionFlowCore.Pagination

  @doc """
  Returns the list of flows.

  ## Examples

      iex> list_flows()
      [%Flow{}, ...]

  """
  def list_flows do
    Repo.all(Flow)
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

  ## Examples

      iex> get_flow!(123)
      %Flow{}

      iex> get_flow!(456)
      ** (Ecto.NoResultsError)

  """
  def get_flow!(id), do: Repo.get!(Flow, id)

  def get_flow!(%Scope{} = scope, id) do
    scope
    |> scope_query()
    |> Repo.get!(id)
  end

  def get_flow(id), do: Repo.get(Flow, id)

  def get_flow(%Scope{} = scope, id) do
    scope
    |> scope_query()
    |> Repo.get(id)
  end

  @doc """
  Creates a flow.

  ## Examples

      iex> create_flow(%{field: value})
      {:ok, %Flow{}}

      iex> create_flow(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

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

  def create_flow(%Scope{user: %{id: user_id}}, attrs) do
    attrs =
      attrs
      |> Map.new()
      |> Map.drop([:user_id, "user_id"])
      |> put_owner_id(user_id)

    create_flow(attrs)
  end

  @doc """
  Updates a flow.

  ## Examples

      iex> update_flow(flow, %{field: new_value})
      {:ok, %Flow{}}

      iex> update_flow(flow, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

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

  ## Examples

      iex> delete_flow(flow)
      {:ok, %Flow{}}

      iex> delete_flow(flow)
      {:error, %Ecto.Changeset{}}

  """
  def delete_flow(%Flow{} = flow) do
    FusionFlowCore.Flows.Cache.invalidate(flow.id)
    FusionFlowCore.Webhooks.unregister_flow(flow)
    Repo.delete(flow)
  end

  def delete_flow(%Scope{} = scope, %Flow{} = flow) do
    flow = get_flow!(scope, flow.id)
    delete_flow(flow)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking flow changes.

  ## Examples

      iex> change_flow(flow)
      %Ecto.Changeset{data: %Flow{}}

  """
  def change_flow(%Flow{} = flow, attrs \\ %{}) do
    Flow.changeset(flow, attrs)
  end

  @doc """
  Gets the first flow or creates a default one if none exist.
  """
  def get_first_or_create_default_flow do
    case Repo.one(from f in Flow, limit: 1) do
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
    key =
      if attrs |> Map.keys() |> Enum.any?(&is_binary/1) do
        "user_id"
      else
        :user_id
      end

    Map.put(attrs, key, user_id)
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
