import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
/**
 * Icon Safelist for Tailwind CSS
 * Since node icons are used dynamically via classes, we need to list them here
 * so Tailwind doesn't purge them during build.
 * 
 * hero-play hero-code-bracket hero-arrows-right-left hero-globe-alt 
 * hero-chat-bubble-bottom-center-text hero-variable hero-check-circle 
 * hero-cube hero-link hero-circle-stack hero-arrows-pointing-out 
 * hero-arrows-pointing-in hero-magnifying-glass hero-clock 
 * hero-adjustments-horizontal hero-tag
 */

export class CustomNodeElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      data: { type: Object },
      emit: { attribute: false },
      selected: { type: Boolean, reflect: true },
      onConfig: { attribute: false },
      onDelete: { attribute: false },
      error: { type: String, reflect: true },
      onErrorDetails: { attribute: false }
    };
  }

  static get styles() {
    return css`
      custom-node {
        display: block;
        width: 88px;
        height: 88px;
        position: relative;
      }
      .circular-node {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--node-bg, white);
        border: 3px solid var(--node-border, #e2e8f0);
        border-radius: 50%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        width: 88px;
        height: 88px;
        box-sizing: border-box;
        position: relative;
        user-select: none;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
        z-index: 10;
      }
      .circular-node:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .selected .circular-node {
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4) !important;
        transform: scale(1.05);
      }
      .dark .circular-node {
        --node-bg: #18181b;
        --node-border: #27272a;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      }
      .icon-container {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .icon-container span {
        width: 35px;
        height: 35px;
      }
      .socket-container {
        position: absolute;
        top: 50%;
        margin-top: -12px; /* Half of 24px height for perfect centering */
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }
      .socket-container.left {
        left: -12px;
      }
      .socket-container.right {
        right: -12px;
      }
      .error-node-btn {
        position: absolute;
        top: -4px;
        left: -4px;
        background: #ef4444;
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        animation: node-pulse 2s infinite;
      }
      @keyframes node-pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      .node-actions-container {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        padding: 4px 8px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 50;
        pointer-events: auto;
      }
      .dark .node-actions-container {
        background: #18181b;
        border-color: #27272a;
      }
      custom-node:hover .node-actions-container,
      .node-actions-container:hover {
        opacity: 1;
        transform: translateX(-50%) translateY(2px);
      }
      .node-action-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.1s, filter 0.2s;
        border: none;
        color: white;
      }
      .node-action-btn:hover {
        transform: scale(1.1);
        filter: brightness(1.1);
      }
      .node-action-btn.delete {
        background: #f87171;
      }
      .node-action-btn.config {
        background: #6366f1;
      }
      .node-name-hover {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(31, 41, 55, 0.9);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: none;
        z-index: 60;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      }
      .dark .node-name-hover {
        background: rgba(24, 24, 27, 0.95);
        border: 1px solid rgba(63, 63, 70, 0.5);
      }
      custom-node:hover .node-name-hover {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
      }
      .language-badge {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: #4f46e5;
        color: white;
        font-size: 9px;
        font-weight: 800;
        padding: 2px 4px;
        border-radius: 4px;
        text-transform: uppercase;
        border: 1px solid white;
        line-height: 1;
        z-index: 20;
        pointer-events: none;
      }
      .dark .language-badge {
        border-color: #18181b;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    // Inject styles into the global scope for Light DOM support
    if (!document.getElementById('custom-node-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-node-styles';
      style.textContent = CustomNodeElement.styles.cssText;
      document.head.appendChild(style);
    }
  }

  render() {
    const inputs = Object.entries(this.data.inputs || {});
    const outputs = Object.entries(this.data.outputs || {});

    const category = this.data.category || 'default';
    const colors = {
      'trigger': '#10b981',
      'flow_control': '#6366f1',
      'code': '#818cf8',
      'data_manipulation': '#f59e0b',
      'integration': '#ec4899',
      'utility': '#64748b',
      'default': '#64748b'
    };
    const nodeColor = colors[category] || colors['default'];
    const language = this.data.controls?.language?.value;
    const langLabel = language === 'elixir' ? 'EX' : (language === 'python' ? 'PY' : null);

    return html`
      <div class="node-name-hover">${this.data.label || this.data.name}</div>

      <div 
        class="circular-node" 
        style="border-color: ${nodeColor}aa"
        @pointerdown=${this._onPointerDown}
        @click=${this._onClick}
      >
        ${this.error ? html`
          <div 
            class="error-node-btn"
            style="position: absolute; top: -4px; left: -4px; background: #ef4444; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; z-index: 50; animation: node-pulse 2s infinite;"
            @click=${(e) => {
              e.stopPropagation();
              if (this.onErrorDetails) this.onErrorDetails();
            }}
          >!</div>
        ` : ''}

        <div class="icon-container" style="color: ${nodeColor}">
          <span class="${this.data.icon || 'hero-cube'}"></span>
        </div>

        ${langLabel ? html`
          <div class="language-badge">${langLabel}</div>
        ` : ''}
      </div>

      <div class="node-actions-container">
        <div 
          class="node-action-btn config" 
          title="Configure Node"
          @pointerdown=${(e) => e.stopPropagation()}
          @mousedown=${(e) => e.stopPropagation()}
          @click=${(e) => {
            e.stopPropagation();
            if (this.onConfig) this.onConfig();
          }}
        >
          <span class="hero-cog-6-tooth w-4 h-4"></span>
        </div>

        <div 
          class="node-action-btn delete" 
          title="Delete Node"
          @pointerdown=${(e) => e.stopPropagation()}
          @mousedown=${(e) => e.stopPropagation()}
          @click=${(e) => {
            e.stopPropagation();
            if (this.onDelete) this.onDelete();
          }}
        >
          <span class="hero-x-mark w-4 h-4"></span>
        </div>
      </div>

      ${repeat(inputs, ([key]) => key, ([key, input]) => html`
        <div class="socket-container left" key="input-${key}" data-key="${key}" data-side="input"></div>
      `)}

      ${repeat(outputs, ([key]) => key, ([key, output]) => html`
        <div class="socket-container right" key="output-${key}" data-key="${key}" data-side="output"></div>
      `)}
    `;
  }

  _onPointerDown(e) {
    this._clickHandled = false;
    this._downTime = Date.now();
  }

  _onClick(e) {
    const duration = Date.now() - this._downTime;
    // Only trigger config if it was a quick click (not a long press/drag)
    if (duration < 300) {
      if (this.onConfig) {
        this.onConfig();
        this._clickHandled = true;
      }
    }
  }

  bindSocket(el, type, key) {
    if (el && this.data && this.emit) {
      if (el._bound) return;
      el._bound = true;

      this.emit({
        type: 'render',
        data: {
          type: 'socket',
          element: el,
          payload: type === 'input' ? this.data.inputs[key] : this.data.outputs[key],
          side: type,
          key: key,
          nodeId: this.data.id
        }
      });
    }
  }

  updated() {
    this.querySelectorAll('.socket-container').forEach(el => {
      const type = el.dataset.side;
      const key = el.dataset.key;
      this.bindSocket(el, type, key);
    });
  }
}
