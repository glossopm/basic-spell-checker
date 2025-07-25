import { wordSet } from '../config/wordSet';
import { sanitizeWord, isPunctuationAdjacent, hasCorrectPunctuationSpacing } from './tokenUtils';
import { findSuggestions } from './findSuggestions';

export interface TokenValidationResult {
  className: string;
  isValid: boolean;
  tokenType: 'word' | 'punctuation' | 'whitespace' | 'other';
  suggestions?: string[];
}

/**
 * Validates a token and returns its styling and validation status
 */
export const validateToken = (token: string, tokens: string[], index: number): TokenValidationResult => {
  const isWord = !isPunctuationAdjacent(token) && !/^\s+$/.test(token);
  const isPunctuation = isPunctuationAdjacent(token);
  const isWhitespace = /^\s+$/.test(token);

  let className = '';
  let isValid = true;
  let tokenType: TokenValidationResult['tokenType'] = 'other';
  let suggestions: string[] = [];

  if (isWord) {
    tokenType = 'word';
    const sanitizedToken = sanitizeWord(token);
    const isValidWord = wordSet.has(sanitizedToken);
    
    if (!isValidWord) {
      className = 'bg-red-200 text-red-800 px-1 rounded border-b-2 border-red-500 border-dotted';
      isValid = false;
      suggestions = findSuggestions(sanitizedToken);
    }
  } else if (isPunctuation) {
    tokenType = 'punctuation';
    const hasCorrectSpacing = hasCorrectPunctuationSpacing(tokens, index);
    
    if (!hasCorrectSpacing) {
      className = 'bg-yellow-200 text-yellow-800 px-1';
      isValid = false;
    }
  } else if (isWhitespace) {
    tokenType = 'whitespace';
  }

  return {
    className,
    isValid,
    tokenType,
    ...(suggestions.length > 0 && { suggestions })
  };
};

/**
 * Validates all tokens in an array and returns their validation results
 */
export const validateAllTokens = (tokens: string[]): TokenValidationResult[] => {
  return tokens.map((token, index) => validateToken(token, tokens, index));
};
