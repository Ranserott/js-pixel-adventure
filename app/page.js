'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { levels, getLevelById, getNextLevel, getPrevLevel } from '../data/levels';
import GameCanvas from '../components/GameCanvas';
import CodeEditor from '../components/CodeEditor';
import { runCode, analyzeCodeStructure, getFriendlyError, getLevelHint } from '../utils/evaluator';

export default function Home() {
  // Estado del juego
  const [gameState, setGameState] = useState('menu');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [collectedStars, setCollectedStars] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [completedLevels, setCompletedLevels] = useState([]);
  const [executionOutput, setExecutionOutput] = useState([]);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);
  
  const outputRef = useRef(null);
  
  const currentLevel = getLevelById(currentLevelId);
  const nextLevel = getNextLevel(currentLevelId);
  const prevLevel = getPrevLevel(currentLevelId);
  
  // Cargar progreso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('js-pixel-adventure-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLevels(data.completedLevels || []);
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }
  }, []);

  // Guardar progreso
  useEffect(() => {
    if (typeof window !== 'undefined' && gameState !== 'menu') {
      localStorage.setItem('js-pixel-adventure-progress', JSON.stringify({
        completedLevels,
        currentLevelId
      }));
    }
  }, [completedLevels, currentLevelId, gameState]);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [executionOutput]);

  // Reproducir sonido
  const playSound = useCallback((type) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'success') {
        oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.4);
      } else if (type === 'error') {
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'move') {
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'star') {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      // Audio not available
    }
  }, [soundEnabled]);

  // Ejecutar código
  const handleRunCode = useCallback((code) => {
    if (!currentLevel || gameState !== 'playing') return;
    
    setError(null);
    setExecutionOutput([]);
    setLastCommand(code.length > 25 ? code.substring(0, 25) + '...' : code);
    
    // Callback para mostrar progreso
    const onProgress = (data) => {
      if (data.type === 'move') {
        setIsMoving(true);
        playSound('move');
        setTimeout(() => {
          setPlayerPos({ x: data.x, y: data.y });
          setIsMoving(false);
        }, 150);
      }
      if (data.type === 'collectStar') {
        setCollectedStars(prev => [...prev, `${data.x},${data.y}`]);
        playSound('star');
      }
      if (data.type === 'say' || data.type === 'console') {
        setExecutionOutput(prev => [...prev, data.text]);
      }
    };
    
    // Reiniciar posición al inicio del nivel
    setPlayerPos({ x: currentLevel.startPosition.x, y: currentLevel.startPosition.y });
    setCollectedStars([]);
    
    setTimeout(() => {
      const result = runCode(code, currentLevel, onProgress);
      
      // Actualizar posición final
      if (result.finalPosition) {
        setPlayerPos(result.finalPosition);
      }
      if (result.starsCollected) {
        setCollectedStars(result.starsCollected);
      }
      
      // Análisis de código
      const analysis = analyzeCodeStructure(code, currentLevel);
      
      if (!result.success && result.error) {
        playSound('error');
        setError(getFriendlyError(result.error));
        return;
      }
      
      const codeValid = analysis.issues.length === 0;
      const resultValid = result.validation.isValid;
      
      if (codeValid && resultValid) {
        playSound('success');
        
        if (!completedLevels.includes(currentLevelId)) {
          setCompletedLevels([...completedLevels, currentLevelId]);
        }
        
        setExecutionOutput(prev => [...prev, '🎉 ¡Nivel completado!']);
        setGameState('won');
      } else {
        playSound('error');
        
        const allErrors = [...result.validation.errors, ...analysis.issues];
        
        if (allErrors.length > 0) {
          setError(allErrors[0]);
          setExecutionOutput(prev => [...prev, '❌ ' + allErrors[0]]);
        }
      }
    }, 300);
  }, [currentLevel, gameState, currentLevelId, completedLevels, playSound]);

  // Siguiente nivel
  const handleNextLevel = useCallback(() => {
    if (nextLevel) {
      setCurrentLevelId(nextLevel.id);
      setPlayerPos({ x: nextLevel.startPosition.x, y: nextLevel.startPosition.y });
      setCollectedStars([]);
      setGameState('playing');
      setExecutionOutput([]);
      setError(null);
      setShowSolution(false);
    } else {
      setGameState('complete');
    }
  }, [nextLevel]);

  // Nivel anterior
  const handlePrevLevel = useCallback(() => {
    if (prevLevel) {
      setCurrentLevelId(prevLevel.id);
      setPlayerPos({ x: prevLevel.startPosition.x, y: prevLevel.startPosition.y });
      setCollectedStars([]);
      setGameState('playing');
      setExecutionOutput([]);
      setError(null);
      setShowSolution(false);
    }
  }, [prevLevel]);

  // Reiniciar nivel
  const handleRestartLevel = useCallback(() => {
    setPlayerPos({ x: currentLevel.startPosition.x, y: currentLevel.startPosition.y });
    setCollectedStars([]);
    setExecutionOutput([]);
    setError(null);
    setShowSolution(false);
    setGameState('playing');
  }, [currentLevel]);

  // Mostrar solución
  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setError(null);
    setExecutionOutput([`📝 Solución:`]);
  }, [currentLevel]);

  const canGoPrev = prevLevel && completedLevels.includes(prevLevel.id);

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE MENÚ
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'menu') {
    return (
      <div className="game-container menu-screen">
        <div className="menu-card">
          <h1 className="game-title">
            <span className="title-icon">🧙‍♂️</span>
            JS Pixel Adventure
          </h1>
          <p className="game-subtitle">Aprende JavaScript en un mundo 2D</p>
          
          <div className="menu-character">
            <div className="character-preview">
              <span className="big-char">🧙‍♂️</span>
              <div className="character-shadow" />
            </div>
          </div>
          
          <div className="menu-info">
            <h2>¿Qué aprenderás?</h2>
            <ul className="concept-list">
              <li>⬆️⬇️⬅️➡️ Mover en 4 direcciones</li>
              <li>📦 Variables (let, const)</li>
              <li>🔀 Condicionales (if)</li>
              <li>🔁 Bucles (for, while)</li>
              <li>✨ Funciones y parámetros</li>
              <li>⭐ Recolectar estrellas</li>
            </ul>
          </div>
          
          <button className="start-btn" onClick={() => setGameState('playing')}>
            🎮 Comenzar Aventura
          </button>
          
          {completedLevels.length > 0 && (
            <button className="continue-btn" onClick={() => {
              const lastCompleted = Math.max(...completedLevels);
              const nextToPlay = Math.min(lastCompleted + 1, levels.length);
              setCurrentLevelId(nextToPlay);
              setGameState('playing');
            }}>
              🔄 Continuar (Nivel {Math.min(Math.max(...completedLevels) + 1, levels.length)})
            </button>
          )}
          
          <p className="menu-footer">
            Progreso: {completedLevels.length}/{levels.length} niveles
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE VICTORIA
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'won') {
    return (
      <div className="game-container victory-screen">
        <div className="victory-card">
          <div className="victory-icon">🎉</div>
          <h1>¡Nivel Completado!</h1>
          <p className="victory-level">Nivel {currentLevel.id}: {currentLevel.name}</p>
          
          <div className="concept-learned">
            <span className="concept-label">📚 Concepto:</span>
            <span className="concept-value">{currentLevel.concept}</span>
          </div>
          
          <div className="victory-stats">
            <div className="stat">
              <span className="stat-value">{completedLevels.length}</span>
              <span className="stat-label">Niveles completados</span>
            </div>
          </div>
          
          <div className="victory-actions">
            {nextLevel ? (
              <button className="next-btn" onClick={handleNextLevel}>
                Siguiente: {nextLevel.name} →
              </button>
            ) : (
              <button className="complete-btn" onClick={() => setGameState('complete')}>
                🏆 Ver Resultados
              </button>
            )}
            
            <div className="secondary-actions">
              <button className="retry-btn" onClick={handleRestartLevel}>🔄 Repetir</button>
              {canGoPrev && <button className="prev-btn" onClick={handlePrevLevel}>← Anterior</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA COMPLETA
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'complete') {
    return (
      <div className="game-container complete-screen">
        <div className="complete-card">
          <div className="trophy">🏆</div>
          <h1>¡Felicidades!</h1>
          <p className="complete-message">
            Has completado todos los niveles.<br/>
            ¡Eres un programador!
          </p>
          
          <div className="complete-actions">
            <button className="restart-btn" onClick={() => {
              setCompletedLevels([]);
              setCurrentLevelId(1);
              setGameState('menu');
            }}>
              🔄 Jugar de Nuevo
            </button>
            <button className="menu-btn" onClick={() => setGameState('menu')}>
              🏠 Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE JUEGO
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="game-container playing">
      {/* Header */}
      <header className="game-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => setGameState('menu')}>🏠</button>
          <h1>🧙‍♂️ JS Pixel Adventure</h1>
        </div>
        
        <div className="header-center">
          <div className="level-indicator">
            <span className="current-level">{currentLevel.id}</span>
            <span className="level-separator">/</span>
            <span className="total-levels">{levels.length}</span>
          </div>
        </div>
        
        <div className="header-right">
          <button className={`sound-btn ${soundEnabled ? '' : 'muted'}`} onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="reset-btn" onClick={handleRestartLevel}>🔄</button>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className="progress-bar-header">
        <div className="progress-nodes">
          {levels.map(l => (
            <div 
              key={l.id}
              className={`progress-node ${completedLevels.includes(l.id) ? 'completed' : ''} ${l.id === currentLevelId ? 'current' : ''}`}
              onClick={() => {
                setCurrentLevelId(l.id);
                setPlayerPos({ x: l.startPosition.x, y: l.startPosition.y });
                setCollectedStars([]);
                setExecutionOutput([]);
                setError(null);
                setShowSolution(false);
                setGameState('playing');
              }}
            >
              {completedLevels.includes(l.id) ? '✓' : l.id}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <main className="game-main">
        {/* Panel izquierdo */}
        <div className="left-panel">
          <div className="level-info-card">
            <h2 className="level-title">{currentLevel.name}</h2>
            <p className="level-story">{currentLevel.story}</p>
            <div className="level-objective">
              <strong>🎯 Objetivo:</strong> {currentLevel.objective}
            </div>
            <div className="level-concept">
              <span className="concept-badge">{currentLevel.concept}</span>
            </div>
          </div>

          <GameCanvas 
            level={currentLevel}
            playerPos={playerPos}
            collectedStars={collectedStars}
            isMoving={isMoving}
            lastCommand={lastCommand}
          />
        </div>

        {/* Panel derecho */}
        <div className="right-panel">
          <CodeEditor
            onRunCode={handleRunCode}
            isRunning={isMoving}
            levelHint={currentLevel.hint}
          />

          <div className="output-section">
            <div className="output-header">
              <h3>📋 Resultado</h3>
              <button className="hint-btn" onClick={() => setShowHint(!showHint)}>💡</button>
            </div>
            
            {showHint && (
              <div className="hint-box">
                💡 {getLevelHint(currentLevel)}
              </div>
            )}
            
            {showSolution && (
              <div className="solution-box">
                <h4>📝 Solución:</h4>
                <pre>{currentLevel.solution}</pre>
              </div>
            )}
            
            {error && (
              <div className="error-box">
                {error}
              </div>
            )}
            
            <div className="output-box" ref={outputRef}>
              {executionOutput.length === 0 && !error ? (
                <p className="output-placeholder">
                  Ejecuta tu código para ver el resultado...
                </p>
              ) : (
                executionOutput.map((line, i) => (
                  <p key={i} className="output-line">{line}</p>
                ))
              )}
            </div>
          </div>

          <div className="help-section">
            <button className="help-btn solution" onClick={handleShowSolution} disabled={showSolution}>
              👁️ Solución
            </button>
            <button className="help-btn" onClick={handleRestartLevel}>
              🔄 Reiniciar
            </button>
          </div>

          <div className="level-nav">
            {canGoPrev && (
              <button className="nav-btn prev" onClick={handlePrevLevel}>
                ← {prevLevel.name}
              </button>
            )}
            {nextLevel && (
              <button className="nav-btn next" onClick={handleNextLevel}>
                {nextLevel.name} →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
