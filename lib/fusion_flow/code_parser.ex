defmodule FusionFlow.CodeParser do
  @moduledoc """
  Parses user-written code to extract UI definitions using Elixir's AST.
  """

  def parse_ui_definition(code) when is_binary(code) do
    try do
      ast = Code.string_to_quoted!(code)
      ui_fields = extract_ui_block(ast)
      {:ok, ui_fields}
    rescue
      _ -> {:ok, []}
    end
  end

  defp extract_ui_block({:__block__, _, expressions}) do
    expressions
    |> Enum.find_value([], &find_ui_call/1)
  end

  defp extract_ui_block(ast) do
    find_ui_call(ast)
  end

  defp find_ui_call({:ui, _, [[do: {:__block__, _, ui_expressions}]]}) do
    Enum.map(ui_expressions, &parse_ui_expression/1)
  end

  defp find_ui_call({:ui, _, [[do: single_expression]]}) do
    [parse_ui_expression(single_expression)]
  end

  defp find_ui_call(_), do: nil

  defp parse_ui_expression({:select, _, [name, options_list | opts]}) do
    options = extract_list_values(options_list)
    default = extract_option(opts, :default)

    %{
      type: "select",
      name: Atom.to_string(name),
      label: name |> Atom.to_string() |> String.capitalize(),
      options: Enum.map(options, &%{value: &1, label: &1}),
      value: default || List.first(options)
    }
  end

  defp parse_ui_expression({:text, _, [name | opts]}) do
    label = extract_option(opts, :label)
    default = extract_option(opts, :default)

    %{
      type: "text",
      name: Atom.to_string(name),
      label: label || name |> Atom.to_string() |> String.capitalize(),
      value: default || ""
    }
  end

  defp parse_ui_expression({:number, _, [name | opts]}) do
    label = extract_option(opts, :label)
    default = extract_option(opts, :default)

    %{
      type: "number",
      name: Atom.to_string(name),
      label: label || name |> Atom.to_string() |> String.capitalize(),
      value: default || 0
    }
  end

  defp parse_ui_expression({:input, _, [name | opts]}) do
    label = extract_option(opts, :label)

    %{
      type: "input",
      name: Atom.to_string(name),
      label: label || name |> Atom.to_string() |> String.capitalize()
    }
  end

  defp parse_ui_expression({:output, _, [name | opts]}) do
    label = extract_option(opts, :label)

    %{
      type: "output",
      name: Atom.to_string(name),
      label: label || name |> Atom.to_string() |> String.capitalize()
    }
  end

  defp parse_ui_expression(_), do: nil

  defp extract_list_values({:__block__, _, values}) do
    Enum.map(values, &extract_literal/1)
  end

  defp extract_list_values(list) when is_list(list) do
    Enum.map(list, &extract_literal/1)
  end

  defp extract_list_values(_), do: []

  defp extract_literal({:<<>>, _, [value]}) when is_binary(value), do: value
  defp extract_literal(value) when is_binary(value), do: value
  defp extract_literal(value) when is_number(value), do: value
  defp extract_literal(value) when is_atom(value), do: Atom.to_string(value)
  defp extract_literal(_), do: nil

  defp extract_option(opts, key) do
    case Enum.find(opts, fn
           {^key, _} -> true
           _ -> false
         end) do
      {^key, value} -> extract_literal(value)
      _ -> nil
    end
  end
end
