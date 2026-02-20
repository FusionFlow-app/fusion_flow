defmodule FusionFlow.AI do
  def stream_text(messages, opts \\ []) do
    model_id = Keyword.get(opts, :model, "gpt-4o-mini")
    system = Keyword.get(opts, :system)
    temperature = Keyword.get(opts, :temperature)

    messages =
      if is_list(messages) and not is_nil(system) do
        [%{role: "system", content: system} | messages]
      else
        messages
      end

    ai_opts =
      [
        model:
          AI.openai(model_id,
            api_key: System.get_env("OPENAI_API_KEY")
          ),
        mode: :event
      ]
      |> append_prompt_or_messages(messages)
      |> append_if(temperature, :temperature, temperature)

    AI.stream_text(Map.new(ai_opts))
  end

  defp append_prompt_or_messages(opts, input) when is_binary(input) do
    Keyword.put(opts, :prompt, input)
  end

  defp append_prompt_or_messages(opts, input) when is_list(input) do
    Keyword.put(opts, :messages, input)
  end

  defp append_if(keywords, condition, key, value) do
    if condition do
      Keyword.put(keywords, key, value)
    else
      keywords
    end
  end
end
