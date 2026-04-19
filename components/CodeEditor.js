'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ initialCode = '', onRun, onChange }) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor settings
    editor.updateOptions({
      scrollBeyondLastLine: true,
      automaticLayout: true,
      padding: { top: 16, bottom: 16 },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      }
    });
    
    // Focus the editor
    editor.focus();
  }, []);

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

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  }, [handleRun]);

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 15,
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontLigatures: true,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: true,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 20, bottom: 20 },
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    folding: true,
    foldingHighlight: true,
    renderLineHighlight: 'all',
    bracketPairColorization: { enabled: true },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: false,
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12
    },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    overviewRulerLanes: 0,
    contextmenu: true,
    autoIndent: 'full',
    formatOnPaste: true,
    formatOnType: true
  };

  return (
    <div className="monaco-editor-container" onKeyDown={handleKeyDown}>
      <div className="editor-toolbar">
        <div className="editor-info">
          <span className="editor-language">JavaScript</span>
          <span className="editor-lines">{code.split('\n').length} líneas</span>
        </div>
        <div className="editor-actions">
          <button 
            className="clear-btn" 
            onClick={() => {
              setCode('');
              if (onChange) onChange('');
              if (editorRef.current) {
                editorRef.current.focus();
              }
            }}
            title="Limpiar (Ctrl+Shift+Del)"
          >
            🗑️ Limpiar
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
          onMount={handleEditorDidMount}
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
        <span>💡 Ctrl + Enter para ejecutar</span>
      </div>
    </div>
  );
}
