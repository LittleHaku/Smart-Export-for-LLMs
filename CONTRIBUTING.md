# Contributing to Smart Export for LLMs

Thank you for your interest in contributing to Smart Export for LLMs! 🎉 This document provides guidelines and information for contributors.

## 🌟 How to Contribute

We welcome contributions of all kinds:

- 🐛 **Bug reports** - Help us identify and fix issues
- ✨ **Feature requests** - Suggest new functionality
- 💻 **Code contributions** - Submit bug fixes or new features
- 📚 **Documentation** - Improve guides, examples, and explanations
- 🧪 **Testing** - Help us test new features or edge cases
- 💡 **Ideas & Discussion** - Share your thoughts on improvements

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Obsidian** (for testing)
- **Git** for version control

### Development Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/LittleHaku/obsidian-llm-export-plugin.git
   cd obsidian-llm-export-plugin
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start development mode**:

   ```bash
   npm run dev
   ```

5. **Link to Obsidian** (for testing):

   - Clone (or symlink) the plugin into your test vault's `.obsidian/plugins/` directory so that the folder name is `smart-export-llms`:

     ```bash
     # Inside your test vault
     cd .obsidian/plugins
     git clone https://github.com/<your-username>/obsidian-llm-export-plugin smart-export-llms
     ```

   Reload Obsidian and enable the plugin

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:

   ```bash
   npm test                # Run all tests
   npm run lint            # Check code style
   npm run format:check    # Check formatting
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create a pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Code Standards

### TypeScript & Code Style

- **Strict TypeScript**: We use strict mode for type safety
- **ESLint**: Follow our ESLint configuration
- **Prettier**: Code is automatically formatted
- **Consistent naming**: Use camelCase for variables, PascalCase for classes

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

Examples:
feat: add vault context functionality
fix: resolve circular reference in BFS traversal
docs: update installation instructions
test: add unit tests for XML exporter
refactor: improve token calculation performance
```

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Testing Requirements

- **Unit tests** for all new functionality
- **Integration tests** for complex features
- **Manual testing** in Obsidian
- **Maintain 80%+ code coverage**

```bash
npm test              # Run tests with coverage
npm run test:watch    # Watch mode for development
```

## 🧪 Testing Guidelines

### Writing Tests

- Use **Vitest** for unit testing
- Test files should be in `tests/` directory
- Follow the existing test patterns
- Mock Obsidian API interactions

### Test Categories

1. **Unit Tests**: Test individual functions and classes
2. **Integration Tests**: Test component interactions
3. **Edge Cases**: Test error conditions and boundary cases

### Manual Testing Checklist

When testing UI changes:

- [ ] Test with different vault sizes
- [ ] Test with various note structures
- [ ] Test all export formats
- [ ] Test error scenarios
- [ ] Test on different operating systems

## 📚 Documentation Standards

### Code Documentation

- **JSDoc comments** for all public methods
- **Inline comments** for complex logic
- **README updates** for new features
- **CHANGELOG entries** for all changes

### User Documentation

- Update **README.md** for new features
- Add **examples** for complex functionality
- Include **screenshots** for UI changes
- Update **troubleshooting** section if needed

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, Obsidian version, plugin version)
5. **Error messages** or console output
6. **Vault information** (size, structure) if relevant

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) for consistency.

## ✨ Feature Requests

When suggesting features:

1. **Describe the use case** and problem being solved
2. **Propose a solution** with UI/UX considerations
3. **Consider alternatives** and explain why this approach is best
4. **Align with plugin goals** of LLM-ready export functionality

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml).

## 🔍 Code Review Process

### For Contributors

1. **Self-review** your code before submitting
2. **Test thoroughly** including edge cases
3. **Update documentation** as needed
4. **Follow the PR template** completely
5. **Be responsive** to feedback and questions

### Review Criteria

Pull requests are evaluated on:

- **Code quality** and adherence to standards
- **Test coverage** and quality
- **Documentation** completeness
- **User experience** impact
- **Performance** considerations
- **Backwards compatibility**

## 🏗️ Architecture Guidelines

### Core Principles

- **Modularity**: Keep components focused and testable
- **TypeScript**: Leverage strong typing for reliability
- **Performance**: Consider impact on large vaults
- **Privacy**: All processing stays local to Obsidian
- **Extensibility**: Design for future enhancements

### File Organization

```
src/
├── engine/           # Core traversal and export logic
├── ui/              # User interface components
├── types.ts         # TypeScript type definitions
├── obsidian-api.ts  # Obsidian API wrapper
└── main.ts          # Plugin entry point

tests/
├── engine/          # Engine component tests
├── mocks/           # Test mocks and utilities
└── fixtures/        # Test data and scenarios
```

## 🤝 Community Guidelines

### Be Respectful

- **Inclusive language** in all communications
- **Constructive feedback** in code reviews
- **Patient assistance** with new contributors
- **Professional tone** in discussions

### Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Direct contact**: Reach out to @LittleHaku for sensitive matters

## 📊 Performance Considerations

### Key Metrics

- **Vault size**: Support 10,000+ notes
- **Export speed**: <5 seconds for typical exports
- **Memory usage**: <100MB during operation
- **UI responsiveness**: <100ms for interactions

### Optimization Guidelines

- **Lazy loading** for large datasets
- **Debounced inputs** for real-time updates
- **Efficient algorithms** for graph traversal
- **Memory cleanup** after operations

## 🚢 Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Workflow

1. **Feature development** in feature branches
2. **Integration** via pull requests to `develop`
3. **Release preparation** on `release/vX.Y.Z` branches
4. **Merge to main** triggers automated release
5. **GitHub release** with automated asset upload

## 🙏 Recognition

Contributors are recognized in:

- **CHANGELOG.md** for their contributions
- **README.md** contributors section
- **GitHub contributors** page
- **Release notes** for significant contributions

## 📞 Questions?

- **General questions**: [GitHub Discussions](https://github.com/LittleHaku/obsidian-llm-export-plugin/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/LittleHaku/obsidian-llm-export-plugin/issues)
- **Feature requests**: [GitHub Issues](https://github.com/LittleHaku/obsidian-llm-export-plugin/issues)

---

**Thank you for contributing to Smart Export for LLMs! Your help makes this plugin better for the entire Obsidian community.** 🎉
