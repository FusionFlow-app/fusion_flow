import "phoenix_html"
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import topbar from "../vendor/topbar"
import { CodeEditorHook } from "./code_editor"

const hooks = {
  CodeEditor: CodeEditorHook,
  Rete: {
    async mounted() {
      const { createEditor } = await import("./rete_editor.js");
      const container = this.el;
      const editor = await createEditor(container);

      this.handleEvent("add_node", async ({ name, definition, data }) => {
        if (editor.addNode) {
          await editor.addNode(name, definition, data);
        }
      });

      this.handleEvent("request_graph_data", async () => {
        if (editor.exportData) {
          const data = await editor.exportData();
          this.pushEvent("save_graph_data", { data });
        }
      });

      if (editor.onDrop) {
        editor.onDrop(async (name, position) => {
            this.pushEvent("get_node_definition", { name }, async ({ definition }) => {
                const node_data = {
                    id: `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    label: name,
                    position: position
                };
                
                await editor.addNode(name, definition, node_data);
                this.pushEvent("node_added_internally", { name, data: node_data });
            });
        });
      }

      const handleDragStart = (e) => {
        const btn = e.target.closest('button[draggable="true"]');
        if (!btn) return;

        const nodeName = btn.dataset.nodeName;
        if (nodeName) {
            e.dataTransfer.setData("application/vnd.fusionflow.node", nodeName);
            e.dataTransfer.effectAllowed = "copy";

            // Create a custom drag image that looks like a node
            const dragImage = document.createElement('div');
            const isDark = document.documentElement.classList.contains('dark');
            dragImage.style.width = '88px';
            dragImage.style.height = '88px';
            dragImage.style.backgroundColor = isDark ? '#18181b' : 'white';
            dragImage.style.border = `3px solid ${isDark ? '#27272a' : '#e2e8f0'}`;
            dragImage.style.borderRadius = '50%';
            dragImage.style.boxShadow = isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            dragImage.style.display = 'flex';
            dragImage.style.alignItems = 'center';
            dragImage.style.justifyContent = 'center';
            
            const icon = document.createElement('div');
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.backgroundColor = '#6366f1';
            icon.style.maskImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-10.5v10.5\" /></svg>')";
            icon.style.maskRepeat = 'no-repeat';
            icon.style.maskSize = 'contain';
            
            dragImage.appendChild(icon);
            document.body.appendChild(dragImage);

            // Set drag image centered on cursor
            e.dataTransfer.setDragImage(dragImage, 44, 44);

            // Cleanup immediately after the browser sets the drag image
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        }
      };

      // Use event delegation for draggables to avoid MutationObserver performance issues
      document.addEventListener('dragstart', handleDragStart);

      this.handleEvent("request_save_and_run", async () => {
        if (editor.exportData) {
          const data = await editor.exportData();
          this.pushEvent("save_and_run", { data });
        }
      });

      this.handleEvent("load_graph_data", async ({ nodes, connections, definitions }) => {
        if (editor.importData) {
          await editor.importData({ nodes, connections, definitions });
        } else {
          console.error("Editor importData method missing!");
        }
      });

      this.handleEvent("update_node_code", ({ nodeId, code_elixir, code_python, fieldName }) => {
        if (editor.updateNodeCode) {
          editor.updateNodeCode(nodeId, code_elixir, code_python, fieldName);
        }
      });

      this.handleEvent("update_node_data", ({ nodeId, data }) => {
        if (editor.updateNodeData) {
          editor.updateNodeData(nodeId, data);
        }
      });

      this.handleEvent("update_node_label", ({ nodeId, label }) => {
        if (editor.updateNodeLabel) {
          editor.updateNodeLabel(nodeId, label);
        }
      });

      this.handleEvent("update_node_sockets", ({ nodeId, inputs, outputs }) => {
        if (editor.updateNodeSockets) {
          editor.updateNodeSockets(nodeId, { inputs, outputs });
        }
      });

      if (editor.onChange) {
        editor.onChange(() => {
          this.pushEvent("graph_changed", {});
        });
      }

      if (editor.onCodeEdit) {
        editor.onCodeEdit((nodeId, code_elixir, code_python, fieldName, language, variables) => {
          this.pushEvent("open_code_editor", { nodeId, code_elixir, code_python, fieldName, language, variables });
        });
      }

      if (editor.onErrorDetails) {
        editor.onErrorDetails((nodeId, message) => {
          this.pushEvent("show_error_details", { nodeId, message });
        });
      }

      if (editor.onNodeConfig) {
        editor.onNodeConfig((nodeId, nodeData) => {
          this.pushEvent("open_node_config", { nodeId, nodeData });
        });
      }

      this.handleEvent("highlight_node_error", ({ nodeId, message }) => {
        if (editor.addNodeError) {
          editor.addNodeError(nodeId, message);
        } else {
          console.error("Editor addNodeError method missing!");
        }
      });

      this.handleEvent("clear_node_errors", () => {
        if (editor.clearNodeErrors) {
          editor.clearNodeErrors();
        }
      });

      this.destroyed = () => {
        if (editor.destroy) editor.destroy();
      };

      this.pushEvent("client_ready", {});
    },
  },
  ScrollToBottom: {
    mounted() {
      this.el.scrollTop = this.el.scrollHeight;
    },
    updated() {
      this.el.scrollTop = this.el.scrollHeight;
    },
  },
  FocusInput: {
    mounted() {
      this.el.focus();
    },
    updated() {
      this.el.focus();
    }
  }
}

const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: { _csrf_token: csrfToken },
  hooks: hooks,
})

topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

liveSocket.connect()

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const html = document.documentElement;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  } else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  }
}

initTheme();

window.liveSocket = liveSocket

if (process.env.NODE_ENV === "development") {
  window.addEventListener("phx:live_reload:attached", ({ detail: reloader }) => {
    reloader.enableServerLogs()

    let keyDown
    window.addEventListener("keydown", e => keyDown = e.key)
    window.addEventListener("keyup", _e => keyDown = null)
    window.addEventListener("click", e => {
      if (keyDown === "c") {
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtCaller(e.target)
      } else if (keyDown === "d") {
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtDef(e.target)
      }
    }, true)

    window.liveReloader = reloader
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const node1 = document.getElementById('node-1');
  const node2 = document.getElementById('node-2');
  const path = document.getElementById('connection-path');

  if (node1 && node2 && path) {
    const container = path.closest('svg');
    let animationFrameId;

    function updatePath() {
      const containerRect = container.getBoundingClientRect();
      const r1 = node1.getBoundingClientRect();
      const r2 = node2.getBoundingClientRect();

      const x1 = r1.x + r1.width - containerRect.x;
      const y1 = r1.y + r1.height / 2 - containerRect.y;

      const x2 = r2.x - containerRect.x;
      const y2 = r2.y + r2.height / 2 - containerRect.y;

      const controlPointX1 = x1 + (x2 - x1) / 2;
      const controlPointX2 = x1 + (x2 - x1) / 2;

      path.setAttribute('d', `M ${x1} ${y1} C ${controlPointX1} ${y1} ${controlPointX2} ${y2} ${x2} ${y2}`);

      animationFrameId = requestAnimationFrame(updatePath);
    }

    animationFrameId = requestAnimationFrame(updatePath);
  }
});
