import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, '../src/config/wordlist.txt');
const outputFilePath = path.join(__dirname, '../src/config/wordSet.ts');

// Read the wordlist file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the wordlist file:', err);
    return;
  }

  // Split the text into an array of words
  const words = data.split('\n').map(word => word.trim()).filter(Boolean);

  // Create a Set and a Typescript string representation
  const wordSetTs = `export const wordSet: Set<string> = new Set([${words.map(word => `'${word}'`).join(', ')}]);\n`;

  // Write to a new Typescript file
  fs.writeFile(outputFilePath, wordSetTs, 'utf8', err => {
    if (err) {
      console.error('Error writing the wordSet file:', err);
    } else {
      console.log('wordSet.ts file has been created successfully.');
    }
  });
});