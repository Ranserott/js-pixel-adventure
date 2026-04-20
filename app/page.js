'use client';

import { useState, useEffect, useCallback } from 'react';
import { curriculum } from '../data/curriculum';
import { additionalModules } from '../data/achievements';
import { runCode, analyzeCodeStructure, getLevelHint, getMotivationalMessage } from '../utils/evaluator';
import CodeEditor from '../components/CodeEditor';
import AchievementsPanel from '../components/AchievementsPanel';
import FeedbackAnimation from '../components/FeedbackAnimation';

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
  const [stats, setStats] = useState({
    completedLessons: 0,
    completedModules: 0,
    totalLessons: 0,
    streak: 0,
    firstAttemptWins: 0,
    hintsUsed: 0,
    noHelpCompletions: 0
  });

  // Combinar módulos base + adicionales
  const allModules = { ...curriculum, ...additionalModules };

  // Cargar progreso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('js-learn-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLessons(data.completedLessons || []);
          
          // Cargar streak
          const streakData = localStorage.getItem('js-learn-streak');
          if (streakData) {
            const { lastDate } = JSON.parse(streakData);
            const last = new Date(lastDate);
            const now = new Date();
            const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
            if (diff <= 1) {
              setStats(prev => ({ ...prev, streak: diff === 1 ? prev.streak + 1 : 1 }));
            }
          }
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
      
      // Actualizar streak
      localStorage.setItem('js-learn-streak', JSON.stringify({ lastDate: new Date().toISOString() }));
    }
  }, []);

  // Guardar progreso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('js-learn-progress', JSON.stringify({
        completedLessons
      }));
      
      // Actualizar stats
      const totalLessons = Object.values(allModules).reduce((acc, mod) => acc + mod.lessons.length, 0);
      const completedModules = Object.values(allModules).filter(mod => 
        mod.lessons.every(l => completedLessons.includes(l.id))
      ).length;
      
      setStats(prev => ({
        ...prev,
        completedLessons: completedLessons.length,
        completedModules,
        totalLessons
      }));
    }
  }, [completedLessons, allModules]);

  // Ejecutar código
  const handleRunCode = useCallback(() => {
    if (!currentLesson?.challenge) return;
    
    setError(null);
    setOutput([]);
    setTestResults([]);
    setAttemptCount(prev => prev + 1);
    
    // Verificar si usó pistas
    if (showHint) {
      setStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
    }
    
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
    
    if (result.testResults) {
      setTestResults(result.testResults);
    }
    
    // Si pasa, marcar como completado
    if (result.success) {
      setOutput(prev => [...prev, '🎉 ¡Felicidades! ¡Todos los tests pasaron!']);
      
      // Verificar si fue sin ayuda
      if (!showHint && !showSolution && attemptCount === 0) {
        setStats(prev => ({ ...prev, noHelpCompletions: prev.noHelpCompletions + 1 }));
      }
      
      // Primer intento
      if (attemptCount === 0) {
        setStats(prev => ({ ...prev, firstAttemptWins: prev.firstAttemptWins + 1 }));
      }
      
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }
    } else if (attemptCount >= 2) {
      setMotivationalMsg(getMotivationalMessage());
    }
    
  }, [code, currentLesson, completedLessons, showHint, showSolution, attemptCount]);

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
  };

  const handleNextLesson = () => {
    const currentModuleData = allModules[currentModule];
    if (!currentModuleData) return;
    
    const lessons = currentModuleData.lessons;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    
    // Buscar siguiente lección en el mismo módulo
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      goToLesson(nextLesson);
    } else {
      // Buscar en el siguiente módulo
      const moduleKeys = Object.keys(allModules);
      const currentModuleIndex = moduleKeys.indexOf(currentModule);
      
      if (currentModuleIndex < moduleKeys.length - 1) {
        const nextModuleKey = moduleKeys[currentModuleIndex + 1];
        setCurrentModule(nextModuleKey);
        const nextModule = allModules[nextModuleKey];
        if (nextModule && nextModule.lessons.length > 0) {
          goToLesson(nextModule.lessons[0]);
        }
      } else {
        // Ya completó todos los módulos
        goHome();
      }
    }
  };

  const resetProgress = () => {
    if (confirm('¿Seguro que quieres reiniciar todo tu progreso?')) {
      setCompletedLessons([]);
      localStorage.removeItem('js-learn-progress');
      localStorage.removeItem('lastShownAchievements');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // PANTALLA PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  if (view === 'home') {
    const totalLessons = Object.values(allModules).reduce((acc, mod) => acc + mod.lessons.length, 0);
    const progress = Math.round((completedLessons.length / totalLessons) * 100);
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>Aprende JavaScript</h1>
          </div>
          <AchievementsPanel stats={stats} completedLessons={completedLessons} />
          <button className="reset-progress-btn" onClick={resetProgress} title="Reiniciar progreso">
            🔄
          </button>
        </header>

        <main className="modules-grid">
          {Object.entries(allModules).map(([key, module]) => {
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
                      className={`progress-fill ${moduleProgress === 100 ? 'complete' : ''}`}
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                  <span className="progress-text">{completedInModule}/{moduleLessons}</span>
                </div>
                {moduleProgress === 100 && <span className="module-complete-badge">✅</span>}
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
          <div className="summary-stat">
            <span className="stat-value">🔥 {stats.streak}</span>
            <span className="stat-label">Días racha</span>
          </div>
        </div>

        <footer className="learn-footer">
          <p>🎓 Aprende JavaScript paso a paso - {totalLessons} lecciones disponibles</p>
        </footer>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE MÓDULO
  // ═══════════════════════════════════════════════════════════
  if (view === 'module' && currentModule) {
    const module = allModules[currentModule];
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
                  <span className="lesson-type">
                    {lesson.type === 'project' ? '🚀 Proyecto' : '📖 Lección'} + 💻 Desafío
                  </span>
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
              style={{ color: activeTab === 'theory' ? '#818cf8' : undefined }}
            >
              📖 Teoría
            </button>
            <button 
              className={`tab ${activeTab === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenge')}
              style={{ color: activeTab === 'challenge' ? '#22c55e' : undefined }}
            >
              💻 Desafío
            </button>
          </div>

          {activeTab === 'theory' && (
            <div className="theory-panel">
              <div className="theory-content">
                <pre>{currentLesson.theory}</pre>
              </div>
            </div>
          )}

          {activeTab === 'challenge' && currentLesson.challenge && (
            <div className="challenge-panel">
              <FeedbackAnimation testResults={testResults} />
              
              <div className="challenge-info">
                <h3>🎯 {currentLesson.challenge.title}</h3>
                <p>{currentLesson.challenge.description}</p>
                
                <div className="challenge-hints-section">
                  <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>
                    💡 {showHint ? 'Ocultar' : 'Mostrar'} pistas
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
                <CodeEditor
                  initialCode={code}
                  onRun={handleRunCode}
                  onChange={setCode}
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

                {/* Motivational */}
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

              {/* Success - Next Challenge Button */}
              {testResults.length > 0 && testResults.every(t => t.passed) && (
                <div className="success-actions">
                  <div className="success-message-box">
                    <span className="success-icon-big">🎉</span>
                    <h3>¡Desafío completado!</h3>
                    <p>Excelente trabajo. ¿Listo para el siguiente?</p>
                  </div>
                  <button 
                    className="next-challenge-btn"
                    onClick={handleNextLesson}
                  >
                    🚀 Siguiente Desafío
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}
