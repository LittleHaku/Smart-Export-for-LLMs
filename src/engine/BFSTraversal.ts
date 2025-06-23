import { TFile } from "obsidian";
import { ExportNode } from "../types";
import { ObsidianAPI } from "../obsidian-api";

/**
 * Implements a Breadth-First Search (BFS) traversal engine to discover and structure
 * linked notes from a starting root note.
 */
export class BFSTraversal {
	private obsidianAPI: ObsidianAPI;
	private contentDepth: number;
	private titleDepth: number;
	private visited: Set<string> = new Set();
	private cache: Map<string, ExportNode> = new Map();
	private missingNotes: Set<string> = new Set();

	/**
	 * Creates an instance of the BFSTraversal engine.
	 * @param {ObsidianAPI} obsidianAPI - An instance of the ObsidianAPI wrapper.
	 * @param {number} contentDepth - The maximum depth to include full note content.
	 * @param {number} titleDepth - The maximum depth to include note titles.
	 */
	constructor(obsidianAPI: ObsidianAPI, contentDepth: number, titleDepth: number) {
		this.obsidianAPI = obsidianAPI;
		this.contentDepth = contentDepth;
		this.titleDepth = titleDepth;
	}

	/**
	 * Gets the set of missing notes encountered during traversal.
	 * @returns {string[]} Array of missing note names.
	 */
	public getMissingNotes(): string[] {
		return Array.from(this.missingNotes);
	}

	/**
	 * Traverses the note graph starting from a root note.
	 * @param {string} rootNotePath - The path of the starting note.
	 * @returns {Promise<ExportNode | null>} The root of the generated export tree, or null if the root note is not found.
	 */
	public async traverse(rootNotePath: string): Promise<ExportNode | null> {
		// Clear missing notes from any previous traversal
		this.missingNotes.clear();
		this.visited.clear();
		this.cache.clear();

		const rootFile = this.obsidianAPI.getTFile(rootNotePath);
		if (!rootFile) {
			console.error(`Root note not found: ${rootNotePath}`);
			return null;
		}

		const queue: { file: TFile; depth: number; parent: ExportNode }[] = [];
		const rootNode = await this.createExportNode(rootFile, 0);
		if (!rootNode) return null;

		this.visited.add(rootFile.path);
		queue.push({ file: rootFile, depth: 0, parent: rootNode });

		let head = 0;
		while (head < queue.length) {
			const { file, depth, parent } = queue[head++];

			if (depth >= this.titleDepth) continue;

			const links = this.obsidianAPI.getLinksForFile(file);
			if (!links) continue;

			for (const link of links) {
				const linkedFile = this.obsidianAPI.resolveLink(link.link, file.path);
				if (linkedFile && !this.visited.has(linkedFile.path)) {
					this.visited.add(linkedFile.path);
					const childNode = await this.createExportNode(linkedFile, depth + 1);
					if (childNode) {
						parent.children.push(childNode);
						queue.push({
							file: linkedFile,
							depth: depth + 1,
							parent: childNode,
						});
					}
				} else if (!linkedFile) {
					// Track missing notes (links that couldn't be resolved)
					this.missingNotes.add(link.link);
				}
			}
		}

		await this.updateNodeContent(rootNode);

		return rootNode;
	}

	/**
	 * Creates a new ExportNode for a given file.
	 * It checks the cache first to avoid redundant processing.
	 * @private
	 * @param {TFile} file - The file to create a node for.
	 * @param {number} depth - The depth of the file in the traversal.
	 * @returns {Promise<ExportNode | null>} The created ExportNode or null.
	 */
	private async createExportNode(file: TFile, depth: number): Promise<ExportNode | null> {
		const cacheKey = `${file.path}-${depth}`;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!;
		}

		const title = this.obsidianAPI.getNoteTitle(file);
		const node: ExportNode = {
			id: file.path,
			title,
			depth,
			includeContent: depth <= this.contentDepth,
			children: [],
			tokenCount: 0, // Token counting will be implemented later
			lastModified: new Date(file.stat.mtime),
		};

		this.cache.set(cacheKey, node);
		return node;
	}

	/**
	 * Recursively populates the `content` field of each node in the tree
	 * based on whether its depth is within the `contentDepth`.
	 * @private
	 * @param {ExportNode} node - The starting node to process.
	 */
	private async updateNodeContent(node: ExportNode) {
		if (node.includeContent) {
			node.content = await this.obsidianAPI.getNoteContent(node.id);
		} else {
			delete node.content;
		}

		for (const child of node.children) {
			await this.updateNodeContent(child);
		}
	}
}
