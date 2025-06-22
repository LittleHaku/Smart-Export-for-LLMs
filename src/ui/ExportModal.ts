import { App, Modal, Setting, TFile, SliderComponent, Notice, debounce } from "obsidian";
import { RootNoteSuggestModal } from "./RootNoteSuggestModal";
import { BFSTraversal } from "../engine/BFSTraversal";
import { ObsidianAPI } from "../obsidian-api";
import { ExportNode } from "../types";

export class ExportModal extends Modal {
	private selectedFile: TFile | null = null;
	private selectedFileEl: HTMLElement;
	private contentDepth = 3;
	private titleDepth = 6;
	private tokenCountEl: HTMLElement;
	private debouncedTokenUpdate = debounce(this.calculateAndDisplayTokens, 500, true);

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
		contentEl.createEl("hr", { cls: "smart-export-separator" });

		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			this.selectedFile = activeFile;
			this.updateSelectedFile();
		} else {
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
						this.debouncedTokenUpdate();
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
						this.debouncedTokenUpdate();
					});
			});

		contentEl.createEl("hr", { cls: "smart-export-separator" });

		new Setting(contentEl)
			.setName("Export")
			.setDesc("Generate the export and copy it to your clipboard.")
			.addButton((button) => {
				button
					.setButtonText("Export to Clipboard")
					.setCta()
					.onClick(() => {
						this.onExport();
					});
			});

		this.tokenCountEl = contentEl.createEl("div", {
			text: "Token count: N/A",
			cls: "smart-export-token-count",
		});
	}

	private async getExportData(): Promise<{ output: string; tokenCount: number } | null> {
		if (!this.selectedFile) {
			return null;
		}

		const obsidianAPI = new ObsidianAPI(this.app);
		const traversal = new BFSTraversal(obsidianAPI, this.contentDepth, this.titleDepth);

		const exportTree = await traversal.traverse(this.selectedFile.path);

		if (!exportTree) {
			return null;
		}

		const output = this.generateOutput(exportTree);
		const tokenCount = this.estimateTokens(output);

		return { output, tokenCount };
	}

	private async calculateAndDisplayTokens() {
		if (!this.selectedFile) {
			this.tokenCountEl.setText("Token count: N/A");
			return;
		}

		this.tokenCountEl.setText("Token count: calculating...");
		const data = await this.getExportData();

		if (data) {
			this.tokenCountEl.setText(`Token count: ~${data.tokenCount}`);
		} else {
			this.tokenCountEl.setText("Token count: Error");
		}
	}

	private async onExport() {
		if (!this.selectedFile) {
			new Notice("Please select a root note first.");
			return;
		}

		this.tokenCountEl.setText("Token count: exporting...");
		const data = await this.getExportData();

		if (data) {
			this.tokenCountEl.setText(`Token count: ~${data.tokenCount}`);
			await navigator.clipboard.writeText(data.output);
			new Notice("Exported content copied to clipboard!");
		} else {
			new Notice("Failed to generate export. See console for details.");
			this.tokenCountEl.setText("Token count: Error");
		}
	}

	private generateOutput(node: ExportNode, depth = 0): string {
		let output = "";
		const prefix = "#".repeat(depth + 1);
		output += `${prefix} ${node.title}\n\n`;

		if (node.content) {
			output += `${node.content}\n\n`;
		}

		for (const child of node.children) {
			output += this.generateOutput(child, depth + 1);
		}

		return output;
	}

	private estimateTokens(text: string): number {
		// Rough approximation: 1 token ≈ 4 characters for English
		return Math.ceil(text.length / 4);
	}

	private updateSelectedFile() {
		if (this.selectedFile) {
			this.selectedFileEl.setText(`Selected file: ${this.selectedFile.basename}`);
		} else {
			this.selectedFileEl.setText("No file selected.");
		}
		this.debouncedTokenUpdate();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
