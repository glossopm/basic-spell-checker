import { 
  tokenizeInput, 
  isPunctuationAdjacent, 
  sanitizeWord, 
  hasCorrectPunctuationSpacing 
} from './tokenUtils';

describe('tokenUtils', () => {
  describe('tokenizeInput', () => {
    it('should tokenize simple words', () => {
      const result = tokenizeInput('hello world');
      expect(result).toEqual(['hello', ' ', 'world']);
    });

    it('should tokenize words with punctuation', () => {
      const result = tokenizeInput('Hello, world!');
      expect(result).toEqual(['Hello', ',', ' ', 'world', '!']);
    });

    it('should handle multiple spaces', () => {
      const result = tokenizeInput('hello   world');
      expect(result).toEqual(['hello', '   ', 'world']);
    });

    it('should handle mixed punctuation', () => {
      const result = tokenizeInput('Hi! This is a test? Yes.');
      expect(result).toEqual(['Hi', '!', ' ', 'This', ' ', 'is', ' ', 'a', ' ', 'test', '?', ' ', 'Yes', '.']);
    });

    it('should handle quotes and brackets', () => {
      const result = tokenizeInput('He said "Hello" (quietly)');
      expect(result).toEqual(['He', ' ', 'said', ' ', '"', 'Hello', '"', ' ', '(', 'quietly', ')']);
    });

    it('should handle empty string', () => {
      const result = tokenizeInput('');
      expect(result).toEqual([]);
    });

    it('should handle special characters', () => {
      const result = tokenizeInput('test@email.com');
      expect(result).toEqual(['test', '@', 'email', '.', 'com']);
    });
  });

  describe('isPunctuationAdjacent', () => {
    it('should identify punctuation tokens', () => {
      expect(isPunctuationAdjacent('!')).toBe(true);
      expect(isPunctuationAdjacent('?')).toBe(true);
      expect(isPunctuationAdjacent(',')).toBe(true);
      expect(isPunctuationAdjacent('.')).toBe(true);
      expect(isPunctuationAdjacent(';')).toBe(true);
      expect(isPunctuationAdjacent(':')).toBe(true);
    });

    it('should identify bracket tokens', () => {
      expect(isPunctuationAdjacent('(')).toBe(true);
      expect(isPunctuationAdjacent(')')).toBe(true);
      expect(isPunctuationAdjacent('[')).toBe(true);
      expect(isPunctuationAdjacent(']')).toBe(true);
      expect(isPunctuationAdjacent('{')).toBe(true);
      expect(isPunctuationAdjacent('}')).toBe(true);
    });

    it('should identify quote tokens', () => {
      expect(isPunctuationAdjacent('"')).toBe(true);
      expect(isPunctuationAdjacent("'")).toBe(true);
    });

    it('should not identify words as punctuation', () => {
      expect(isPunctuationAdjacent('hello')).toBe(false);
      expect(isPunctuationAdjacent('world')).toBe(false);
      expect(isPunctuationAdjacent('test123')).toBe(false);
    });

    it('should not identify whitespace as punctuation', () => {
      expect(isPunctuationAdjacent(' ')).toBe(false);
      expect(isPunctuationAdjacent('   ')).toBe(false);
      expect(isPunctuationAdjacent('\t')).toBe(false);
    });
  });

  describe('sanitizeWord', () => {
    it('should remove punctuation and convert to lowercase', () => {
      expect(sanitizeWord('Hello!')).toBe('hello');
      expect(sanitizeWord('WORLD?')).toBe('world');
      expect(sanitizeWord('test,')).toBe('test');
    });

    it('should handle words without punctuation', () => {
      expect(sanitizeWord('hello')).toBe('hello');
      expect(sanitizeWord('WORLD')).toBe('world');
    });

    it('should handle numbers', () => {
      expect(sanitizeWord('test123')).toBe('test123');
      expect(sanitizeWord('123')).toBe('123');
    });

    it('should handle empty strings', () => {
      expect(sanitizeWord('')).toBe('');
    });

    it('should remove all punctuation', () => {
      expect(sanitizeWord('he!!o??')).toBe('heo');
      expect(sanitizeWord('w@rd')).toBe('wrd');
    });
  });

  describe('hasCorrectPunctuationSpacing', () => {
    describe('sentence-ending punctuation (.!?;:,)', () => {
      it('should require space after punctuation', () => {
        const tokens = ['Hello', '!', ' ', 'World'];
        expect(hasCorrectPunctuationSpacing(tokens, 1)).toBe(true);
      });

      it('should flag missing space after punctuation', () => {
        const tokens = ['Hello', '!', 'World'];
        expect(hasCorrectPunctuationSpacing(tokens, 1)).toBe(false);
      });

      it('should allow punctuation at end of input', () => {
        const tokens = ['Hello', '!'];
        expect(hasCorrectPunctuationSpacing(tokens, 1)).toBe(true);
      });

      it('should handle multiple punctuation types', () => {
        const tokens = ['Test', '?', ' ', 'Yes', '.'];
        expect(hasCorrectPunctuationSpacing(tokens, 1)).toBe(true);
        expect(hasCorrectPunctuationSpacing(tokens, 4)).toBe(true);
      });
    });

    describe('opening brackets/quotes', () => {
      it('should require space before opening brackets', () => {
        const tokens = ['Hello', ' ', '(', 'world', ')'];
        expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(true);
      });

      it('should flag missing space before opening brackets', () => {
        const tokens = ['Hello', '(', 'world', ')'];
        expect(hasCorrectPunctuationSpacing(tokens, 1)).toBe(false);
      });

      it('should allow opening brackets at start of input', () => {
        const tokens = ['(', 'Hello', ')'];
        expect(hasCorrectPunctuationSpacing(tokens, 0)).toBe(true);
      });

      it('should handle quotes', () => {
        const tokens = ['He', ' ', '"', 'said', '"'];
        expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(true);
      });
    });

    describe('closing brackets', () => {
      it('should require space after closing brackets', () => {
        const tokens = ['(', 'Hello', ')', ' ', 'world'];
        expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(true);
      });

      it('should flag missing space after closing brackets', () => {
        const tokens = ['(', 'Hello', ')', 'world'];
        expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(false);
      });

      it('should allow closing brackets at end of input', () => {
        const tokens = ['(', 'Hello', ')'];
        expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(true);
      });
    });

    describe('complex scenarios', () => {    it('should handle complex sentence with multiple punctuation types', () => {
      const tokens = ['He', ' ', '(', 'quietly', ')', ' ', 'said', ',', ' ', '"', 'Hello', '!', '"'];
      expect(hasCorrectPunctuationSpacing(tokens, 2)).toBe(true); // (
      expect(hasCorrectPunctuationSpacing(tokens, 4)).toBe(true); // )
      expect(hasCorrectPunctuationSpacing(tokens, 7)).toBe(true); // ,
      expect(hasCorrectPunctuationSpacing(tokens, 9)).toBe(true); // "
      expect(hasCorrectPunctuationSpacing(tokens, 11)).toBe(true); // ! (followed by closing quote is valid)
      expect(hasCorrectPunctuationSpacing(tokens, 12)).toBe(true); // " (at end)
    });
    });
  });
});
