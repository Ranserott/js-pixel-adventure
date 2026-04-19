'use client';

import { useState, useEffect, useCallback } from 'react';
import { curriculum } from '../data/curriculum';
import { runCode, analyzeCodeStructure, getLevelHint, getMotivationalMessage } from '../utils/evaluator';

export default function Home() {
  const [view, setView] = useState('home');
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('theory');
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [motivationalMsg, setMotivationalMsg] = useState('');
  const [codeStats, setCodeStats] = useState({ chars: 0, lines: 0 });

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

  // Actualizar estadísticas del código
  useEffect(() => {
    setCodeStats({
      chars: code.length,
      lines: code.split('\n').length
    });
  }, [code]);

  // Ejecutar código
  const handleRunCode = useCallback(() => {
    if (!currentLesson?.challenge) return;
    
    setError(null);
    setOutput([]);
    setTestResults([]);
    setAttemptCount(prev => prev + 1);
    
    const onProgress = (data) => {
      if (data.type === 'console') {
        setOutput(prev => [...prev, `📝 ${data.text}`]);
      }
    };
    
    const result = runCode(code, currentLesson, onProgress);
    
    if (result.logs && result.logs.length > 0) {
      setOutput(prev => [...prev, ...result.logs]);
    }
    
    if (result.error) {
      setError(result.error);
    }
    
    if (result.warnings && result.warnings.length > 0) {
      result.warnings.forEach(w => setOutput(prev => [...prev, w]));
    }
    
    if (result.suggestions && result.suggestions.length > 0) {
      result.suggestions.forEach(s => setOutput(prev => [...prev, s]));
    }
    
    if (result.testResults) {
      setTestResults(result.testResults);
    }
    
    // Si pasa, marcar como completado
    if (result.success) {
      setOutput(prev => [...prev, '🎉 ¡Felicidades! ¡Todos los tests pasaron!']);
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }
    } else if (attemptCount >= 2) {
      // Mostrar mensaje motivacional después de intentos
      setMotivationalMsg(getMotivationalMessage());
    }
    
  }, [code, currentLesson, completedLessons, attemptCount]);

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
    setShowSolution(false);
    setActiveTab('theory');
    setAttemptCount(0);
    setMotivationalMsg('');
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

  const resetProgress = () => {
    if (confirm('¿Seguro que quieres reiniciar todo tu progreso?')) {
      setCompletedLessons([]);
      localStorage.removeItem('js-learn-progress');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // PANTALLA PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  if (view === 'home') {
    const totalLessons = getTotalLessons();
    const progress = Math.round((completedLessons.length / totalLessons) * 100);
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>Aprende JavaScript</h1>
          </div>
          <button className="reset-progress-btn" onClick={resetProgress} title="Reiniciar progreso">
            🔄
          </button>
        </header>

        <main className="modules-grid">
          {Object.entries(curriculum).map(([key, module]) => {
            const moduleLessons = module.lessons.length;
            const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;
            const moduleProgress = Math.round((completedInModule / moduleLessons) * 100);
            
            return (
              <div key={key} className="module-card" onClick={() => goToModule(key)}>
                <div className="module-icon">{module.icon}</div>
                <h2>{module.title}</h2>
                <p>{module.description}</p>
                <div className="module-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">{completedInModule}/{moduleLessons}</span>
                </div>
              </div>
            );
          })}
        </main>

        <div className="progress-summary">
          <div className="summary-stat">
            <span className="stat-value">{completedLessons.length}</span>
            <span className="stat-label">Lecciones completadas</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{totalLessons - completedLessons.length}</span>
            <span className="stat-label">Lecciones restantes</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{progress}%</span>
            <span className="stat-label">Progreso total</span>
          </div>
        </div>

        <footer className="learn-footer">
          <p>🎓 Aprende JavaScript paso a paso</p>
        </footer>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE MÓDULO
  // ═══════════════════════════════════════════════════════════
  if (view === 'module' && currentModule) {
    const module = curriculum[currentModule];
    const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="back-btn" onClick={goHome}>←</button>
          <div className="header-title">
            <span className="module-icon">{module.icon}</span>
            <h1>{module.title}</h1>
          </div>
          <span className="module-badge">{completedInModule}/{module.lessons.length}</span>
        </header>

        <div className="module-description">
          <p>{module.description}</p>
        </div>

        <main className="lessons-list">
          {module.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || completedLessons.includes(module.lessons[index - 1].id);
            const statusIcon = isCompleted ? '✅' : isUnlocked ? (index + 1) : '🔒';
            
            return (
              <div 
                key={lesson.id} 
                className={`lesson-item ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && goToLesson(lesson)}
              >
                <div className="lesson-number">{statusIcon}</div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <span className="lesson-type">📖 Lección + 💻 Desafío</span>
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
  // PANTALLA DE LECCIÓN
  // ═══════════════════════════════════════════════════════════
  if (view === 'lesson' && currentLesson) {
    return (
      <div className="learn-container">
        <header className="learn-header">
          <button className="back-btn" onClick={() => goToModule(currentModule)}>←</button>
          <div className="header-title">
            <h1>{currentLesson.title}</h1>
          </div>
        </header>

        <main className="lesson-content">
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

          {activeTab === 'theory' && (
            <div className="theory-panel">
              <div className="theory-content">
                <pre>{currentLesson.theory}</pre>
              </div>
              
              {currentLesson.challenge && (
                <button className="start-challenge-btn" onClick={goToChallenge}>
                  💻 Ir al Desafío →
                </button>
              )}
            </div>
          )}

          {activeTab === 'challenge' && currentLesson.challenge && (
            <div className="challenge-panel">
              <div className="challenge-info">
                <h3>🎯 {currentLesson.challenge.title}</h3>
                <p>{currentLesson.challenge.description}</p>
                
                <div className="challenge-hints-section">
                  <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
                    💡 {showHint ? 'Ocultar' : 'Mostrar'} pistas ({currentLesson.challenge.hints?.length || 0})
                  </button>
                  {showHint && (
                    <ul className="hints-list">
                      {currentLesson.challenge.hints?.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="code-section">
                <div className="code-header">
                  <div className="code-title">
                    <span>JavaScript</span>
                    <span className="code-stats">{codeStats.lines} líneas, {codeStats.chars} chars</span>
                  </div>
                  <div className="code-actions">
                    <button className="clear-btn" onClick={() => { setCode(''); setError(null); setOutput([]); setTestResults([]); }}>
                      🗑️ Limpiar
                    </button>
                    <button className="run-btn" onClick={handleRunCode}>
                      ▶ Ejecutar
                    </button>
                  </div>
                </div>
                
                <textarea
                  className="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Escribe tu código JavaScript aquí..."
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />

                {/* Tests Results */}
                {testResults.length > 0 && (
                  <div className="tests-section">
                    <h4>🧪 Tests:</h4>
                    {testResults.map((test, i) => (
                      <div key={i} className={`test-item ${test.passed ? 'passed' : 'failed'}`}>
                        <span className="test-icon">{test.passed ? '✅' : '❌'}</span>
                        <span className="test-desc">{test.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Output */}
                {output.length > 0 && (
                  <div className="output-section">
                    <h4>📋 Consola:</h4>
                    {output.map((line, i) => (
                      <p key={i} className="output-line">{line}</p>
                    ))}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="error-section">
                    {error}
                  </div>
                )}

                {/* Motivational message */}
                {motivationalMsg && !error && testResults.length > 0 && !testResults.every(t => t.passed) && (
                  <div className="motivational-section">
                    {motivationalMsg}
                  </div>
                )}
              </div>

              <div className="help-section">
                <button 
                  className="solution-btn" 
                  onClick={() => setShowSolution(!showSolution)}
                >
                  👁️ {showSolution ? 'Ocultar' : 'Ver'} Solución
                </button>
                {showSolution && currentLesson.challenge.solution && (
                  <div className="solution-code">
                    <pre>{currentLesson.challenge.solution}</pre>
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

function getTotalLessons() {
  return Object.values(curriculum).reduce((acc, mod) => acc + mod.lessons.length, 0);
}
