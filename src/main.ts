import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { ExportModal } from "./ui/ExportModal";

// Remember to rename these classes and interfaces!

interface SmartExportSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: SmartExportSettings = {
	mySetting: "default",
};

/**
 * The main class for the Smart Export plugin.
 * This class is responsible for loading the plugin, adding UI elements,
 * and unloading the plugin when it's disabled.
 */
export default class SmartExportPlugin extends Plugin {
	settings: SmartExportSettings;

	/**
	 * This method is called when the plugin is first loaded.
	 * It sets up the ribbon icon and the command for opening the export modal.
	 */
	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("brain-circuit", "Smart Export", (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new ExportModal(this.app).open();
		});

		// This adds a command that can be triggered anywhere
		this.addCommand({
			id: "open-smart-export-modal",
			name: "Open Smart Export",
			callback: () => {
				new ExportModal(this.app).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SmartExportSettingTab(this.app, this));

		console.log("Smart Export plugin loaded.");
	}

	/**
	 * This method is called when the plugin is unloaded.
	 * It's used to clean up any resources created by the plugin.
	 */
	onunload() {
		console.log("Smart Export plugin unloaded.");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
