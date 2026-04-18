'use client';

import { useState, useRef } from 'react';

export default function CodeEditor({ onRunCode, isRunning, levelHint }) {
  const [code, setCode] = useState('');
  const [showFunctions, setShowFunctions] = useState(true);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }

    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (code.trim() && !isRunning) {
        onRunCode(code);
      }
    }
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const insertCode = (snippet) => {
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + snippet.length;
    }, 0);
  };

  const snippets = [
    { label: 'move right', code: 'move("right", )' },
    { label: 'move left', code: 'move("left", )' },
    { label: 'move up', code: 'move("up", )' },
    { label: 'move down', code: 'move("down", )' },
    { label: 'let', code: 'let  = ' },
    { label: 'const', code: 'const  = ' },
    { label: 'for', code: 'for (let i = 0; i < ; i++) {\n  \n}' },
    { label: 'while', code: 'while () {\n  \n}' },
    { label: 'if', code: 'if () {\n  \n}' },
    { label: 'function', code: 'function () {\n  \n}' },
    { label: 'console.log', code: 'console.log()' },
  ];

  const lines = code.split('\n');
  const lineCount = lines.length || 1;

  return (
    <div className="code-editor">
      <div className="editor-header">
        <h3>EDITOR</h3>
        <div className="editor-actions">
          <button className="action-btn" onClick={() => setCode('')} title="Limpiar">⌫</button>
          <button className="action-btn" onClick={() => setShowFunctions(!showFunctions)} title="Funciones">❐</button>
        </div>
      </div>

      {showFunctions && (
        <div className="snippets-bar">
          <span className="snippets-label">SNIPPETS:</span>
          {snippets.map((s, i) => (
            <button key={i} className="snippet-btn" onClick={() => insertCode(s.code)}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="editor-area">
        <div className="line-numbers" ref={lineNumbersRef}>
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="line-number">{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={'// Mueve el mago a la derecha\nmove("right", 3);'}
          spellCheck={false}
          disabled={isRunning}
          className="code-textarea"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <div className="functions-reference">
        <details>
          <summary>📖 Referencia</summary>
          <div className="function-list">
            <div className="function-item">
              <code>move("right", n)</code>
              <span>Mueve n pasos a la derecha</span>
            </div>
            <div className="function-item">
              <code>move("left", n)</code>
              <span>Mueve n pasos a la izquierda</span>
            </div>
            <div className="function-item">
              <code>move("up", n)</code>
              <span>Mueve n pasos arriba</span>
            </div>
            <div className="function-item">
              <code>move("down", n)</code>
              <span>Mueve n pasos abajo</span>
            </div>
            <div className="function-item">
              <code>console.log()</code>
              <span>Muestra un mensaje</span>
            </div>
          </div>
        </details>
      </div>

      <button 
        className={`run-button ${isRunning ? 'running' : ''}`}
        onClick={() => onRunCode(code)}
        disabled={isRunning || !code.trim()}
      >
        {isRunning ? (
          <>
            <span className="spinner">◌</span>
            EJECUTANDO...
          </>
        ) : (
          <>
            <span className="play-icon">▶</span>
            EJECUTAR
          </>
        )}
      </button>

      <p className="shortcut-hint">Ctrl + Enter para ejecutar</p>
    </div>
  );
}
