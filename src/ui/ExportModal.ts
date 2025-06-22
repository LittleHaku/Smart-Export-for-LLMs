import { App, Modal, Setting, TFile, SliderComponent, Notice, debounce } from "obsidian";
import { RootNoteSuggestModal } from "./RootNoteSuggestModal";
import { BFSTraversal } from "../engine/BFSTraversal";
import { ObsidianAPI } from "../obsidian-api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ExportNode } from "../types";
import { XMLExporter } from "../engine/XMLExporter";

/**
 * The main modal for configuring and triggering a smart export.
 * It allows users to select a root note, adjust traversal depth,
 * and export the resulting note tree to the clipboard.
 */
export class ExportModal extends Modal {
	/** The currently selected file to be used as the root of the export. */
	private selectedFile: TFile | null = null;
	/** The HTML element that displays the name of the selected file. */
	private selectedFileEl: HTMLElement;
	/** The depth for including full note content. */
	private contentDepth = 3;
	/** The depth for including only note titles. */
	private titleDepth = 6;
	/** The HTML element that displays the estimated token count. */
	private tokenCountEl: HTMLElement;
	/** A debounced function to update the token count dynamically. */
	private debouncedTokenUpdate = debounce(this.calculateAndDisplayTokens, 500, true);

	constructor(app: App) {
		super(app);
	}

	/**
	 * Called when the modal is opened. Sets up the UI components.
	 */
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

	/**
	 * Retrieves the export data by traversing the note graph.
	 * @private
	 * @returns {Promise<{ output: string, tokenCount: number } | null>} An object containing the formatted output and token count, or null on failure.
	 */
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

		const exporter = new XMLExporter();
		const vaultPath = this.app.vault.getName();
		const output = exporter.export(exportTree, vaultPath);
		const tokenCount = this.estimateTokens(output);

		return { output, tokenCount };
	}

	/**
	 * Calculates the token count for the current settings and updates the UI.
	 * @private
	 */
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

	/**
	 * Handles the main export action when the user clicks the export button.
	 * @private
	 */
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

	/**
	 * Estimates the number of tokens in a given string.
	 * A rough approximation where 1 token is about 4 characters.
	 * @private
	 * @param {string} text - The text to estimate tokens for.
	 * @returns {number} The estimated token count.
	 */
	private estimateTokens(text: string): number {
		// Rough approximation: 1 token ≈ 4 characters for English
		return Math.ceil(text.length / 4);
	}

	/**
	 * Updates the UI to reflect the currently selected file.
	 * @private
	 */
	private updateSelectedFile() {
		if (this.selectedFile) {
			this.selectedFileEl.setText(`Selected file: ${this.selectedFile.basename}`);
		} else {
			this.selectedFileEl.setText("No file selected.");
		}
		this.debouncedTokenUpdate();
	}

	/**
	 * Called when the modal is closed. Clears the content.
	 */
	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
