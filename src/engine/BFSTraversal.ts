import { TFile } from "obsidian";
import { ExportNode } from "../types";
import { ObsidianAPI } from "../obsidian-api";

export class BFSTraversal {
	private obsidianAPI: ObsidianAPI;
	private contentDepth: number;
	private titleDepth: number;
	private visited: Set<string> = new Set();
	private cache: Map<string, ExportNode> = new Map();

	constructor(obsidianAPI: ObsidianAPI, contentDepth: number, titleDepth: number) {
		this.obsidianAPI = obsidianAPI;
		this.contentDepth = contentDepth;
		this.titleDepth = titleDepth;
	}

	public async traverse(rootNotePath: string): Promise<ExportNode | null> {
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
				}
			}
		}

		await this.updateNodeContent(rootNode);

		return rootNode;
	}

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
