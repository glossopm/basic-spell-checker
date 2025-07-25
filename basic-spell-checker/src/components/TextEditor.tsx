import React, { useState } from 'react';
import { tokenizeInput } from '../utils/tokenUtils';
import { validateAllTokens } from '../utils/wordValidation';
import Tooltip from './Tooltip';

const TextEditor: React.FC = () => {
  const [inputText, setInputText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleReplaceWord = (tokenIndex: number, newWord: string) => {
    const tokens = tokenizeInput(inputText);
    tokens[tokenIndex] = newWord;
    const newText = tokens.join('');
    setInputText(newText);
  };

  const inputTokens = tokenizeInput(inputText);
  const tokenValidations = validateAllTokens(inputTokens);

  return (
    <div className="w-full" style={{ width: '600px', maxWidth: '100%' }}>
      <textarea
        value={inputText}
        onChange={handleChange}
        placeholder="Type words here..."
        className="border border-gray-300 rounded-md mb-4 p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none min-h-[120px] max-h-[300px] overflow-y-auto"
        rows={5}
        style={{ width: '600px', maxWidth: '100%' }}
      />
      <div className="word-display whitespace-pre-wrap border border-gray-200 rounded-md p-3 bg-gray-50 leading-relaxed min-h-[120px]" style={{ width: '600px', maxWidth: '100%' }}>
        {inputTokens.map((token, index) => {
          const validation = tokenValidations[index];
          
          // Create tooltip content based on validation
          let tooltipContent = '';
          let suggestions: string[] = [];
          
          if (!validation.isValid) {
            if (validation.tokenType === 'word' && validation.suggestions) {
              suggestions = validation.suggestions;
              tooltipContent = suggestions.length > 0 
                ? `Misspelled word` 
                : `Invalid ${validation.tokenType}`;
            } else {
              tooltipContent = `Invalid ${validation.tokenType}`;
            }
          }

          return (
            <Tooltip
              key={index}
              content={tooltipContent}
              suggestions={suggestions}
              className={validation.className}
              onSuggestionClick={(newWord) => handleReplaceWord(index, newWord)}
            >
              {token}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default TextEditor;