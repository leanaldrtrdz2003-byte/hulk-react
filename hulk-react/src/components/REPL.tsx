import { useState, useRef, useEffect } from 'react';
import './REPL.css';
import { execute, LexicalError, SyntaxError, SemanticError } from '../interpreter';
import type { HistoryEntry } from '../App';

export default function REPL({ history, onExecute }: { history: HistoryEntry[]; onExecute: (code: string, result: string | null, error: string | null) => void }) {
  const [code, setCode] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => { outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }); }, [history]);

  const handleExecute = async () => {
    if (!code.trim() || isExecuting) return;
    setIsExecuting(true);
    try {
      if (code.trim() === '/clear') { onExecute('clear', null, null); setCode(''); setIsExecuting(false); return; }
      const result = execute(code);
      const resultStr = result === undefined ? '' : String(result);
      if (resultStr === 'CLEAR') onExecute(code, '__CLEAR__', null);
      else onExecute(code, resultStr, null);
      setCode('');
    } catch (err) {
      let msg = String(err);
      if (err instanceof LexicalError) msg = `Lexical Error: ${err.message}`;
      else if (err instanceof SyntaxError) msg = `Syntax Error: ${err.message}`;
      else if (err instanceof SemanticError) msg = `Semantic Error: ${err.message}`;
      onExecute(code, null, msg); setCode('');
    } finally { setIsExecuting(false); }
  };

  return (
    <div className="repl-container">
      <div className="output" ref={outputRef}>
        {history.length === 0 ? (
          <div className="welcome"><div className="welcome-icon">◇</div><p>Write HULK code and press Enter</p><p className="hint">{'2 + 2, print("hello"), /clear'}</p></div>
        ) : history.map((entry, i) => (
          <div key={i} className="history-entry">
            <div className="message-row"><span className="prompt">&gt;</span><span className="user-message">{entry.input}</span></div>
            {entry.output && entry.output !== '__CLEAR__' && entry.output !== '' && <div className="response-row">{entry.output}</div>}
            {entry.error && <div className="error-row">{entry.error}</div>}
          </div>
        ))}
      </div>
      <div className="input-area">
        <div className="input-wrapper">
          <span className="prompt">&gt;</span>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleExecute()} placeholder="write your code..." className="code-input" autoFocus />
          <button onClick={handleExecute} disabled={!code.trim() || isExecuting} className="execute-btn">{isExecuting ? '...' : '→'}</button>
        </div>
        <div className="hint-text">Press Enter to execute • /clear to clear</div>
      </div>
    </div>
  );
}