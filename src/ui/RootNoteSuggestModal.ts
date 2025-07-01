import { App, FuzzySuggestModal, TFile } from "obsidian";

/**
 * A fuzzy suggestion modal for selecting the root note for an export.
 * It displays a list of all markdown files in the vault, allowing the user
 * to search and select one.
 */
export class RootNoteSuggestModal extends FuzzySuggestModal<TFile> {
	/** A callback function that is executed when a user selects a file. */
	private onSelect: (item: TFile) => void;

	/**
	 * Creates an instance of RootNoteSuggestModal.
	 * @param {App} app - The Obsidian App instance.
	 * @param {(item: TFile) => void} onSelect - The callback to execute when an item is chosen.
	 */
	constructor(app: App, onSelect: (item: TFile) => void) {
		super(app);
		this.onSelect = onSelect;
	}

	/**
	 * Returns all markdown files in the vault to be displayed in the modal.
	 * @returns {TFile[]} An array of TFile objects.
	 */
	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	/**
	 * Gets the text to display for each item in the suggestion list.
	 * @param {TFile} item - The file item.
	 * @returns {string} The base name of the file.
	 */
	getItemText(item: TFile): string {
		return item.basename;
	}

	/**
	 * Called when a file is selected by the user.
	 * @param {TFile} item - The selected file.
	 * @param {MouseEvent | KeyboardEvent} evt - The event that triggered the selection.
	 */
	onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent) {
		this.onSelect(item);
	}
}
