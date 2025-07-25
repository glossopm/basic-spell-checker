import TextEditor from './components/TextEditor';
import './styles/tailwind.css';

function App() {
  return (
    <main className="min-h-screen">
      <div className="app-container max-w-3xl mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Word Highlighter</h1>
        <TextEditor />
      </div>
    </main>
  );
}

export default App;