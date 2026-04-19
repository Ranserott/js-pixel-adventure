'use client';

import { useState, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ initialCode = '', onRun, onChange }) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Scroll to top on mount
    editor.setScrollTop(0);
    editor.setPosition({ lineNumber: 1, column: 1 });
    
    // Focus editor
    editor.focus();
    
    // Configure scrollbar
    editor.updateOptions({
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 10, bottom: 10 }
    });
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

  return (
    <div className="code-editor-wrapper">
      <div className="code-editor-toolbar">
        <div className="toolbar-left">
          <span className="editor-lang">JavaScript</span>
        </div>
        <div className="toolbar-right">
          <button 
            className="clear-btn"
            onClick={() => {
              setCode('');
              if (onChange) onChange('');
              if (editorRef.current) {
                editorRef.current.setValue('');
                editorRef.current.focus();
              }
            }}
          >
            🗑️
          </button>
          <button 
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRun}
            disabled={!code.trim() || isRunning}
          >
            ▶ {isRunning ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </div>
      </div>
      
      <div className="code-editor-content">
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            contextmenu: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            wordWrap: 'on'
          }}
        />
      </div>
      
      <div className="code-editor-footer">
        <span>{code.split('\n').length} líneas</span>
        <span>Ctrl+Enter para ejecutar</span>
      </div>
    </div>
  );
}
