import { App, FuzzySuggestModal, TFile } from "obsidian";

export class RootNoteSuggestModal extends FuzzySuggestModal<TFile> {
	onChooseItem: (item: TFile, evt: MouseEvent | KeyboardEvent) => void;

	constructor(app: App, onChooseItem: (item: TFile, evt: MouseEvent | KeyboardEvent) => void) {
		super(app);
		this.onChooseItem = onChooseItem;
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(item: TFile): string {
		return item.basename;
	}
}
