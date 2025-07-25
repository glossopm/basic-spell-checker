import { wordSet } from '../config/wordSet';
import { sanitizeWord, isPunctuationAdjacent, hasCorrectPunctuationSpacing } from './tokenUtils';

export interface TokenValidationResult {
  className: string;
  isValid: boolean;
  tokenType: 'word' | 'punctuation' | 'whitespace' | 'other';
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

  if (isWord) {
    tokenType = 'word';
    const sanitizedToken = sanitizeWord(token);
    const isValidWord = wordSet.has(sanitizedToken);
    
    if (!isValidWord) {
      className = 'bg-red-200 text-red-800 px-1';
      isValid = false;
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
    tokenType
  };
};

/**
 * Validates all tokens in an array and returns their validation results
 */
export const validateAllTokens = (tokens: string[]): TokenValidationResult[] => {
  return tokens.map((token, index) => validateToken(token, tokens, index));
};
