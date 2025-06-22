# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

## [0.1.0] - 2025-06-22

### Added

- Project initialization
- Core architecture planning
