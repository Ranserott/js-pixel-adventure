'use client';

import { useState, useRef } from 'react';

/**
 * CodeEditor - Editor futurista con sintaxis básica
 */
export default function CodeEditor({ onRunCode, isRunning, levelHint, onShowHint }) {
  const [code, setCode] = useState('');
  const [showFunctions, setShowFunctions] = useState(true);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Manejar Tab y shortcuts
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

    // Ctrl/Cmd + Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (code.trim() && !isRunning) {
        onRunCode(code);
      }
    }

    // Autocompletar paréntesis
    if (e.key === '(') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const newCode = code.substring(0, start) + '(' + ')' + code.substring(start + 1);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }

    if (e.key === '{') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const newCode = code.substring(0, start) + '{' + '}' + code.substring(start + 1);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }
  };

  // Sincronizar scroll
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Insertar snippet
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
    { label: 'move()', code: 'move()' },
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
      {/* Header */}
      <div className="editor-header">
        <h3>EDITOR</h3>
        <div className="editor-actions">
          <button 
            className="action-btn"
            onClick={() => setCode('')}
            title="Limpiar"
          >
            ⌫
          </button>
          <button 
            className="action-btn"
            onClick={() => setShowFunctions(!showFunctions)}
            title="Funciones"
          >
            ❐
          </button>
        </div>
      </div>

      {/* Snippets */}
      {showFunctions && (
        <div className="snippets-bar">
          <span className="snippets-label">SNIPPETS:</span>
          {snippets.map((s, i) => (
            <button
              key={i}
              className="snippet-btn"
              onClick={() => insertCode(s.code)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
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
          placeholder="// Escribe tu código aquí..."
          spellCheck={false}
          disabled={isRunning}
          className="code-textarea"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Referencia de funciones */}
      <div className="functions-reference">
        <details>
          <summary>📖 Referencia rápida</summary>
          <div className="function-list">
            <div className="function-item">
              <code>move(n)</code>
              <span>Mueve n pasos</span>
            </div>
            <div className="function-item">
              <code>say("texto")</code>
              <span>Di algo</span>
            </div>
            <div className="function-item">
              <code>console.log()</code>
              <span>Muestra mensaje</span>
            </div>
          </div>
        </details>
      </div>

      {/* Botón ejecutar */}
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
            EJECUTAR CÓDIGO
          </>
        )}
      </button>

      <p className="shortcut-hint">
        Ctrl + Enter para ejecutar
      </p>
    </div>
  );
}
