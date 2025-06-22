/**
 * Represents a single node in the exported note tree.
 */
export interface ExportNode {
	/** A unique identifier for the node, typically the file path. */
	id: string;
	/** The title of the note. */
	title: string;
	/** The depth of the node in the traversal tree, starting from 0. */
	depth: number;
	/** Whether the full content of the note should be included. */
	includeContent: boolean;
	/** The full content of the note, if included. */
	content?: string;
	/** An array of child nodes representing outgoing links. */
	children: ExportNode[];
	/** An estimated token count for the node's content. */
	tokenCount: number;
	/** The last modification date of the note file. */
	lastModified: Date;
}

/**
 * Defines the types of vault-wide context that can be included in an export.
 * @deprecated Not yet implemented.
 */
export type VaultContextType = "none" | "titles" | "titles_tags" | "titles_metadata" | "smart";

/**
 * Represents the configuration for including vault-wide context.
 * @deprecated Not yet implemented.
 */
export interface VaultContext {
	/** The type of context to include. */
	type: VaultContextType;
	/** The maximum number of context notes to include. */
	maxNotes: number;
	/** The array of notes selected for the context. */
	notes: VaultContextNote[];
	/** The total token count for the included context. */
	tokenCount: number;
	/** Glob patterns for files/folders to exclude from context. */
	excludePatterns: string[];
}

/**
 * Represents a single note included as part of the vault-wide context.
 * @deprecated Not yet implemented.
 */
export interface VaultContextNote {
	/** The title of the context note. */
	title: string;
	/** The tags associated with the note. */
	tags?: string[];
	/** The folder path of the note. */
	folder?: string;
	/** The creation date of the note. */
	created?: Date;
	/** The last modification date of the note. */
	modified?: Date;
	/** A relevance score used by the 'smart' context type. */
	relevanceScore?: number;
	/** Whether the note is included in the final context. */
	included: boolean;
}

/**
 * Represents the complete configuration for a single export operation.
 * @deprecated Partially implemented; some features are placeholders.
 */
export interface ExportConfiguration {
	/** The path of the root note for the export. */
	rootNote: string;
	/** The depth to which full note content is included. */
	contentDepth: number;
	/** The depth to which only note titles are included. */
	titleDepth: number;
	/** The configuration for vault-wide context. */
	vaultContext: VaultContext;
	/** A list of note IDs to explicitly exclude from the export. */
	excludedNotes: string[];
	/** A list of note IDs to explicitly include, regardless of traversal. */
	customInclusions: string[];
	/** The ID of the template to use for formatting the final output. */
	templateId: string;
	/** The maximum token limit for the export. */
	maxTokens?: number;
}
