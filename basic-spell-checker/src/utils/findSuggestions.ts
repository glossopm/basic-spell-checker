import { get as getLevenshteinDistance } from 'fast-levenshtein';
import { wordSet } from '../config/wordSet';

export const findSuggestions = (word: string): string[] => {
  const suggestions: string[] = [];
  const lowerWord = word.toLowerCase();
  
  // Don't suggest anything if the word is already valid
  if (wordSet.has(lowerWord)) {
    return suggestions;
  }
  
  for (const validWord of wordSet) {
    if (getLevenshteinDistance(lowerWord, validWord) === 1) {
      suggestions.push(validWord);
      // Optional: limit suggestions for performance
      if (suggestions.length >= 5) break;
    }
  }
  
  return suggestions;
};