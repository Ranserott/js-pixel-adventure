'use client';

import { useState, useEffect, useCallback } from 'react';
import { curriculum } from '../../data/curriculum';
import { additionalModules } from '../../data/achievements';
import { runCode, analyzeCodeStructure, getLevelHint, getMotivationalMessage } from '../../utils/evaluator';
import CodeEditor from '../../components/CodeEditor';
import AchievementsPanel from '../../components/AchievementsPanel';
import FeedbackAnimation from '../../components/FeedbackAnimation';
import MarkdownRenderer from '../../components/MarkdownRenderer';

export default function JavaScriptCourse() {
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

  const allModules = { ...curriculum, ...additionalModules };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('js-learn-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLessons(data.completedLessons || []);
          
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
      
      localStorage.setItem('js-learn-streak', JSON.stringify({ lastDate: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('js-learn-progress', JSON.stringify({
        completedLessons
      }));
      
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
  }, [completedLessons]);

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

  const handleRunCode = useCallback(() => {
    if (!currentLesson?.challenge?.tests) return;
    
    setAttemptCount(prev => prev + 1);
    const result = runCode(code, currentLesson.challenge, (log) => {
      setOutput(prev => [...prev, { type: 'console', text: log.text }]);
    });
    
    if (result.error) {
      setError(result.error);
      setOutput(prev => [...prev, { type: 'error', text: result.error }]);
    } else {
      setError(null);
    }
    
    if (result.testResults) {
      setTestResults(result.testResults);
      const allPassed = result.testResults.every(t => t.passed);
      
      if (allPassed) {
        const isFirstAttempt = attemptCount === 0;
        
        if (isFirstAttempt && !showHint) {
          setStats(prev => ({ ...prev, firstAttemptWins: prev.firstAttemptWins + 1 }));
        }
        
        if (!showHint) {
          setStats(prev => ({ ...prev, noHelpCompletions: prev.noHelpCompletions + 1 }));
        }
        
        if (!completedLessons.includes(currentLesson.id)) {
          const newCompleted = [...completedLessons, currentLesson.id];
          setCompletedLessons(newCompleted);
          
          const earned = result.testResults.filter(t => t.passed).length;
          if (earned > 0) {
            const key = `achievement-${currentLesson.id}`;
            const shown = localStorage.getItem('lastShownAchievements') || '[]';
            if (!JSON.parse(shown).includes(key)) {
              localStorage.setItem('lastShownAchievements', JSON.stringify([...JSON.parse(shown), key]));
            }
          }
        }
      }
      
      setMotivationalMsg(getMotivationalMessage(result.testResults, attemptCount, currentLesson.challenge.hints?.length > 0));
    }
  }, [code, currentLesson, attemptCount, showHint, completedLessons]);

  const handleNextLesson = () => {
    const allLessons = Object.values(allModules).flatMap(m => m.lessons || []);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
    
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      
      const currentMod = Object.entries(allModules).find(([_, mod]) => 
        mod.lessons?.some(l => l.id === currentLesson?.id)
      );
      
      if (currentMod) {
        setCurrentModule(currentMod[0]);
      }
      
      goToLesson(nextLesson);
    } else {
      const currentMod = Object.entries(allModules).find(([_, mod]) => 
        mod.lessons?.some(l => l.id === currentLesson?.id)
      );
      
      if (currentMod) {
        const modIndex = Object.keys(allModules).indexOf(currentMod[0]);
        const nextModKey = Object.keys(allModules)[modIndex + 1];
        
        if (nextModKey && allModules[nextModKey]?.lessons?.length > 0) {
          setCurrentModule(nextModKey);
          goToLesson(allModules[nextModKey].lessons[0]);
        } else {
          setView('home');
        }
      }
    }
  };

  const resetProgress = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
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
            <span className="logo-icon">📘</span>
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
    
    return (
      <div className="learn-container">
        <header className="learn-header">
          <div className="logo">
            <span className="logo-icon">{module.icon}</span>
            <h1>{module.title}</h1>
          </div>
          <button className="back-btn" onClick={() => { setView('home'); setCurrentModule(null); }}>
            ← Volver
          </button>
        </header>

        <main className="lessons-grid">
          {module.lessons?.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || completedLessons.includes(module.lessons[index - 1].id);
            
            return (
              <div 
                key={lesson.id}
                className={`lesson-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && goToLesson(lesson)}
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  <span className="lesson-type">
                    {lesson.type === 'lesson' ? '📖 Lección' : '💻 Desafío'}
                  </span>
                </div>
                {isCompleted && <span className="check-icon">✅</span>}
                {!isUnlocked && <span className="lock-icon">🔒</span>}
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
    const module = allModules[currentModule];
    
    return (
      <div className="learn-container lesson-view">
        <header className="lesson-header">
          <button className="back-btn" onClick={() => { setView('module'); setCurrentLesson(null); }}>
            ← {module?.title || 'Volver'}
          </button>
          <div className="lesson-title-header">
            <span className="lesson-badge">{currentLesson.type === 'lesson' ? '📖' : '💻'}</span>
            <h1>{currentLesson.title}</h1>
          </div>
          <div className="header-spacer"></div>
        </header>

        <div className="lesson-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
              onClick={() => setActiveTab('theory')}
            >
              📚 Teoría
            </button>
            <button 
              className={`tab ${activeTab === 'challenge' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenge')}
            >
              💻 Desafío
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'theory' && (
              <div className="theory-panel">
                <div className="theory-content">
                  <MarkdownRenderer content={currentLesson.theory} />
                </div>
              </div>
            )}

            {activeTab === 'challenge' && (
              <div className="challenge-panel">
                <div className="challenge-info">
                  <h3>🎯 {currentLesson.challenge.title}</h3>
                  <p>{currentLesson.challenge.description}</p>
                  
                  <div className="hints-section">
                    <button 
                      className="hint-btn"
                      onClick={() => setShowHint(!showHint)}
                    >
                      💡 {showHint ? 'Ocultar pista' : 'Mostrar pista'}
                    </button>
                    
                    {showHint && currentLesson.challenge.hints && (
                      <div className="hints-list">
                        {currentLesson.challenge.hints.map((hint, i) => (
                          <div key={i} className="hint-item">• {hint}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="code-section">
                  <div className="code-header">
                    <span className="code-lang">JavaScript</span>
                    <button 
                      className="run-btn"
                      onClick={handleRunCode}
                    >
                      ▶️ Ejecutar
                    </button>
                  </div>
                  <CodeEditor 
                    value={code}
                    onChange={setCode}
                    onRun={handleRunCode}
                  />
                </div>

                {output.length > 0 && (
                  <div className="output-section">
                    <div className="output-header">
                      <span>📋 Consola</span>
                      <button onClick={() => setOutput([])} className="clear-btn">Limpiar</button>
                    </div>
                    <div className="output-content">
                      {output.map((item, i) => (
                        <div key={i} className={`output-line ${item.type}`}>{item.text}</div>
                      ))}
                    </div>
                  </div>
                )}

                <FeedbackAnimation testResults={testResults} />

                {testResults.length > 0 && (
                  <div className="tests-section">
                    <h4>📊 Resultados</h4>
                    {testResults.map((test, i) => (
                      <div key={i} className={`test-result ${test.passed ? 'passed' : 'failed'}`}>
                        <span className="test-icon">{test.passed ? '✅' : '❌'}</span>
                        <span className="test-desc">{test.description || `Test ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                )}

                {motivationalMsg && !error && testResults.length > 0 && !testResults.every(t => t.passed) && (
                  <div className="motivational-message">
                    {motivationalMsg}
                  </div>
                )}

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
                    {!showSolution && (
                      <button 
                        className="solution-btn"
                        onClick={() => setShowSolution(true)}
                      >
                        📝 Mostrar solución
                      </button>
                    )}
                    {showSolution && (
                      <div className="solution-code">
                        <pre>{currentLesson.challenge.solution}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
