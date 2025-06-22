import { App, FuzzySuggestModal, TFile } from "obsidian";

/**
 * A fuzzy suggestion modal for selecting the root note for an export.
 * It displays a list of all markdown files in the vault, allowing the user
 * to search and select one.
 */
export class RootNoteSuggestModal extends FuzzySuggestModal<TFile> {
	/** A callback function that is executed when a user selects a file. */
	onChooseItem: (item: TFile, evt: MouseEvent | KeyboardEvent) => void;

	/**
	 * Creates an instance of RootNoteSuggestModal.
	 * @param {App} app - The Obsidian App instance.
	 * @param {(item: TFile, evt: MouseEvent | KeyboardEvent) => void} onChooseItem - The callback to execute when an item is chosen.
	 */
	constructor(app: App, onChooseItem: (item: TFile, evt: MouseEvent | KeyboardEvent) => void) {
		super(app);
		this.onChooseItem = onChooseItem;
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
}
