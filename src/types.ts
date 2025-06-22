export interface ExportNode {
	id: string;
	title: string;
	depth: number;
	includeContent: boolean;
	content?: string;
	children: ExportNode[];
	tokenCount: number;
	lastModified: Date;
}

export type VaultContextType = "none" | "titles" | "titles_tags" | "titles_metadata" | "smart";

export interface VaultContext {
	type: VaultContextType;
	maxNotes: number;
	notes: VaultContextNote[];
	tokenCount: number;
	excludePatterns: string[];
}

export interface VaultContextNote {
	title: string;
	tags?: string[];
	folder?: string;
	created?: Date;
	modified?: Date;
	relevanceScore?: number; // for smart context
	included: boolean;
}

export interface ExportConfiguration {
	rootNote: string;
	contentDepth: number;
	titleDepth: number;
	vaultContext: VaultContext;
	excludedNotes: string[];
	customInclusions: string[];
	templateId: string;
	maxTokens?: number;
}
