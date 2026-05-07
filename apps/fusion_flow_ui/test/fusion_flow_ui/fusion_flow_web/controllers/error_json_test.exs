defmodule FusionFlowUI.ErrorJSONTest do
  use FusionFlowUI.ConnCase, async: true

  test "renders 404" do
    assert FusionFlowUI.ErrorJSON.render("404.json", %{}) ==
             %{error: %{code: "not_found", message: "Not Found"}}
  end

  test "renders 500" do
    assert FusionFlowUI.ErrorJSON.render("500.json", %{}) ==
             %{error: %{code: "internal_server_error", message: "Internal Server Error"}}
  end
end
