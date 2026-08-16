defmodule FusionFlowUI.Plugs.RateLimitTest do
  use FusionFlowUI.ConnCase, async: false

  alias FusionFlowCore.ApiKeys
  alias FusionFlowUI.Plugs.RateLimit

  import FusionFlowCore.AccountsFixtures

  setup do
    ensure_ets_table()
    :ok
  end

  test "returns 429 with the standardized error payload when the limit is exceeded", %{conn: conn} do
    user = user_fixture()
    {:ok, %{api_key: api_key}} = ApiKeys.create_api_key(user, %{name: "rate limit", scopes: []})
    window = div(System.system_time(:second), 60)
    bucket = {api_key.id, window}

    ensure_ets_table()
    :ets.insert(:api_rate_limit, {bucket, 100})

    on_exit(fn ->
      if :ets.info(:api_rate_limit) != :undefined do
        :ets.delete(:api_rate_limit, bucket)
      end
    end)

    conn =
      conn
      |> Plug.Conn.assign(:api_key, api_key)
      |> RateLimit.call([])

    assert conn.halted
    assert conn.status == 429

    assert Jason.decode!(conn.resp_body) == %{
             "error" => %{"code" => "rate_limited", "message" => "Too Many Requests"}
           }
  end

  defp ensure_ets_table do
    if :ets.info(:api_rate_limit) == :undefined do
      try do
        :ets.new(:api_rate_limit, [
          :set,
          :public,
          :named_table,
          write_concurrency: true,
          read_concurrency: true
        ])
      rescue
        ArgumentError -> :ok
      end
    end
  end
end
