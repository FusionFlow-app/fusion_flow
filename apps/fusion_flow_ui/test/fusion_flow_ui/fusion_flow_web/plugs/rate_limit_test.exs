defmodule FusionFlowUI.Plugs.RateLimitTest do
  use FusionFlowUI.ConnCase, async: true

  alias FusionFlowCore.ApiKeys
  alias FusionFlowUI.Plugs.RateLimit

  import FusionFlowCore.AccountsFixtures

  setup do
    if :ets.info(:api_rate_limit) != :undefined do
      :ets.delete(:api_rate_limit)
    end

    on_exit(fn ->
      if :ets.info(:api_rate_limit) != :undefined do
        :ets.delete(:api_rate_limit)
      end
    end)

    :ok
  end

  test "returns 429 with the standardized error payload when the limit is exceeded", %{conn: conn} do
    user = user_fixture()
    {:ok, %{api_key: api_key}} = ApiKeys.create_api_key(user, %{name: "rate limit", scopes: []})
    window = div(System.system_time(:second), 60)

    :ets.new(:api_rate_limit, [:set, :public, :named_table, write_concurrency: true, read_concurrency: true])
    :ets.insert(:api_rate_limit, {{api_key.id, window}, 100})

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
end
