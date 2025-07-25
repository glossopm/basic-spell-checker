# Basic Spell Checker

## Brief

Make a spell checker for Basic English

Time allowed: Up to 1 hour for research & planning, 1 hour for development

## Background

British American Scientific International Commercial (Basic) English is a constructed language. It has 850 English words, carefully chosen to make the language easy to learn but still powerful enough to communicate everyday ideas and actions. The rules of usage are identical to full English, so the speaker communicates in perfectly good, but simple, English.

This XKCD webcomic shows an example of communicating a complicated idea (the blueprints for the Saturn V rocket) using Basic English: https://xkcd.com/1133. To help authors writing in Basic English it would be helpful to use a spell checker that tells them when they are using Basic English.

## Objectives

The main objective is to build a working Basic English spell checker within the time allowed (~1h for research/planning, ~1h hour for development). This is not a lot of time, so consider how you scope your solution within the time constraints.

We are interested in how you think about solving user problems as well as the code that you write, so the task is deliberately left open for you to consider what the user experience should be like, or could be like given more time! There are no right or wrong answers, but you should consider what would people expect or be familiar with from a spell checker.

Similarly, we do not specify which tools you can use to implement the spell checker. We are most familiar with JavaScript (as that is what we primarily use at Overleaf), but use whichever tools you feel are best for the job.

## Questions and Considerations

### Technology Choices

#### Frontend Stack: React + TypeScript + Tailwind
**Choice**: React with TypeScript and Tailwind CSS
**Rationale**: 
- React provides component-based architecture ideal for text editing interfaces
- TypeScript ensures type safety for complex validation logic
- Tailwind enables rapid UI development with consistent styling
- Vite offers fast development experience with hot module replacement

#### No Backend Architecture
**Choice**: Client-side only application
**Rationale**:
- Basic English word set (850 words) is small enough for in-memory storage
- Modern browsers handle real-time validation efficiently
- Eliminates API latency and infrastructure complexity
- Enables offline functionality
**Consideration**: For larger dictionaries or collaborative features, backend would be necessary

### Core Implementation Decisions

#### Text Sanitization & Tokenization
**Implementation**: Comprehensive punctuation and spacing rules
**Rationale**: 
- Basic English follows standard English grammar rules
- Users expect spell checkers to handle punctuation correctly
- Proper tokenization ensures accurate word boundary detection

**Rules Implemented**:
- Sentence punctuation (.!?;:,) requires space after
- Opening brackets/quotes require space before
- Closing brackets/quotes require space after
- Handle edge cases: punctuation at sentence end, quotes containing punctuation

### Advanced Basic English Rules (Future Enhancements)

#### Validation Triggers & Performance

**Option 1: Real-time with Debouncing**
- Validates on every keystroke with 200ms delay
- **Pros**: Immediate feedback, modern UX expectation
- **Cons**: CPU intensive for large texts
- **Best for**: Short to medium texts (< 1000 words)

**Option 2: Manual Validation**
- Validate only on button click or explicit trigger
- **Pros**: Predictable performance, user controls when to check
- **Cons**: Less responsive, requires extra user action
- **Best for**: Large documents or performance-constrained environments

#### Word Form Validation
**Challenge**: Basic English allows specific word forms but restricts others

**Pluralization Rules**:
- Standard plurals: `-s`, `-es` (e.g., "books", "boxes")
- Irregular plurals: "children", "men", "women"
- **Implementation**: Maintain separate plural word set or stem-based validation

**Verb Forms (-ing endings)**:
- Present participles: "running", "jumping", "thinking"
- Gerunds as nouns: "reading is good"
- **Implementation**: Validate base verb exists in Basic English set

**Past Tense & Past Participle**:
- Regular: `-ed` endings (e.g., "walked", "played")
- Irregular: "went", "seen", "done"
- **Implementation**: Morphological analysis with rule-based validation

**Comparison Forms**:
- Comparative: `-er` (e.g., "bigger", "faster")
- Superlative: `-est` (e.g., "biggest", "fastest")
- Irregular: "better", "best", "worse", "worst"


#### Visual Feedback System
**Current**: Color-coded highlighting
- 🔴 Red: Invalid words (not in Basic English)
- 🟡 Yellow: Punctuation spacing errors

### Testing Strategy

#### Missing Test Coverage (Roadmap)
**React Component Testing**:
```typescript
// TextEditor.test.tsx
describe('TextEditor Component', () => {
  it('should highlight invalid words in real-time')
  it('should handle debounced validation')
  it('should display correct error tooltips')
  it('should maintain cursor position during validation')
})
```

**Integration Testing**:
- End-to-end user workflows
- Performance testing with large texts
- Cross-browser compatibility
- Accessibility compliance
