defmodule FusionFlowRuntime.Runtime.Python do
  @behaviour FusionFlowRuntime.Runtime.Executor
  require Logger

  def language, do: "python"

  @preamble_path Path.expand("../../priv/runtime/python_preamble.py", __DIR__)
  @external_resource @preamble_path
  @preamble File.read!(@preamble_path)

  def execute(code, context) do
    try do
      {_, globals} = Pythonx.eval(@preamble, context)
      {result, globals} = Pythonx.eval(code || "", globals)

      result =
        case globals["__ff_has_output__"] do
          nil ->
            result

          flag_obj ->
            if Pythonx.decode(flag_obj) do
              globals["__ff_output__"]
            else
              result
            end
        end

      final_result =
        cond do
          is_nil(result) ->
            nil

          is_struct(result, Pythonx.Object) ->
            Pythonx.decode(result)

          true ->
            result
        end

      case final_result do
        %{} = new_ctx -> {:ok, new_ctx}
        other -> {:result, other}
      end
    rescue
      e ->
        maybe_log_python_error(e)
        {:error, Exception.message(e)}
    catch
      kind, reason ->
        {:error, Exception.format(kind, reason, __STACKTRACE__)}
    end
  end

  defp maybe_log_python_error(error) do
    if Application.get_env(:fusion_flow_runtime, :log_python_execution_errors?, true) do
      Logger.error("Python Execution Error: #{inspect(error)}")
    end
  end
end
