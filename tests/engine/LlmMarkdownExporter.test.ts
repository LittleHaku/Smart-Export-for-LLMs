import { describe, it, expect } from "vitest";
import { LlmMarkdownExporter } from "../../src/engine/LlmMarkdownExporter";
import { ExportNode } from "../../src/types";

describe("LlmMarkdownExporter", () => {
	const createMockExportNode = (
		title: string,
		id: string,
		depth: number = 0,
		content?: string,
		children: ExportNode[] = []
	): ExportNode => ({
		id,
		title,
		depth,
		includeContent: true,
		content: content ?? `Content for ${title}`,
		children,
		tokenCount: 10,
		lastModified: new Date("2025-01-01"),
	});

	describe("Basic Export Functionality", () => {
		it("should export a single note correctly", () => {
			const rootNode = createMockExportNode("Root Note", "root.md", 0, "This is the root content");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			// Check metadata presence
			expect(result).toContain("export_timestamp:");
			expect(result).toContain('vault_path: "TestVault"');
			expect(result).toContain('starting_note: "Root Note"');
			expect(result).toContain("total_notes_exported: 1");
			expect(result).toContain("missing_notes_count: 0");
			expect(result).toContain("max_depth_used: 0");
			expect(result).toContain("processing_order: BFS (Breadth-First Search)");

			// Check structure section
			expect(result).toContain("## Note Structure");
			expect(result).toContain('Note 1: "Root Note"');

			// Check content section
			expect(result).toContain("## Note Contents");
			expect(result).toContain('## Note 1: "Root Note"');
			expect(result).toContain("This is the root content");
		});

		it("should handle missing notes count correctly", () => {
			const rootNode = createMockExportNode("Root Note", "root.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault", 5);

			expect(result).toContain("missing_notes_count: 5");
		});

		it("should default missing notes count to 0 when not provided", () => {
			const rootNode = createMockExportNode("Root Note", "root.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain("missing_notes_count: 0");
		});
	});

	describe("Complex Note Hierarchies", () => {
		it("should handle nested note structures correctly", () => {
			const grandChild = createMockExportNode("GrandChild", "grandchild.md", 2, "Deep content");
			const child1 = createMockExportNode("Child 1", "child1.md", 1, "Child 1 content", [
				grandChild,
			]);
			const child2 = createMockExportNode("Child 2", "child2.md", 1, "Child 2 content");
			const rootNode = createMockExportNode("Root", "root.md", 0, "Root content", [child1, child2]);

			const exporter = new LlmMarkdownExporter();
			const result = exporter.export(rootNode, "TestVault");

			// Should export all 4 notes
			expect(result).toContain("total_notes_exported: 4");
			expect(result).toContain("max_depth_used: 2");

			// All notes should be listed in structure
			expect(result).toContain('Note 1: "Root"');
			expect(result).toContain('Note 2: "Child 1"');
			expect(result).toContain('Note 3: "Child 2"');
			expect(result).toContain('Note 4: "GrandChild"');

			// All notes should have content sections
			expect(result).toContain('## Note 1: "Root"');
			expect(result).toContain('## Note 2: "Child 1"');
			expect(result).toContain('## Note 3: "Child 2"');
			expect(result).toContain('## Note 4: "GrandChild"');
		});

		it("should process notes in breadth-first order", () => {
			const grandChild1 = createMockExportNode("GrandChild 1", "gc1.md", 2);
			const grandChild2 = createMockExportNode("GrandChild 2", "gc2.md", 2);
			const child1 = createMockExportNode("Child 1", "child1.md", 1, "Child 1 content", [
				grandChild1,
			]);
			const child2 = createMockExportNode("Child 2", "child2.md", 1, "Child 2 content", [
				grandChild2,
			]);
			const rootNode = createMockExportNode("Root", "root.md", 0, "Root content", [child1, child2]);

			const exporter = new LlmMarkdownExporter();
			const result = exporter.export(rootNode, "TestVault");

			// Check BFS order: Root -> Child1 -> Child2 -> GrandChild1 -> GrandChild2
			const lines = result.split("\n");
			const rootIndex = lines.findIndex((line) => line.includes('Note 1: "Root"'));
			const child1Index = lines.findIndex((line) => line.includes('Note 2: "Child 1"'));
			const child2Index = lines.findIndex((line) => line.includes('Note 3: "Child 2"'));
			const gc1Index = lines.findIndex((line) => line.includes('Note 4: "GrandChild 1"'));
			const gc2Index = lines.findIndex((line) => line.includes('Note 5: "GrandChild 2"'));

			expect(rootIndex).toBeLessThan(child1Index);
			expect(child1Index).toBeLessThan(child2Index);
			expect(child2Index).toBeLessThan(gc1Index);
			expect(gc1Index).toBeLessThan(gc2Index);
		});
	});

	describe("Content Handling", () => {
		it("should handle notes with undefined content", () => {
			const rootNode: ExportNode = {
				id: "test.md",
				title: "Test Note",
				depth: 0,
				includeContent: true,
				content: undefined,
				children: [],
				tokenCount: 0,
				lastModified: new Date("2025-01-01"),
			};

			const exporter = new LlmMarkdownExporter();
			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain('## Note 1: "Test Note"');
			// Should handle undefined content gracefully without throwing
			expect(result).not.toContain("undefined");
		});

		it("should handle notes with empty content", () => {
			const rootNode = createMockExportNode("Empty Note", "empty.md", 0, "");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain('## Note 1: "Empty Note"');
			expect(result).toContain('## Note 1: "Empty Note"\n\n');
		});

		it("should preserve complex markdown content", () => {
			const complexContent = `# Heading 1

This note has [[wikilinks]] and **bold text**.

## Subheading

- List item 1
- List item 2 with [[Another Link]]

\`\`\`javascript
console.log("code block");
\`\`\`

> Quote block with [[Quoted Link]]

[External link](https://example.com)`;

			const rootNode = createMockExportNode("Complex Note", "complex.md", 0, complexContent);
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain("[[wikilinks]]");
			expect(result).toContain("**bold text**");
			expect(result).toContain("[[Another Link]]");
			expect(result).toContain("console.log");
			expect(result).toContain("[[Quoted Link]]");
			expect(result).toContain("[External link](https://example.com)");
		});
	});

	describe("Metadata Generation", () => {
		it("should include proper timestamp in ISO format", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			const timestampRegex = /export_timestamp: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;
			expect(result).toMatch(timestampRegex);
		});

		it("should handle vault paths with special characters", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();
			const specialVaultPath = '/Users/test/My "Special" Vault & Notes';

			const result = exporter.export(rootNode, specialVaultPath);

			expect(result).toContain(`vault_path: "${specialVaultPath}"`);
		});

		it("should include descriptive text in note structure", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain("This export contains a knowledge graph");
			expect(result).toContain("breadth-first order");
			expect(result).toContain("[[wiki-style links]]");
			expect(result).toContain("Missing notes (referenced but not found)");
		});
	});

	describe("Edge Cases", () => {
		it("should handle circular references in tree structure", () => {
			// Create a structure where nodes reference each other
			const nodeB = createMockExportNode("Node B", "nodeB.md", 1);
			const nodeA = createMockExportNode("Node A", "nodeA.md", 0, "Content A", [nodeB]);
			// Simulate circular reference by adding nodeA as child of nodeB
			nodeB.children.push(nodeA);

			const exporter = new LlmMarkdownExporter();
			const result = exporter.export(nodeA, "TestVault");

			// Should handle circular reference and only count each note once
			expect(result).toContain("total_notes_exported: 2");
			expect(result).toContain('Note 1: "Node A"');
			expect(result).toContain('Note 2: "Node B"');
		});

		it("should handle notes with very long titles", () => {
			const longTitle = "A".repeat(100);
			const rootNode = createMockExportNode(longTitle, "long.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			expect(result).toContain(`starting_note: "${longTitle}"`);
			expect(result).toContain(`Note 1: "${longTitle}"`);
			expect(result).toContain(`## Note 1: "${longTitle}"`);
		});

		it("should handle empty vault path", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "");

			expect(result).toContain('vault_path: ""');
		});

		it("should handle large number of missing notes", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault", 999);

			expect(result).toContain("missing_notes_count: 999");
		});
	});

	describe("Output Format Structure", () => {
		it("should maintain proper markdown structure with sections", () => {
			const rootNode = createMockExportNode("Test Note", "test.md");
			const exporter = new LlmMarkdownExporter();

			const result = exporter.export(rootNode, "TestVault");

			// Check that the output has the three main sections in order
			const metadataIndex = result.indexOf("---");
			const structureIndex = result.indexOf("## Note Structure");
			const contentsIndex = result.indexOf("## Note Contents");

			expect(metadataIndex).toBeGreaterThanOrEqual(0);
			expect(structureIndex).toBeGreaterThan(metadataIndex);
			expect(contentsIndex).toBeGreaterThan(structureIndex);

			// Check proper separation between sections
			expect(result).toMatch(/---\n\n## Note Structure/);
			expect(result).toMatch(/\n\n## Note Contents\n\n/);
		});
	});
});
