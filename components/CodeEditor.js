'use client';

import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ initialCode = '', onRun, onChange }) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = useCallback((value) => {
    setCode(value || '');
    if (onChange) onChange(value || '');
  }, [onChange]);

  const handleRun = useCallback(() => {
    if (!code.trim()) return;
    setIsRunning(true);
    if (onRun) onRun(code);
    setTimeout(() => setIsRunning(false), 500);
  }, [code, onRun]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 16, bottom: 16 },
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    contextmenu: true,
    folding: true,
    foldingHighlight: true,
    renderLineHighlight: 'all',
    bracketPairColorization: { enabled: true },
  };

  return (
    <div className="monaco-editor-container">
      <div className="editor-toolbar">
        <div className="editor-info">
          <span className="editor-language">JavaScript</span>
          <span className="editor-lines">{code.split('\n').length} líneas</span>
        </div>
        <div className="editor-actions">
          <button 
            className="clear-btn" 
            onClick={() => handleEditorChange('')}
            title="Limpiar"
          >
            🗑️
          </button>
          <button 
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={!code.trim() || isRunning}
          >
            {isRunning ? '◌' : '▶'} {isRunning ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </div>
      </div>
      
      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={editorOptions}
          loading={
            <div className="editor-loading">
              <span>⌛ Cargando editor...</span>
            </div>
          }
        />
      </div>

      <div className="editor-shortcuts">
        <span>Ctrl+Enter para ejecutar</span>
      </div>
    </div>
  );
}
