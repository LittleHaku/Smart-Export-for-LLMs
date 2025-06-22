import { App, TFile, LinkCache } from "obsidian";

/**
 * A class to abstract interactions with the Obsidian API.
 */
export class ObsidianAPI {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	public getTFile(path: string): TFile | null {
		const file = this.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile) {
			return file;
		}
		return null;
	}

	public getLinksForFile(file: TFile): LinkCache[] | undefined {
		return this.app.metadataCache.getCache(file.path)?.links;
	}

	public resolveLink(link: string, sourcePath: string): TFile | null {
		return this.app.metadataCache.getFirstLinkpathDest(link, sourcePath);
	}

	public getNoteTitle(file: TFile): string {
		return file.basename;
	}

	public async getNoteContent(path: string): Promise<string> {
		const file = this.getTFile(path);
		if (!file) {
			return "";
		}
		return this.app.vault.cachedRead(file);
	}

	// Future methods for API interaction will go here.
}

/**
 * A utility class for extracting metadata from notes.
 */
export class NoteMetadataExtractor {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	// Future methods for metadata extraction will go here.
}
