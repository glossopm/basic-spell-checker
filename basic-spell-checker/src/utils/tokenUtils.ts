/**
 * Tokenizes input text into words, punctuation, whitespace, and other characters
 * @param input - The input string to tokenize
 * @returns Array of tokens
 */
export const tokenizeInput = (input: string): string[] => {
  const tokens: string[] = [];
  // Regex to separate words, different types of punctuation, whitespace, and other characters
  const regex = /([a-zA-Z]+)|([.!?;:,]+)|([()[\]{}]+)|(['"]+)|(\s+)|([^\w\s.!?;:,()[\]{}'"]+)/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    tokens.push(match[0]);
  }
  
  return tokens;
};

/**
 * Checks if a token is purely punctuation (excludes whitespace and word characters)
 * @param token - The token to check
 * @returns True if the token is punctuation
 */
export const isPunctuationAdjacent = (token: string): boolean => {
  return /^[^\w\s]+$/.test(token);
};

/**
 * Sanitizes a word by removing punctuation and converting to lowercase
 * @param word - The word to sanitize
 * @returns The sanitized word
 */
export const sanitizeWord = (word: string): string => {
  return word.replace(/[^\w]/g, '').toLowerCase();
};

/**
 * Checks if punctuation has correct spacing according to English grammar rules
 * @param tokens - Array of all tokens
 * @param index - Index of the current punctuation token
 * @returns True if spacing is correct
 */
export const hasCorrectPunctuationSpacing = (tokens: string[], index: number): boolean => {
  const token = tokens[index];
  const prevToken = index > 0 ? tokens[index - 1] : '';
  const nextToken = index < tokens.length - 1 ? tokens[index + 1] : '';
  
  // Punctuation that should have space after: .!?;:,
  if (/^[.!?;:,]+$/.test(token)) {
    if (index < tokens.length - 1) {
      // Allow closing quotes/brackets after punctuation
      if (/^[)\]}'"]/.test(nextToken)) {
        return true;
      }
      // Otherwise require space
      if (!/^\s/.test(nextToken)) {
        return false;
      }
    }
  }
  
  // Opening brackets should have space before (unless it's the first token)
  if (/^[([{]+$/.test(token)) {
    if (index > 0 && !/\s$/.test(prevToken)) {
      return false;
    }
  }
  
  // Closing brackets should have space after (unless it's the last token)
  if (/^[)\]}]+$/.test(token)) {
    if (index < tokens.length - 1 && !/^\s/.test(nextToken)) {
      return false;
    }
  }
  
  // Handle quotes specially - they can be opening or closing
  if (/^['"]+$/.test(token)) {
    // If there's a space before, it's likely an opening quote
    const isOpeningQuote = index === 0 || /\s$/.test(prevToken);
    // If there's a space after, it's likely a closing quote
    const isClosingQuote = index === tokens.length - 1 || /^\s/.test(nextToken);
    
    if (isOpeningQuote && !isClosingQuote) {
      // Opening quote - should have space before (unless first token)
      if (index > 0 && !/\s$/.test(prevToken)) {
        return false;
      }
    } else if (isClosingQuote && !isOpeningQuote) {
      // Closing quote - should have space after (unless last token)  
      if (index < tokens.length - 1 && !/^\s/.test(nextToken)) {
        return false;
      }
    }
    // If both or neither, assume it's valid (ambiguous case)
  }
  
  return true;
};
