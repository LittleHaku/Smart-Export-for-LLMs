import { describe, it, expect } from "vitest";
import { XMLExporter } from "../../src/engine/XMLExporter";
import { ExportNode } from "../../src/types";

describe("XMLExporter", () => {
	const createMockExportNode = (title: string, id: string, depth: number = 0): ExportNode => ({
		id,
		title,
		depth,
		includeContent: true,
		content: `Content for ${title}`,
		children: [],
		tokenCount: 10,
		lastModified: new Date("2025-01-01"),
	});

	it("should include missing notes count in XML metadata", () => {
		const rootNode = createMockExportNode("Root Note", "root.md");
		const exporter = new XMLExporter();

		const result = exporter.export(rootNode, "TestVault", 3);

		expect(result).toContain("<missing_notes_count>3</missing_notes_count>");
		expect(result).toContain("<total_notes_exported>1</total_notes_exported>");
		expect(result).toContain("<starting_note>Root Note</starting_note>");
		expect(result).toContain("<vault_path>TestVault</vault_path>");
	});

	it("should default missing notes count to 0 when not provided", () => {
		const rootNode = createMockExportNode("Root Note", "root.md");
		const exporter = new XMLExporter();

		const result = exporter.export(rootNode, "TestVault");

		expect(result).toContain("<missing_notes_count>0</missing_notes_count>");
	});
});
