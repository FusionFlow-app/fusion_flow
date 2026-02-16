import { LitElement, html, svg, css } from "lit";

export class CustomConnectionElement extends LitElement {
  static get styles() {
    return css`
      svg {
        overflow: visible !important;
        position: absolute;
        pointer-events: none;
        width: 9999px;
        height: 9999px;
      }
      path {
        fill: none;
        stroke-width: 5px;
        stroke: #4338ca;
        pointer-events: auto;
      }
    `;
  }

  static get properties() {
    return {
      path: { type: String }
    };
  }

  render() {
    return html`
      <svg>
        <path d="${this.path}"></path>
      </svg>
    `;
  }
}
