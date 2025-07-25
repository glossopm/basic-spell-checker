# Basic Spell Checker

A real-time spell checker for Basic English (850-word vocabulary) built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Real-time validation** - Highlights errors as you type
- ✅ **Punctuation checking** - Validates proper spacing around punctuation
- ✅ **Visual feedback** - Color-coded error highlighting
- ✅ **Basic English compliance** - Uses the official 850-word vocabulary

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Clone the repository
git clone <repository-url>
cd basic-spell-checker

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
```

## How to Use

1. **Start typing** in the text input field
2. **Invalid words** are highlighted in red (not in Basic English vocabulary)
3. **Punctuation errors** are highlighted in yellow (incorrect spacing)

### Example Usage

```
✅ "Hello! This is a test."
❌ "Hello!This is a test"  (missing space after !)
❌ "Hello! This is a demonstration."  (demonstration not in Basic English)
```

## Architecture

### Technology Stack
- **React 19** - Component-based UI
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Jest** - Testing framework

### Validation Logic
- **Word Validation**: Checks against 850-word Basic English set
- **Punctuation Rules**: Validates spacing around various punctuation marks
- **Real-time Updates**: Currently validates on every keystroke (debouncing planned)
