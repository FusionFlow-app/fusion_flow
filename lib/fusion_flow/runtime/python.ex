defmodule FusionFlow.Runtime.Python do
  @behaviour FusionFlow.Runtime.Executor
  require Logger

  def language, do: "python"

  @preamble """
  __ff_has_output__ = False
  __ff_output__ = None

  def variable(name, default=None):
      key = str(name)
      variables = globals().get("variables", {})
      if isinstance(variables, dict) and key in variables:
          return variables[key]
      return globals().get(key, default)

  def variable_required(name):
      key = str(name)
      variables = globals().get("variables", {})
      if isinstance(variables, dict) and key in variables:
          return variables[key]
      if key in globals():
          return globals()[key]
      raise KeyError(f"Variable '{name}' not found in context")

  def set_result(value):
      globals()["__ff_output__"] = value
      globals()["__ff_has_output__"] = True
      return value
  """

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
        Logger.error("Python Execution Error: #{inspect(e)}")
        {:error, Exception.message(e)}
    catch
      kind, reason ->
        {:error, Exception.format(kind, reason, __STACKTRACE__)}
    end
  end
end
