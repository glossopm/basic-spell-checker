import { findSuggestions } from './findSuggestions';

// Mock with minimal wordSet - only words needed for our specific tests
jest.mock('../config/wordSet', () => ({
  wordSet: new Set([
    // Core test words
    'the', 'and', 'you', 'cat', 'hat', 'bat', 'go', 'get', 'come', 'take',
    // Single character words
    'a', 'i',
    // Two character words for edge cases
    'an', 'to', 'of', 'or', 'me', 'we', 'he'
  ])
}));

describe('findSuggestions', () => {
  describe('valid words should return empty array', () => {
    it('should return empty array for existing words', () => {
      expect(findSuggestions('cat')).toEqual([]);
      expect(findSuggestions('the')).toEqual([]);
      expect(findSuggestions('go')).toEqual([]);
    });
  });

  describe('substitution errors (1 character different)', () => {
    it('should suggest "cat" for "bat"', () => {
      const result = findSuggestions('zat'); // z->c, z->h, z->b
      expect(result).toContain('cat');
      expect(result).toContain('hat');
      expect(result).toContain('bat');
    });

    it('should suggest "the" for "tha"', () => {
      const result = findSuggestions('tha'); // a->e (1 substitution)
      expect(result).toContain('the');
    });

    it('should suggest "come" for "coma"', () => {
      const result = findSuggestions('coma'); // a->e
      expect(result).toContain('come');
    });
  });

  describe('insertion errors (extra character)', () => {
    it('should suggest "go" when extra character at start', () => {
      const result = findSuggestions('xgo'); // remove x
      expect(result).toContain('go');
    });

    it('should suggest "go" when extra character at end', () => {
      const result = findSuggestions('gox'); // remove x
      expect(result).toContain('go');
    });

    it('should suggest "cat" when extra character in middle', () => {
      const result = findSuggestions('caxt'); // remove x
      expect(result).toContain('cat');
    });
  });

  describe('deletion errors (missing character)', () => {
    it('should suggest "cat" when missing first character', () => {
      const result = findSuggestions('at'); // add c (now 'at' is not in wordSet)
      expect(result).toContain('cat');
    });

    it('should suggest "the" when missing last character', () => {
      const result = findSuggestions('th'); // add e
      expect(result).toContain('the');
    });

    it('should suggest "cat" when missing middle character', () => {
      const result = findSuggestions('ct'); // add a
      expect(result).toContain('cat');
    });
  });

  describe('case sensitivity', () => {
    it('should handle uppercase input', () => {
      const result = findSuggestions('CAT');
      expect(result).toEqual([]); // CAT should match cat
    });

    it('should handle mixed case', () => {
      const result = findSuggestions('CaT');
      expect(result).toEqual([]); // CaT should match cat
    });

    it('should suggest lowercase for uppercase typos', () => {
      const result = findSuggestions('THA'); // should suggest 'the'
      expect(result).toContain('the');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = findSuggestions('');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('a'); // empty -> 'a' (1 insertion)
      expect(result).toContain('i'); // empty -> 'i' (1 insertion)
    });

    it('should handle single character typos', () => {
      const result = findSuggestions('x');
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('a'); // x->a (1 substitution)
      expect(result).toContain('i'); // x->i (1 substitution)
    });

    it('should return empty for words with edit distance > 1', () => {
      const result = findSuggestions('xyz'); // no word is 1 edit away
      expect(result).toEqual([]);
    });

    it('should return empty for very long words', () => {
      const result = findSuggestions('superlongword');
      expect(result).toEqual([]);
    });
  });

  describe('performance limits', () => {
    it('should limit results to 5 suggestions max', () => {
      const result = findSuggestions('x'); // might match many single-char words
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should always return an array', () => {
      const testInputs = ['valid', 'invalid', '', 'x', 'cat', 'xyz'];
      testInputs.forEach(input => {
        const result = findSuggestions(input);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('realistic typo scenarios', () => {
    it('should handle common letter substitutions', () => {
      const result = findSuggestions('tha'); // a->e substitution
      expect(result).toContain('the');
    });

    it('should handle missing vowels', () => {
      const result = findSuggestions('nd'); // missing 'a' from 'and'
      expect(result).toContain('and');
    });

    it('should handle extra consonants', () => {
      const result = findSuggestions('ggo'); // extra 'g' in 'go'
      expect(result).toContain('go');
    });
  });

  describe('return value validation', () => {
    it('should return unique suggestions only', () => {
      const result = findSuggestions('zat'); // should suggest multiple words
      const uniqueResults = [...new Set(result)];
      expect(result.length).toBe(uniqueResults.length);
    });

    it('should return consistent results', () => {
      const result1 = findSuggestions('tha');
      const result2 = findSuggestions('tha');
      expect(result1).toEqual(result2);
    });

    it('should return lowercase suggestions', () => {
      const result = findSuggestions('THA');
      result.forEach(suggestion => {
        expect(suggestion).toBe(suggestion.toLowerCase());
      });
    });
  });
});
