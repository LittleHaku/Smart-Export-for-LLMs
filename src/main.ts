import { App, Modal, Plugin, PluginSettingTab, Setting } from "obsidian";

// Remember to rename these classes and interfaces!

interface SmartExportSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: SmartExportSettings = {
	mySetting: "default",
};

export default class SmartExportPlugin extends Plugin {
	settings: SmartExportSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("brain-circuit", "Smart Export for LLMs", () => {
			new ExportModal(this.app).open();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-export-modal",
			name: "Open Smart Export Modal",
			callback: () => {
				new ExportModal(this.app).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SmartExportSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ExportModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Smart Export" });
		contentEl.createEl("p", {
			text: "This is where the main UI for the Smart Export plugin will be.",
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SmartExportSettingTab extends PluginSettingTab {
	plugin: SmartExportPlugin;

	constructor(app: App, plugin: SmartExportPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
