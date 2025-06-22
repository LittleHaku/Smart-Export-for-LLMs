import { App, Modal, Setting, TFile, SliderComponent } from "obsidian";
import { RootNoteSuggestModal } from "./RootNoteSuggestModal";

export class ExportModal extends Modal {
	private selectedFile: TFile | null = null;
	private selectedFileEl: HTMLElement;
	private contentDepth = 3;
	private titleDepth = 6;

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

		let contentSlider: SliderComponent;
		let titleSlider: SliderComponent;

		new Setting(contentEl)
			.setName("Content Depth")
			.setDesc("Levels of linked notes to include the full content for.")
			.addSlider((slider) => {
				contentSlider = slider;
				slider
					.setLimits(1, 20, 1)
					.setValue(this.contentDepth)
					.setDynamicTooltip()
					.onChange((value) => {
						this.contentDepth = value;
						if (this.titleDepth < this.contentDepth) {
							this.titleDepth = this.contentDepth;
							titleSlider.setValue(this.titleDepth);
						}
					});
			});

		new Setting(contentEl)
			.setName("Title Depth")
			.setDesc("Levels of linked notes to include only the title for.")
			.addSlider((slider) => {
				titleSlider = slider;
				slider
					.setLimits(1, 30, 1)
					.setValue(this.titleDepth)
					.setDynamicTooltip()
					.onChange((value) => {
						this.titleDepth = value;
						if (this.titleDepth < this.contentDepth) {
							this.contentDepth = this.titleDepth;
							if (contentSlider) contentSlider.setValue(this.contentDepth);
						}
					});
			});
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
