defmodule FusionFlowUI.Plugs.RateLimit do
  @moduledoc """
  A simple sliding window rate limiter for the public API using ETS.
  """
  import Plug.Conn
  alias FusionFlowUI.ApiError

  @limit 100
  @window_seconds 60

  def init(opts), do: opts

  def call(conn, _opts) do
    if api_key = conn.assigns[:api_key] do
      check_rate_limit(conn, api_key.id)
    else
      conn
    end
  end

  defp check_rate_limit(conn, key_id) do
    now = System.system_time(:second)
    window = div(now, @window_seconds)
    bucket = {key_id, window}

    ensure_ets_table()

    count = :ets.update_counter(:api_rate_limit, bucket, {2, 1}, {bucket, 0})

    if count > @limit do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(429, Jason.encode!(ApiError.format(:rate_limited, "Too Many Requests")))
      |> halt()
    else
      # Simple garbage collection: occasionally clear the table
      if :rand.uniform(100) == 1 do
        Task.start(fn -> cleanup_ets(window) end)
      end
      conn
    end
  end

  defp ensure_ets_table do
    if :ets.info(:api_rate_limit) == :undefined do
      try do
        :ets.new(:api_rate_limit, [:set, :public, :named_table, write_concurrency: true, read_concurrency: true])
      rescue
        ArgumentError -> :ok
      end
    end
  end

  defp cleanup_ets(current_window) do
    :ets.select_delete(:api_rate_limit, [{{{:"$1", :"$2"}, :_}, [{:<, :"$2", current_window}], [true]}])
  end
end
