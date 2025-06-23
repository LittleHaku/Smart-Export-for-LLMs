# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Major UI improvements:
  - **Modern Card-Based Layout**: Replaced dividing lines with clean, organized sections.
  - **Enhanced Visual Hierarchy**: Added clear section headers with descriptive emojis.
  - **Smart Help System**: Added informative tooltips and help text throughout the interface.
  - **Token Awareness**: Added smart warnings for LLM context limits (GPT-4, Claude).
  - **Improved Status Feedback**: Added visual indicators for operations (✅, ❌, 🔄).
  - **Better Export Format Descriptions**: Added clear explanations for each export type.
  - **Responsive Design**: Added mobile-friendly layout adjustments.
  - **Enhanced Typography**: Improved font sizes, weights, and spacing.
  - **Modern Button Styling**: Added hover effects and better visual feedback.
- Split Markdown export into two formats:
  - **LLM-Optimized Markdown**: A detailed format with metadata and structure, similar to the XML export.
  - **Print-Friendly Markdown**: A simple, clean format containing only the note content.
- Added a dropdown menu to select the export format (XML or Markdown).
- Implemented a `MarkdownExporter` for plain text export.
- Improved error handling with a `try...catch` block around the export process.
- Implemented XML Export System:
  - The export functionality now generates a structured XML output instead of Markdown.
  - The XML includes metadata for each note, such as path, depth, and modification date.
  - Content is sanitized and wrapped in CDATA sections to ensure a well-formed output.
- Implemented BFS Traversal Engine:
  - Breadth-first search algorithm for note traversal.
  - Wikilink parsing and extraction.
  - Depth-based controls for content and title-only inclusion.
  - Circular reference detection to prevent infinite loops.
  - Caching layer to optimize performance for repeated traversals.
- Implemented core data structures (`ExportNode`, `VaultContext`, `ExportConfiguration`).
- Created placeholder classes for Obsidian API integration and metadata extraction.
- Implemented dual depth sliders for content and title depth with descriptive tooltips.
- Added a root note picker with a fuzzy search UI to the export modal.
- Implemented a basic token counter to estimate export size.
- Added export to clipboard functionality with a clear call-to-action button.
- Added a ribbon icon with a brain symbol to open the main export modal.
- Created the basic structure for the main export modal.
- Configured plugin metadata in `manifest.json`.
- Initial project setup
- Product Requirements Document
- Development roadmap and task breakdown

## [0.1.1] - 2025-06-23

### Added

- Implemented a comprehensive test suite using Vitest.
- Created mock data and Obsidian API stubs for isolated testing.
- Added unit tests for the `BFSTraversal` engine, covering:
  - Correct graph traversal logic.
  - Content and title depth limits.
  - Graceful handling of circular references.
  - Correctly ignoring missing notes or unresolved links.
- Configured code coverage reporting with `@vitest/coverage-v8`.
- Resolved module resolution issues for the `obsidian` package in a test environment.
- **Missing Notes Tracking**:
  - Enhanced `BFSTraversal` engine to track unresolved wikilinks as missing notes.
  - Updated `XMLExporter` and `LlmMarkdownExporter` to include missing notes count in metadata.
  - Added tests to verify missing notes are properly tracked and reported.
  - Integrated missing notes tracking into the main export workflow.

## [0.1.0] - 2025-06-22

### Added

- Project initialization
- Core architecture planning
