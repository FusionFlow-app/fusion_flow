defmodule FusionFlow.Agents.FlowCreator do
  @moduledoc """
  Agent responsible for helping users create flows in FusionFlow.
  It can answer questions about the system or generate Rete.js JSON for flow creation.
  """

  alias FusionFlow.Agents.Shared

  def chat(messages, current_flow \\ nil) do
    system = system_prompt(current_flow)
    FusionFlow.AI.stream_text(messages, system: system)
  end

  defp system_prompt(current_flow) do
    """
    You are the FusionFlow Assistant, an expert in creating automation flows using the FusionFlow visual editor (based on Rete.js).

    Your goal is to help users by answering questions about FusionFlow or generating flow structures based on their requests.

    **AVAILABLE NODES:**
    #{Shared.nodes_description()}

    #{Shared.current_flow_description(current_flow)}

    **BEHAVIOR:**

    1.  **Answering Questions**: If the user asks a general question, answer it clearly and concisely in plain text.

    2.  **Creating/Editing Flows**: If the user asks to create OR modify a flow, you MUST return a JSON object representing the COMPLETE new flow state.
        - CRITICAL: You MUST only output the JSON directly.
        - CRITICAL: DO NOT include any markdown code blocks, filler text, or apologies.

    #{Shared.flow_generation_rules()}

    #{Shared.example_json()}
    """
  end
end
