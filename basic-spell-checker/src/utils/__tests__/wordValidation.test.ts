import { validateToken, validateAllTokens } from '../wordValidation';

// Mock the wordSet to have predictable test results
jest.mock('../../config/wordSet', () => ({
  wordSet: new Set(['hello', 'world', 'test', 'valid', 'word', 'he', 'quietly', 'said'])
}));

describe('wordValidation', () => {
  describe('validateToken', () => {
    describe('word validation', () => {
      it('should validate valid words', () => {
        const tokens = ['hello', ' ', 'world'];
        const result = validateToken('hello', tokens, 0);
        
        expect(result).toEqual({
          className: '',
          isValid: true,
          tokenType: 'word'
        });
      });

      it('should flag invalid words', () => {
        const tokens = ['invalidword', ' ', 'test'];
        const result = validateToken('invalidword', tokens, 0);
        
        expect(result).toEqual({
          className: 'bg-red-200 text-red-800 px-1',
          isValid: false,
          tokenType: 'word'
        });
      });

      it('should handle case-insensitive validation', () => {
        const tokens = ['HELLO', ' ', 'World'];
        const result1 = validateToken('HELLO', tokens, 0);
        const result2 = validateToken('World', tokens, 2);
        
        expect(result1.isValid).toBe(true);
        expect(result2.isValid).toBe(true);
      });
    });

    describe('punctuation validation', () => {
      it('should validate correctly spaced punctuation', () => {
        const tokens = ['Hello', '!', ' ', 'World'];
        const result = validateToken('!', tokens, 1);
        
        expect(result).toEqual({
          className: '',
          isValid: true,
          tokenType: 'punctuation'
        });
      });

      it('should flag incorrectly spaced punctuation', () => {
        const tokens = ['Hello', '!', 'World'];
        const result = validateToken('!', tokens, 1);
        
        expect(result).toEqual({
          className: 'bg-yellow-200 text-yellow-800 px-1',
          isValid: false,
          tokenType: 'punctuation'
        });
      });

      it('should handle opening brackets', () => {
        const tokens = ['Hello', ' ', '(', 'world', ')'];
        const result = validateToken('(', tokens, 2);
        
        expect(result.isValid).toBe(true);
        expect(result.tokenType).toBe('punctuation');
      });

      it('should flag incorrectly spaced opening brackets', () => {
        const tokens = ['Hello', '(', 'world', ')'];
        const result = validateToken('(', tokens, 1);
        
        expect(result.isValid).toBe(false);
        expect(result.tokenType).toBe('punctuation');
      });
    });

    describe('whitespace validation', () => {
      it('should identify whitespace tokens', () => {
        const tokens = ['hello', ' ', 'world'];
        const result = validateToken(' ', tokens, 1);
        
        expect(result).toEqual({
          className: '',
          isValid: true,
          tokenType: 'whitespace'
        });
      });

      it('should handle multiple spaces', () => {
        const tokens = ['hello', '   ', 'world'];
        const result = validateToken('   ', tokens, 1);
        
        expect(result.tokenType).toBe('whitespace');
        expect(result.isValid).toBe(true);
      });
    });

    describe('other token types', () => {
      it('should handle unknown token types', () => {
        const tokens = ['hello', '@', 'world'];
        const result = validateToken('@', tokens, 1);
        
        expect(result).toEqual({
          className: '',
          isValid: true,
          tokenType: 'punctuation' // @ is classified as punctuation by our current logic
        });
      });
    });
  });

  describe('validateAllTokens', () => {
    it('should validate an array of mixed tokens', () => {
      const tokens = ['Hello', '!', ' ', 'invalid', ' ', 'word', '.'];
      const results = validateAllTokens(tokens);
      
      expect(results).toHaveLength(7);
      
      // Hello - valid word
      expect(results[0]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'word'
      });
      
      // ! - valid punctuation (has space after)
      expect(results[1]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'punctuation'
      });
      
      // space - whitespace
      expect(results[2]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'whitespace'
      });
      
      // invalid - invalid word
      expect(results[3]).toEqual({
        className: 'bg-red-200 text-red-800 px-1',
        isValid: false,
        tokenType: 'word'
      });
      
      // space - whitespace
      expect(results[4]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'whitespace'
      });
      
      // word - valid word
      expect(results[5]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'word'
      });
      
      // . - valid punctuation (at end)
      expect(results[6]).toEqual({
        className: '',
        isValid: true,
        tokenType: 'punctuation'
      });
    });

    it('should handle empty array', () => {
      const results = validateAllTokens([]);
      expect(results).toEqual([]);
    });

    it('should handle single token', () => {
      const results = validateAllTokens(['hello']);
      expect(results).toHaveLength(1);
      expect(results[0].tokenType).toBe('word');
      expect(results[0].isValid).toBe(true);
    });

    it('should handle complex sentence with multiple error types', () => {
      const tokens = ['He', '(', 'quietly', ')', 'said', '!', 'invalidword'];
      const results = validateAllTokens(tokens);
      
      expect(results).toHaveLength(7);
      
      // He - valid word
      expect(results[0].isValid).toBe(true);
      
      // ( - invalid spacing (no space before)
      expect(results[1].isValid).toBe(false);
      expect(results[1].tokenType).toBe('punctuation');
      
      // quietly - valid word
      expect(results[2].isValid).toBe(true);
      
      // ) - invalid spacing (no space after)
      expect(results[3].isValid).toBe(false);
      expect(results[3].tokenType).toBe('punctuation');
      
      // said - valid word
      expect(results[4].isValid).toBe(true);
      
      // ! - invalid spacing (no space after)
      expect(results[5].isValid).toBe(false);
      expect(results[5].tokenType).toBe('punctuation');
      
      // invalidword - invalid word
      expect(results[6].isValid).toBe(false);
      expect(results[6].tokenType).toBe('word');
    });
  });
});
