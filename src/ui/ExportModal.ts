import { App, Modal, Setting, TFile } from "obsidian";
import { RootNoteSuggestModal } from "./RootNoteSuggestModal";

export class ExportModal extends Modal {
	private selectedFile: TFile | null = null;
	private selectedFileEl: HTMLElement;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h1", { text: "Smart Export" });

		new Setting(contentEl)
			.setName("Root Note")
			.setDesc("Select the root note for the export.")
			.addButton((button) => {
				button.setButtonText("Select").onClick(() => {
					new RootNoteSuggestModal(this.app, (file: TFile) => {
						this.selectedFile = file;
						this.updateSelectedFile();
					}).open();
				});
			});

		this.selectedFileEl = contentEl.createEl("div", {
			text: "No file selected.",
			cls: "smart-export-selected-file",
		});

		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			this.selectedFile = activeFile;
			this.updateSelectedFile();
		}
	}

	private updateSelectedFile() {
		if (this.selectedFile) {
			this.selectedFileEl.setText(`Selected file: ${this.selectedFile.basename}`);
		} else {
			this.selectedFileEl.setText("No file selected.");
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
