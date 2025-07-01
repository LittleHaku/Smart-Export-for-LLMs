# Smart Export for LLMs

**Intelligently export interconnected Obsidian notes for Large Language Model consumption with configurable depth and advanced context options.**

Transform your knowledge vault into perfectly structured exports that LLMs can understand and work with. Using breadth-first search traversal of wikilinks, Smart Export discovers related notes and creates comprehensive, token-aware exports optimized for AI workflows.

## ✨ Key Features

### 🧠 **Smart Note Discovery**

- **Breadth-First Search**: Automatically discovers interconnected notes through wikilinks
- **Dual-Depth Control**: Separate controls for full content vs. title-only inclusion
- **Missing Link Tracking**: Identifies and reports broken wikilinks for vault maintenance

### 🎛️ **Flexible Export Options**

- **XML Format**: Structured export with comprehensive metadata
- **LLM Markdown**: Optimized format for AI consumption with clear structure
- **Print-Friendly**: Clean, readable format for human review

### 📊 **Token-Aware Design**

- **Real-time Token Counting**: Live estimates as you configure your export
- **LLM Context Warnings**: Smart alerts for GPT-4 (128k) and Claude (200k) limits
- **Optimization Guidance**: Helps you stay within context windows

### 🎨 **Modern Interface**

- **Intuitive Controls**: Card-based layout with clear visual hierarchy
- **Smart Defaults**: Auto-selects current note, reasonable depth settings
- **Rich Tooltips**: Built-in help system explains every feature

## 📦 Installation

### From Obsidian Community Plugins

1. Open **Settings** → **Community Plugins**
2. **Browse** and search for "Smart Export for LLMs"
3. **Install** and **Enable** the plugin
4. Find the 🧠 brain icon in your ribbon or use **Cmd/Ctrl+P** → "Smart Export"

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/LittleHaky/obsidian-llm-export-plugin/releases)
2. Extract to `VaultFolder/.obsidian/plugins/smart-export-llms/`
3. Reload Obsidian and enable the plugin

## 🚀 Quick Start

1. **Open the Export Dialog**: Click the 🧠 brain icon in the ribbon or use **Cmd/Ctrl+P** → "Smart Export"
2. **Select Root Note**: Choose your starting point (defaults to current note)
3. **Adjust Depth**: Set how deep to traverse (Content Depth: 3, Title Depth: 6 recommended)
4. **Choose Format**: Pick XML for structured data or Markdown for readability
5. **Export**: Click "🚀 Export to Clipboard" and paste into your favorite LLM

## 📋 Export Formats

### XML Format

```xml
<obsidian_export>
  <metadata>
    <export_timestamp>2025-01-25T10:30:00.000Z</export_timestamp>
    <starting_note>Machine Learning</starting_note>
    <total_notes_exported>5</total_notes_exported>
    <missing_notes_count>0</missing_notes_count>
  </metadata>
  <note_contents>
    <note id="1" name="Machine Learning">
      <![CDATA[# Machine Learning
      Content with [[wikilinks]] preserved...]]>
    </note>
  </note_contents>
</obsidian_export>
```

### LLM Markdown

```markdown
# Obsidian Vault Export

**Export Details:**

- Starting Note: Machine Learning
- Total Notes: 5
- Export Depth: Content (3), Titles (6)
- Generated: 2025-01-25T10:30:00.000Z

## Note Contents

### 1. Machine Learning

# Machine Learning

Content with [[wikilinks]] preserved...
```

## ⚙️ Configuration

### Depth Controls

- **Content Depth (1-20)**: Levels of linked notes to include full content
- **Title Depth (1-30)**: Additional levels to include titles only for context
- _Rule_: Title Depth must be ≥ Content Depth

### Export Settings

Access via **Settings** → **Smart Export for LLMs**:

- **Default Content Depth**: Your preferred starting depth for content
- **Default Title Depth**: Your preferred starting depth for titles
- **Default Export Format**: Choose your preferred output format
- **Auto-select Current Note**: Whether to automatically pick the active note

## 🎯 Use Cases

### 📚 **Research & Analysis**

```
Prompt: "Analyze these interconnected notes about [topic] and identify key themes, connections, and knowledge gaps."
```

### ✍️ **Content Creation**

```
Prompt: "Based on these notes, write a comprehensive article about [topic], ensuring you reference the key concepts and relationships shown."
```

### 🔍 **Knowledge Discovery**

```
Prompt: "Review these notes and suggest 5 new connections or research directions I should explore in my vault."
```

### 📖 **Study Assistant**

```
Prompt: "Create a study guide from these interconnected notes, organizing the concepts hierarchically and highlighting important relationships."
```

## 🔧 Advanced Tips

### Optimizing Token Usage

- Start with **Content Depth: 2-3** for most use cases
- Use **Title Depth: 5-8** to provide broader context without overwhelming content
- Monitor the token counter to stay within your LLM's limits

### Organizing for Export

- Use descriptive note titles (they appear in title-only levels)
- Create hub notes that link to related concepts
- Maintain clean wikilink structure for better traversal

### Export Strategies

- **Deep Dive**: High content depth (4-6) for comprehensive analysis
- **Broad Overview**: Low content depth (1-2), high title depth (8-12) for big picture
- **Balanced**: Medium depths (3/6) for most research and writing tasks

## 🐛 Troubleshooting

### Common Issues

**"No notes found" or empty export:**

- Ensure your root note has wikilinks to other notes
- Check that linked notes exist in your vault
- Verify note names match wikilink text exactly

**Token count too high:**

- Reduce Content Depth or Title Depth
- Choose a more specific root note with fewer connections
- Use Print-Friendly format for smaller exports

**Missing links reported:**

- Check the export output for missing notes list
- Fix broken wikilinks in your vault
- Use exact note names in your wikilinks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/LittleHaky/obsidian-llm-export-plugin
cd obsidian-llm-export-plugin
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If Smart Export saves you time and enhances your workflow, consider supporting its development:

- ⭐ **Star this repo** to show your support
- 🐛 **Report issues** to help improve the plugin
- 💡 **Share ideas** for new features
- ☕ **Buy me a coffee** (coming soon!)

## 🗺️ Roadmap

### Coming Soon

- **Vault Context**: Include broader vault context for knowledge gap analysis
- **Template System**: Pre-built prompts for common LLM workflows
- **Export Presets**: Save and reuse your favorite configurations
- **Batch Export**: Export multiple root notes at once

---

**Made with ❤️ for the Obsidian community**

_Transform your personal knowledge base into AI-ready insights._
