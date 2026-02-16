import { LitElement, html, css } from "lit";

export class CustomSocketElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 24px;
        height: 24px;
      }
      .socket {
        width: 100% !important;
        height: 100% !important;
        background: #4338ca !important;
        border: 2px solid white !important;
        border-radius: 50%;
        cursor: pointer;
        z-index: 50;
        box-sizing: border-box;
        display: block !important;
      }
      .socket:hover {
        background: #3730a3 !important;
        border-width: 3px !important;
        transform: scale(1.1);
      }
      
      :host-context(.dark) .socket {
        border-color: #334155;
      }
      :host(.multiple) {
        border-color: yellow;
      }
      :host(.multiple) {
        border-color: yellow;
      }
    `;
  }

  static get properties() {
    return {
      data: { type: Object }
    };
  }

  render() {
    return html`
        <div class="socket" title="${this.data?.payload?.label || ''}"></div>
        `;
  }
}
