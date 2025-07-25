# Spell Checker Accessibility Features

## Overview
The spell checker includes comprehensive accessibility features to ensure it's usable by all users, including those using screen readers and keyboard navigation.

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Use Tab to navigate between misspelled words
- **Arrow Keys**: When a tooltip is open, use ↑/↓ arrows to navigate between suggestions
- **Enter**: Select the currently focused suggestion
- **Escape**: Close the tooltip

### Screen Reader Support
- **ARIA Labels**: Each misspelled word has descriptive labels including available suggestions
- **Role Attributes**: Proper semantic roles for tooltips and suggestion lists
- **Live Regions**: Screen readers announce validation changes
- **Descriptive Text**: Clear descriptions of errors and available actions

### Visual Indicators
- **Color Coding**: Red background for misspelled words with dotted underline
- **High Contrast**: Sufficient color contrast for visibility
- **Focus Indicators**: Clear focus rings for keyboard navigation
- **Hover States**: Visual feedback for interactive elements

### Tooltip Features
- **Persistent on Focus**: Tooltips stay open when focused for keyboard users
- **Mouse/Touch Support**: Works with mouse hover and touch interactions
- **Positioning**: Smart positioning to avoid viewport edges
- **Dismissible**: Multiple ways to close tooltips (click outside, ESC key, selection)

## Usage Example

```typescript
// The spell checker automatically provides accessibility features
<TextEditor />

// Misspelled words will show:
// - Visual indicators (red background, dotted underline)
// - Tooltips with suggestions on hover/focus
// - Keyboard navigation through suggestions
// - Screen reader announcements
```

## WCAG Compliance
This implementation follows WCAG 2.1 AA guidelines:
- **Perceivable**: Clear visual and textual indicators
- **Operable**: Full keyboard accessibility
- **Understandable**: Clear labels and instructions
- **Robust**: Proper semantic markup and ARIA attributes
