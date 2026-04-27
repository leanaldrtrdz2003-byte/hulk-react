import { useState } from 'react';
import './App.css';
import REPL from './components/REPL';

export interface HistoryEntry { input: string; output: string | null; error: string | null; }

function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const handleExecute = (code: string, result: string | null, error: string | null) => {
    if (code === 'clear' && result === null && error === null) { setHistory([]); return; }
    if (result === '__CLEAR__') { setHistory([]); return; }
    setHistory(prev => [...prev, { input: code, output: result, error }]);
  };
  return (
    <div className="app">
      <header className="header">
        <div className="logo-section"><div className="logo"><span>H</span></div><h1>HULK</h1></div>
        <div className="status"><span className="dot"></span><span>Ready</span></div>
      </header>
      <main className="main"><REPL history={history} onExecute={handleExecute} /></main>
    </div>
  );
}
export default App;