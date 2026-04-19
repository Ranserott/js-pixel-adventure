'use client';

import { useState, useEffect, useCallback } from 'react';
import { curriculum } from '../data/curriculum';
import { runCode, analyzeCodeStructure, getFriendlyError, getLevelHint } from '../utils/evaluator';

export default function Home() {
  const [view, setView] = useState('home'); // home, module, lesson, challenge, code
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('theory'); // theory, challenge, code

  // Cargar progreso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('js-learn-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLessons(data.completedLessons || []);
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }
  }, []);

  // Guardar progreso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('js-learn-progress', JSON.stringify({
        completedLessons
      }));
    }
  }, [completedLessons]);

  // Ejecutar código
  const handleRunCode = useCallback(() => {
    if (!currentLesson?.challenge) return;
    
    setError(null);
    setOutput([]);
    setTestResults([]);
    
    const onProgress = (data) => {
      if (data.type === 'console') {
        setOutput(prev => [...prev, data.text]);
      }
    };
    
    const result = runCode(code, currentLesson, onProgress);
    
    if (result.success) {
      setOutput(prev => [...prev, '✅ ¡Correcto! Todos los tests pasaron.']);
    } else {
      setError(result.error);
    }
    
    if (result.testResults) {
      setTestResults(result.testResults);
    }
    
    // Marcar como completado si pasa
    if (result.success && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
    }
    
  }, [code, currentLesson, completedLessons]);

  // Navegación
  const goToModule = (moduleKey) => {
    setCurrentModule(moduleKey);
    setView('module');
    setCurrentLesson(null);
  };

  const goToLesson = (lesson) => {
    setCurrentLesson(lesson);
    setView('lesson');
    setCode('');
    setOutput([]);
    setError(null);
    setTestResults([]);
    setShowHint(false);
    setActiveTab('theory');
  };

  const goToChallenge = () => {
    setView('challenge');
    setActiveTab('code');
  };

  const goHome = () => {
    setView('home');
    setCurrentModule(null);
    setCurrentLesson(null);
    setCode('');
    setOutput([]);
    setError(null);
  };

  // ═══════════════════════════════════════════════════════════
  // PANTALLA PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  if (view === 'home') {
    const progress = Math.round((completedLessons.length / getTotalLessons()) * 100);
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>JavaScript Aprender</h1>
          </div>
          <div className="progress-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">{progress}%</text>
            </svg>
          </div>
        </header>

        <main className="modules-grid">
          {Object.entries(curriculum).map(([key, module]) => (
            <div key={key} className="module-card" onClick={() => goToModule(key)}>
              <div className="module-icon">{module.icon}</div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              <div className="module-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(module.lessons.filter(l => completedLessons.includes(l.id)).length / module.lessons.length) * 100}%` 
                    }}
                  />
                </div>
                <span className="progress-text">
                  {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                </span>
              </div>
            </div>
          ))}
        </main>

        <footer className="learn-footer">
          <p>Aprende JavaScript paso a paso 📘 → 🔀 → ⚡ → 📦</p>
        </footer>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE MÓDULO
  // ═══════════════════════════════════════════════════════════
  if (view === 'module' && currentModule) {
    const module = curriculum[currentModule];
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="back-btn" onClick={goHome}>←</button>
          <div className="header-title">
            <span className="module-icon">{module.icon}</span>
            <h1>{module.title}</h1>
          </div>
        </header>

        <main className="lessons-list">
          {module.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || completedLessons.includes(module.lessons[index - 1].id);
            
            return (
              <div 
                key={lesson.id} 
                className={`lesson-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && goToLesson(lesson)}
              >
                <div className="lesson-number">
                  {isCompleted ? '✓' : isUnlocked ? index + 1 : '🔒'}
                </div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <span className="lesson-type">{lesson.type === 'lesson' ? '📖 Lección' : '💻 Desafío'}</span>
                </div>
                <div className="lesson-arrow">→</div>
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE LECCIÓN CON DESAFÍO
  // ═══════════════════════════════════════════════════════════
  if (view === 'lesson' && currentLesson) {
    const module = curriculum[currentModule];
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="back-btn" onClick={() => goToModule(currentModule)}>←</button>
          <div className="header-title">
            <h1>{currentLesson.title}</h1>
          </div>
        </header>

        <main className="lesson-content">
          {/* Tabs */}
          <div className="content-tabs">
            <button 
              className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
              onClick={() => setActiveTab('theory')}
            >
              📖 Teoría
            </button>
            <button 
              className={`tab ${activeTab === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenge')}
            >
              💻 Desafío
            </button>
          </div>

          {/* Teoría */}
          {activeTab === 'theory' && (
            <div className="theory-panel">
              <div className="markdown-content">
                <pre>{currentLesson.theory}</pre>
              </div>
              
              {currentLesson.challenge && (
                <button className="start-challenge-btn" onClick={goToChallenge}>
                  💻 Ir al Desafío →
                </button>
              )}
            </div>
          )}

          {/* Desafío */}
          {activeTab === 'challenge' && currentLesson.challenge && (
            <div className="challenge-panel">
              <div className="challenge-info">
                <h3>{currentLesson.challenge.title}</h3>
                <p>{currentLesson.challenge.description}</p>
                
                <div className="challenge-hints">
                  <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
                    💡 {showHint ? 'Ocultar' : 'Mostrar'} pistas
                  </button>
                  {showHint && (
                    <ul className="hints-list">
                      {currentLesson.challenge.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="code-section">
                <div className="code-header">
                  <span>JavaScript</span>
                  <button className="run-btn" onClick={handleRunCode}>
                    ▶ Ejecutar
                  </button>
                </div>
                
                <textarea
                  className="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Escribe tu código aquí..."
                  spellCheck={false}
                />

                {/* Resultados de tests */}
                {testResults.length > 0 && (
                  <div className="tests-results">
                    <h4>Tests:</h4>
                    {testResults.map((test, i) => (
                      <div key={i} className={`test-item ${test.passed ? 'passed' : 'failed'}`}>
                        <span className="test-icon">{test.passed ? '✅' : '❌'}</span>
                        <span>{test.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Output */}
                {output.length > 0 && (
                  <div className="output-box">
                    <h4>Salida:</h4>
                    {output.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="error-box">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}

// Helper para contar lecciones totales
function getTotalLessons() {
  return Object.values(curriculum).reduce((acc, mod) => acc + mod.lessons.length, 0);
}
