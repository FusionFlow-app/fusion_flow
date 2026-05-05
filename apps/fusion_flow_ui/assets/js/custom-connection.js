import { LitElement, html, svg, css } from "lit";

export class CustomConnectionElement extends LitElement {
  static get styles() {
    return css`
      :host {
        cursor: pointer;
        display: block;
      }
      svg {
        overflow: visible !important;
        position: absolute;
        pointer-events: none;
        width: 9999px;
        height: 9999px;
      }
      path.hit-area {
        fill: none;
        stroke: transparent;
        stroke-width: 24px;
        pointer-events: auto;
        cursor: pointer;
      }
      path.visible {
        fill: none;
        stroke-width: 5px;
        stroke: #4338ca;
        pointer-events: none;
        transition: stroke-width 0.15s ease, stroke 0.15s ease;
      }
      path.visible.selected {
        stroke: oklch(58% 0.233 277.117);
        stroke-width: 7px;
      }
      path.visible:hover {
        stroke-width: 6px;
      }
    `;
  }

  static get properties() {
    return {
      path: { type: String },
      connectionId: { type: String },
      selected: { type: Boolean }
    };
  }

  render() {
    return html`
      <svg>
        <path class="hit-area" d="${this.path}" @click=${this._onClick} @contextmenu=${this._onContextMenu}></path>
        <path
          class="visible ${this.selected ? 'selected' : ''}"
          d="${this.path}"
        ></path>
      </svg>
    `;
  }

  _onClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('connection-click', {
      detail: { connectionId: this.connectionId, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey },
      bubbles: true,
      composed: true
    }));
  }

  _onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('connection-contextmenu', {
      detail: { connectionId: this.connectionId, clientX: e.clientX, clientY: e.clientY },
      bubbles: true,
      composed: true
    }));
  }
}
