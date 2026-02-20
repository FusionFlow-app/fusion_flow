import { LitElement, html, css } from "lit";

export class CustomControlElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 4px 0;
      }
      
      :host {
        --input-bg: #f8fafc;
        --input-border: #e2e8f0;
        --input-text: #1e293b;
        --input-placeholder: #94a3b8;
      }

      :host-context(.dark) {
        --input-bg: #334155;
        --input-border: #475569;
        --input-text: #f1f5f9;
        --input-placeholder: #94a3b8;
      }
      
      input, textarea, select {
        width: 100%;
        border-radius: 6px;
        background-color: var(--input-bg);
        padding: 8px 10px;
        border: 1px solid var(--input-border);
        font-size: 13px;
        line-height: 1.5;
        box-sizing: border-box;
        color: var(--input-text);
        font-family: inherit;
        transition: all 0.2s;
        outline: none;
      }

      input::placeholder, textarea::placeholder {
        color: var(--input-placeholder);
      }

      input:focus, textarea:focus, select:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }

      textarea {
          resize: vertical;
          min-height: 80px;
          font-family: monospace;
      }
      
      .label {
        font-size: 11px;
        color: var(--input-label, #64748b);
        margin-bottom: 2px;
        font-weight: 600;
        text-transform: uppercase;
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      type: { type: String },
      value: { type: String },
      readonly: { type: Boolean },
      label: { type: String },
      options: { type: Array },
      onChange: { attribute: false },
      onClick: { attribute: false }
    };
  }

  render() {
    const labelTemplate = (this.label && this.type !== 'code-icon' && this.type !== 'code-button')
      ? html`<div class="label">${this.label}</div>`
      : '';

    if (this.type === 'area') {
      return html`
            ${labelTemplate}
            <textarea
                @pointerdown=${(e) => e.stopPropagation()}
                @input=${(e) => this.onChange && this.onChange(e.target.value)}
                .value=${this.value || ''}
                ?readonly=${this.readonly}
                placeholder=${this.label || 'Code...'}
            ></textarea>
          `;
    }
    if (this.type === 'code-icon') {
      return html``;
    }
    if (this.type === 'code-button') {
      return html`
            <button
                @pointerdown=${(e) => e.stopPropagation()}
                @click=${(e) => {
          if (this.onClick) this.onClick();
        }}
                style="width: 100%; box-sizing: border-box; background: #4338ca; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer;"
            >
                ${this.label || 'Edit Code'}
            </button>
          `;
    }
    if (this.type === 'select') {
      const options = this.options || [];
      return html`
        ${labelTemplate}
        <select
          @pointerdown=${(e) => e.stopPropagation()}
          @change=${(e) => this.onChange && this.onChange(e.target.value)}
          .value=${this.value || ''}
        >
          ${options.map(opt => {
        const value = typeof opt === 'object' ? opt.value : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        return html`<option value=${value} ?selected=${this.value === value}>${label}</option>`
      })}
        </select>
      `;
    }
    return html`
      ${labelTemplate}
      <input
        type=${this.type || "text"}
        @pointerdown=${(e) => e.stopPropagation()} 
        @input=${(e) => this.onChange && this.onChange(e.target.value)}
        .value=${this.value || ''}
        ?readonly=${this.readonly}
        placeholder=${this.label || ''}
      />
    `;
  }
}
