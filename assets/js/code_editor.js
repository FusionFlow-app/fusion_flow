export const CodeEditorHook = {
    mounted() {
        const container = this.el;
        const textarea = container.querySelector('textarea');
        if (!textarea) return;

        const editorContainer = document.createElement('div');
        editorContainer.style.height = '100%';
        editorContainer.style.width = '100%';
        editorContainer.style.minHeight = '400px';

        textarea.style.display = 'none';
        container.appendChild(editorContainer);

        const currentVariables = JSON.parse(container.dataset.variables || "[]");
        window.__fusionFlowCurrentVariables = currentVariables;

        const initMonaco = () => {
            if (window.require) {
                window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

                window.require(['vs/editor/editor.main'], () => {
                    if (!window.__elixirCompletionRegistered) {
                        try {
                            monaco.languages.registerCompletionItemProvider('elixir', {
                                provideCompletionItems: (model, position) => {
                                    const suggestions = [
                                        {
                                            label: 'variable',
                                            kind: monaco.languages.CompletionItemKind.Function,
                                            insertText: 'variable',
                                            documentation: 'Get a variable from context (returns nil if missing)',
                                            detail: 'FusionFlow.Nodes.Eval.variable/1'
                                        },
                                        {
                                            label: 'variable!',
                                            kind: monaco.languages.CompletionItemKind.Function,
                                            insertText: 'variable!',
                                            documentation: 'Get a variable from context (raises if missing)',
                                            detail: 'FusionFlow.Nodes.Eval.variable!/1'
                                        }
                                    ];

                                    const availableVars = window.__fusionFlowCurrentVariables || [];
                                    availableVars.forEach(varName => {
                                        suggestions.push({
                                            label: `:${varName}`,
                                            kind: monaco.languages.CompletionItemKind.Constant,
                                            insertText: `:${varName}`,
                                            documentation: `Variable from flow: ${varName}`,
                                            detail: 'Atom'
                                        });
                                    });

                                    return { suggestions: suggestions };
                                }
                            });
                            window.__elixirCompletionRegistered = true;
                        } catch (e) {
                            console.error("Failed to register completion provider:", e);
                        }
                    } else {
                        // Force update if needed, but the provider pulls from global window var so it works
                    }

                    this.editor = monaco.editor.create(editorContainer, {
                        value: textarea.value,
                        language: 'elixir',
                        theme: 'vs-dark',
                        automaticLayout: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        fontFamily: "'Fira Code', Consolas, 'Courier New', monospace"
                    });

                    this.editor.onDidChangeModelContent(() => {
                        textarea.value = this.editor.getValue();
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                });
            }
        };

        if (!window.require) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
            script.async = true;
            script.onload = initMonaco;
            document.body.appendChild(script);
        } else {
            initMonaco();
        }
    },

    destroyed() {
        if (this.editor) {
            this.editor.dispose();
        }
    }
};
