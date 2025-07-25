import React, { useState } from 'react';
import { tokenizeInput } from '../utils/tokenUtils';
import { validateAllTokens } from '../utils/wordValidation';

const TextEditor: React.FC = () => {
  const [inputText, setInputText] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const inputTokens = tokenizeInput(inputText);
  const tokenValidations = validateAllTokens(inputTokens);

  return (
    <div className="w-full max-w-2xl">
      <input
        type="text"
        value={inputText}
        onChange={handleChange}
        placeholder="Type words here..."
        className="border-b mb-4 w-full p-2 focus:outline-none focus:border-blue-500"
      />
      <div className="word-display">
        {inputTokens.map((token, index) => {
          const validation = tokenValidations[index];
          
          return (
            <span
              key={index}
              className={validation.className}
              title={validation.isValid ? '' : `Invalid ${validation.tokenType}`}
            >
              {token}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TextEditor;