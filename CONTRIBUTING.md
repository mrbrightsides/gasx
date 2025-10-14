# 🤝 Contributing to STC GasX

First off, thank you for considering contributing to STC GasX! It's people like you that make STC GasX such a great tool for the Web3 community. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age
- Body size
- Disability
- Ethnicity
- Gender identity
- Level of experience
- Nationality
- Personal appearance
- Race
- Religion
- Sexual identity and orientation

### Our Standards

**Examples of behavior that contributes to a positive environment:**

✅ Using welcoming and inclusive language  
✅ Being respectful of differing viewpoints  
✅ Gracefully accepting constructive criticism  
✅ Focusing on what is best for the community  
✅ Showing empathy towards other community members  

**Examples of unacceptable behavior:**

❌ Trolling, insulting/derogatory comments, and personal attacks  
❌ Public or private harassment  
❌ Publishing others' private information without permission  
❌ Other conduct which could reasonably be considered inappropriate  

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at **conduct@stcgasx.com**. All complaints will be reviewed and investigated promptly and fairly.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/mrbrightsides/gasx/issues) to avoid duplicates.

When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari, Firefox]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide:

**Enhancement Template:**

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.

**Would you like to implement this feature?**
[ ] Yes, I'd like to implement this
[ ] No, just suggesting
```

### 📝 Contributing Code

We love pull requests! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**
- **Git**

### Initial Setup

1. **Clone your fork:**
```bash
git clone https://github.com/mrbrightsides/gasx.git
cd stc-gasx
```

2. **Add upstream remote:**
```bash
git remote add upstream https://github.com/mrbrightsides/gasx.git
```

3. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Guidelines

### TypeScript

- **Strict mode** - All code must pass TypeScript strict checks
- **Explicit types** - Avoid implicit `any`, use explicit types
- **Type imports** - Use `import type` for type-only imports

```typescript
// ✅ Good
import type { Transaction } from '@/types';
const amount: number = 500000;

// ❌ Bad
import { Transaction } from '@/types';
const amount = 500000; // implicit any
```

### React Components

- **Functional components** with hooks
- **Use client directive** for client components
- **Proper prop typing** with interfaces

```typescript
// ✅ Good
'use client';

import type { FC } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
```

### Styling

- **Tailwind CSS** for all styling
- **No inline styles** unless absolutely necessary
- **Use theme classes** for dark/light mode support

```tsx
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">

// ❌ Bad
<div style={{ backgroundColor: 'white' }}>
```

### File Organization

```
src/
├── app/               # Next.js App Router pages
│   ├── page.tsx      # Main dashboard
│   ├── layout.tsx    # Root layout
│   └── api/          # API routes
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   └── [Feature].tsx # Feature components
├── lib/              # Utilities
│   └── utils.ts
└── types/            # TypeScript types
    └── index.ts
```

### Naming Conventions

- **Components**: PascalCase (`CostCalculator.tsx`)
- **Files**: kebab-case or PascalCase for components
- **Variables**: camelCase (`gasPrice`, `ethToUsd`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`Transaction`, `GasPrice`)

### Code Quality

- **No console.logs** in production code (use proper logging)
- **Error handling** - Always handle errors gracefully
- **Comments** - Use comments for complex logic
- **DRY principle** - Don't repeat yourself

```typescript
// ✅ Good
const calculateCost = (gasUsed: number, gasPrice: number): number => {
  return (gasUsed * gasPrice) / 1e9; // Convert from Gwei to ETH
};

// ❌ Bad
const calculateCost = (gasUsed: any, gasPrice: any) => {
  const result = (gasUsed * gasPrice) / 1000000000;
  console.log(result); // Don't leave console.logs
  return result;
};
```

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(calculator): add support for ERC-20 token transfers

Add ERC-20 token transfer cost calculation with 65k gas estimate.
Includes UI updates and new transaction type selector.

Closes #123
```

```bash
fix(multi-chain): correct Base network gas price fetch

Fixed incorrect RPC endpoint for Base network causing null gas prices.
Updated to use official Base Sepolia testnet endpoint.

Fixes #456
```

```bash
docs(api): add Python examples to API documentation

Added comprehensive Python examples using requests library.
Includes error handling and best practices.
```

### Commit Best Practices

- ✅ Use imperative mood ("add" not "added")
- ✅ Don't capitalize first letter
- ✅ No period at the end of subject
- ✅ Limit subject line to 72 characters
- ✅ Reference issues and pull requests

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest main
2. **Test thoroughly** - Ensure all features work
3. **Run linting** - `npm run lint`
4. **Build successfully** - `npm run build`
5. **Update documentation** if needed

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All features work as expected
- [ ] No console errors
- [ ] Dark/light theme tested

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on multiple browsers

## Related Issues
Closes #(issue number)
```

### Review Process

1. **Automated checks** must pass (build, lint)
2. **Code review** by maintainers
3. **Feedback incorporation** if requested
4. **Approval and merge** by maintainers

### After Merge

Your contribution will be included in the next release! 🎉

---

## Project Structure

### Key Files

```
stc-gasx/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard (17 tabs)
│   │   ├── layout.tsx            # Root layout with theme
│   │   └── api/proxy/            # API proxy for external calls
│   ├── components/
│   │   ├── Header.tsx            # App header with theme toggle
│   │   ├── MarketDataPanel.tsx   # Real-time market data
│   │   ├── CostCalculator.tsx    # Quick calculator
│   │   ├── MultiChainComparison.tsx  # 5 blockchain comparison
│   │   ├── SmartRecommendations.tsx  # AI insights
│   │   ├── PDFExport.tsx         # PDF report generation
│   │   └── ...                   # 17+ components total
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── index.ts              # TypeScript definitions
├── docs/                         # Documentation
│   ├── USER_GUIDE.md            # User guide (ID + EN)
│   └── API_DOCS.md              # API documentation
├── public/                       # Static assets
├── CONTRIBUTING.md              # This file
├── README.md                    # Main readme
└── package.json                 # Dependencies
```

### Component Guidelines

Each feature component should:
- Be self-contained
- Handle its own state
- Include proper TypeScript types
- Support dark/light theme
- Be responsive (mobile-friendly)
- Include error handling

---

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- ✅ **All 17 tabs** load without errors
- ✅ **Dark/light theme** switches correctly
- ✅ **Responsive design** on mobile/tablet/desktop
- ✅ **CSV upload/download** works
- ✅ **PDF export** generates correctly
- ✅ **Charts render** properly
- ✅ **API calls** succeed (or fail gracefully)
- ✅ **Browser console** has no errors
- ✅ **Multiple browsers** (Chrome, Firefox, Safari)

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Future: Automated Testing

We plan to add:
- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright)

**Want to help?** Setting up testing infrastructure is a great contribution!

---

## Documentation

### What Needs Documentation

- **New features** - Update README.md and USER_GUIDE.md
- **API changes** - Update API_DOCS.md
- **Configuration** - Document any new env vars
- **Breaking changes** - Clearly highlight in PR

### Documentation Style

- Use clear, simple language
- Include code examples
- Add screenshots for UI changes
- Support both English and Indonesian when possible

### Comments in Code

```typescript
// ✅ Good - Explains WHY
// Use 8 decimal places to avoid showing "0.0 Gwei" for small values
const formattedGas = gasPrice.toFixed(8);

// ❌ Bad - States the obvious
// Format gas price to 8 decimals
const formattedGas = gasPrice.toFixed(8);
```

---

## Areas for Contribution

### 🔥 High Priority

- [ ] Add unit tests for components
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Optimize bundle size
- [ ] Add accessibility improvements (ARIA labels)

### 💡 Feature Ideas

- [ ] User authentication (optional)
- [ ] Save analysis history
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] More blockchain networks
- [ ] More currencies
- [ ] WebSocket for live updates

### 📖 Documentation

- [ ] Video tutorials
- [ ] More code examples
- [ ] Translation to other languages
- [ ] Architecture diagrams
- [ ] Performance optimization guide

### 🎨 Design

- [ ] Component library expansion
- [ ] Animation improvements
- [ ] Better mobile UX
- [ ] Accessibility enhancements
- [ ] Print-friendly layouts

---

## Recognition

Contributors will be:

- ✨ Listed in the main README.md
- 🎉 Mentioned in release notes
- 💬 Credited in commit history
- 🏆 Featured on our website (when launched)

### Hall of Fame

We maintain a list of top contributors based on:
- Number of meaningful PRs
- Code quality
- Documentation contributions
- Community support

---

## Getting Help

### Resources

- 📖 [User Guide](./docs/USER_GUIDE.md)
- 🛠️ [API Documentation](./docs/API_DOCS.md)
- 🏠 [Main README](./README.md)
- 💬 [GitHub Discussions](https://github.com/mrbrightsides/gasx/discussions)

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Email** - support@elpeef.com

### Response Time

- Bug reports: Within 48 hours
- Feature requests: Within 1 week
- Pull requests: Within 1 week

---

## License

By contributing to STC GasX, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## Thank You! 🙏

Your contributions make STC GasX better for everyone. Whether you're fixing a typo, adding a feature, or helping with documentation - every contribution matters!

**Happy coding!** 🚀

---

<div align="center">

**Questions?** Feel free to reach out!

[GitHub](https://github.com/mrbrightsides) | [Email](mailto:support@elpeef.com) | [Telegram](https://t.me/khudriakhmad)

</div>
