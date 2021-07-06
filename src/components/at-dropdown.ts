import type { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import { LitElement, TemplateResult, css, customElement, html, property } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-item/paper-item-body';
import '@polymer/paper-listbox/paper-listbox';

@customElement('at-dropdown')
export class AtDropdown extends LitElement {
	@property({ type: Array, attribute: 'list' }) declare list?: Partial<{
		id: string | number;
		title: TemplateResult | string;
		item: any;
		twoLines: boolean;
	}>[];
	@property({ type: String }) declare name?: string;
	@property({ type: String, reflect: true }) declare selected?: string;

	static styles = css`
		paper-dropdown-menu {
			border: none;
		}
	`;

	render() {
		if (!this.list) return;
		return html`
			<custom-style>
				<style is="custom-style">
					paper-dropdown-menu.custom {
						--paper-input-container-label: {
							display: none;
						}
						--paper-input-container-input: {
							color: #999999;
							font-style: normal;
							text-transform: uppercase;
						}
						/* Only show the underline when focused. */
						--paper-input-container-underline: {
							display: none;
						}
						--paper-input-container-underline-focus: {
							display: none;
						}
					}

					paper-item.dropdown-item {
						--paper-item: {
							font-family: Roboto;
							font-size: 15px;
							font-style: normal;
							font-weight: 400;
							line-height: 18px;
							letter-spacing: 0px;
							text-align: left;
							color: #666666;
						}
					}
				</style>
			</custom-style>

			<paper-dropdown-menu class="custom" label="Dinosaurs" vertical-offset="60">
				<paper-listbox
					@iron-select="${(e: Event & { target: PaperListboxElement }) => {
						this.dispatchEvent(
							new CustomEvent('on-change', {
								bubbles: true,
								composed: true,
								detail: e.target.selected,
							}),
						);
					}}"
					attr-for-selected="key"
					attr-or-property-name="key"
					slot="dropdown-content"
					selected="${this.selected}"
				>
					${this.list.map(
						(item) =>
							html`<paper-item key=${ifDefined(item.id)} class="dropdown-item">
								<paper-item-body ?two-lines="${item.twoLines}"
									>${typeof item.title === 'string'
										? html`${item.title}`
										: item.title}</paper-item-body
								></paper-item
							>`,
					)}
				</paper-listbox>
			</paper-dropdown-menu>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'at-dropdown': AtDropdown;
	}
}
