'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { levels, getLevelById, getNextLevel, getPrevLevel } from '../data/levels';
import GameCanvas from '../components/GameCanvas';
import CodeEditor from '../components/CodeEditor';
import { runCode, analyzeCode, getFriendlyError } from '../utils/evaluator';

/**
 * JS Pixel Adventure - Juego educativo de JavaScript
 */
export default function Home() {
  // Estado del juego
  const [gameState, setGameState] = useState('menu'); // menu, playing, won, complete
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [completedLevels, setCompletedLevels] = useState([]);
  const [executionOutput, setExecutionOutput] = useState([]);
  const [error, setError] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);
  
  // Refs
  const outputRef = useRef(null);
  
  // Nivel actual
  const currentLevel = getLevelById(currentLevelId);
  const nextLevel = getNextLevel(currentLevelId);
  const prevLevel = getPrevLevel(currentLevelId);
  
  // Cargar progreso guardado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('js-pixel-adventure-progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLevels(data.completedLevels || []);
          if (data.currentLevelId && !data.completedLevels?.includes(data.currentLevelId)) {
            setCurrentLevelId(data.currentLevelId);
          }
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
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
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
    setLastCommand(code.length > 20 ? code.substring(0, 20) + '...' : code);
    
    // Callback para mostrar progreso en tiempo real
    const onProgress = (data) => {
      if (data.type === 'move') {
        setIsMoving(true);
        setTimeout(() => {
          setCurrentPosition(data.position);
          setIsMoving(false);
          playSound('move');
        }, 100);
      }
      if (data.type === 'say' || data.type === 'console') {
        setExecutionOutput(prev => [...prev, data.text]);
      }
    };
    
    // Ejecutar con delay para mostrar "procesando"
    setTimeout(() => {
      const result = runCode(code, currentLevel, onProgress);
      
      if (result.success && result.validation.isValid) {
        // ¡Nivel completado!
        playSound('success');
        
        if (!completedLevels.includes(currentLevelId)) {
          setCompletedLevels([...completedLevels, currentLevelId]);
        }
        
        setExecutionOutput(prev => [...prev, '🎉 ¡Código correcto! Nivel completado.']);
        setGameState('won');
      } else {
        // Error en el código
        playSound('error');
        
        if (result.error) {
          setError(getFriendlyError(result.error));
        } else if (result.validation.errors.length > 0) {
          setError(result.validation.errors[0]);
        }
        
        // Mostrar output parcial
        if (result.consoleOutput && result.consoleOutput.length > 0) {
          setExecutionOutput(prev => [...prev, ...result.consoleOutput]);
        }
      }
    }, 300);
  }, [currentLevel, gameState, currentLevelId, completedLevels, playSound]);

  // Ir al siguiente nivel
  const handleNextLevel = useCallback(() => {
    if (nextLevel) {
      setCurrentLevelId(nextLevel.id);
      setCurrentPosition(nextLevel.startPosition);
      setGameState('playing');
      setExecutionOutput([]);
      setError(null);
      setShowSolution(false);
    } else {
      setGameState('complete');
    }
  }, [nextLevel]);

  // Ir al nivel anterior
  const handlePrevLevel = useCallback(() => {
    if (prevLevel) {
      setCurrentLevelId(prevLevel.id);
      setCurrentPosition(prevLevel.startPosition);
      setGameState('playing');
      setExecutionOutput([]);
      setError(null);
      setShowSolution(false);
    }
  }, [prevLevel]);

  // Reiniciar nivel actual
  const handleRestartLevel = useCallback(() => {
    setCurrentPosition(currentLevel.startPosition);
    setExecutionOutput([]);
    setError(null);
    setShowSolution(false);
    setGameState('playing');
  }, [currentLevel]);

  // Mostrar solución
  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setError(null);
    setExecutionOutput([`📝 Solución del nivel ${currentLevel.id}:`]);
  }, [currentLevel]);

  // Verificar nivel anterior
  const canGoPrev = prevLevel && completedLevels.includes(prevLevel.id);
  
  // Análisis de código para pistas
  const handleHintRequest = useCallback(() => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 5000);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE MENÚ
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'menu') {
    return (
      <div className="game-container menu-screen">
        <div className="menu-card">
          <h1 className="game-title">
            <span className="title-icon">⚔️</span>
            JS Pixel Adventure
          </h1>
          <p className="game-subtitle">Aprende JavaScript jugando</p>
          
          <div className="menu-character">
            <div className="character-preview">
              <span className="big-char">🧙‍♂️</span>
              <div className="character-shadow" />
            </div>
          </div>
          
          <div className="menu-info">
            <h2>¿Qué aprenderás?</h2>
            <ul className="concept-list">
              <li>⚔️ Función move()</li>
              <li>📦 Variables (let, const)</li>
              <li>🔀 Condicionales (if)</li>
              <li>🔁 Bucles (for, while)</li>
              <li>✨ Funciones</li>
            </ul>
          </div>
          
          <button className="start-btn" onClick={() => setGameState('playing')}>
            🎮 Comenzar Aventura
          </button>
          
          {completedLevels.length > 0 && (
            <button className="continue-btn" onClick={() => {
              // Encontrar último nivel completado o siguiente
              const lastCompleted = Math.max(...completedLevels);
              const nextToPlay = Math.min(lastCompleted + 1, levels.length);
              setCurrentLevelId(nextToPlay);
              setGameState('playing');
            }}>
              🔄 Continuar (Nivel {Math.min(Math.max(...completedLevels) + 1, levels.length)})
            </button>
          )}
          
          <p className="menu-footer">
            Progreso guardado: {completedLevels.length}/{levels.length} niveles
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE NIVEL COMPLETADO
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'won') {
    return (
      <div className="game-container victory-screen">
        <div className="victory-card">
          <div className="victory-icon">🎉</div>
          <h1>¡Nivel Completado!</h1>
          <p className="victory-level">Nivel {currentLevel.id}: {currentLevel.name}</p>
          
          <div className="concept-learned">
            <span className="concept-label">📚 Concepto aprendido:</span>
            <span className="concept-value">{currentLevel.concept}</span>
          </div>
          
          <div className="victory-stats">
            <div className="stat">
              <span className="stat-value">{completedLevels.length}</span>
              <span className="stat-label">Niveles completados</span>
            </div>
            <div className="stat">
              <span className="stat-value">{levels.length - completedLevels.length}</span>
              <span className="stat-label">Por completar</span>
            </div>
          </div>
          
          <div className="victory-actions">
            {nextLevel ? (
              <button className="next-btn" onClick={handleNextLevel}>
                Siguiente Nivel: {nextLevel.name} →
              </button>
            ) : (
              <button className="complete-btn" onClick={() => setGameState('complete')}>
                🏆 Ver Resultados Finales
              </button>
            )}
            
            <div className="secondary-actions">
              <button className="retry-btn" onClick={handleRestartLevel}>
                🔄 Repetir Nivel
              </button>
              {canGoPrev && (
                <button className="prev-btn" onClick={handlePrevLevel}>
                  ← Nivel Anterior
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA DE JUEGO COMPLETADO
  // ═══════════════════════════════════════════════════════════
  if (gameState === 'complete') {
    return (
      <div className="game-container complete-screen">
        <div className="complete-card">
          <div className="trophy">🏆</div>
          <h1>¡Felicidades!</h1>
          <p className="complete-message">
            Has completado todos los niveles del juego.
            <br />
            ¡Eres un verdadero programador!
          </p>
          
          <div className="final-stats">
            <h2>Estadísticas Finales</h2>
            <ul>
              <li>✅ {completedLevels.length} de {levels.length} niveles completados</li>
              <li>📚 Conceptos dominados:</li>
              <ul className="concepts-list">
                {levels.map(l => (
                  <li key={l.id} className={completedLevels.includes(l.id) ? 'done' : ''}>
                    {completedLevels.includes(l.id) ? '✓' : '○'} {l.concept}
                  </li>
                ))}
              </ul>
            </ul>
          </div>
          
          <div className="complete-actions">
            <button className="restart-btn" onClick={() => {
              setCompletedLevels([]);
              setCurrentLevelId(1);
              setGameState('menu');
            }}>
              🔄 Jugar de Nuevo
            </button>
            <button className="menu-btn" onClick={() => setGameState('menu')}>
              🏠 Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PANTALLA PRINCIPAL DE JUEGO
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="game-container playing">
      {/* Header */}
      <header className="game-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => setGameState('menu')}>
            🏠
          </button>
          <h1>⚔️ JS Pixel Adventure</h1>
        </div>
        
        <div className="header-center">
          <div className="level-indicator">
            <span className="current-level">{currentLevel.id}</span>
            <span className="level-separator">/</span>
            <span className="total-levels">{levels.length}</span>
          </div>
        </div>
        
        <div className="header-right">
          <button 
            className={`sound-btn ${soundEnabled ? '' : 'muted'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button className="reset-btn" onClick={handleRestartLevel}>
            🔄
          </button>
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
                if (completedLevels.includes(l.id) || l.id === 1 || completedLevels.includes(l.id - 1)) {
                  setCurrentLevelId(l.id);
                  setCurrentPosition(l.startPosition);
                  setExecutionOutput([]);
                  setError(null);
                  setShowSolution(false);
                  setGameState('playing');
                }
              }}
            >
              {completedLevels.includes(l.id) ? '✓' : l.id}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="game-main">
        {/* Panel izquierdo */}
        <div className="left-panel">
          {/* Info del nivel */}
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

          {/* Lienzo del juego */}
          <GameCanvas 
            level={currentLevel}
            currentPosition={currentPosition}
            isMoving={isMoving}
            lastCommand={lastCommand}
          />
        </div>

        {/* Panel derecho */}
        <div className="right-panel">
          {/* Editor de código */}
          <CodeEditor
            onRunCode={handleRunCode}
            isRunning={isMoving}
            levelHint={currentLevel.hint}
            onShowHint={handleHintRequest}
          />

          {/* Output y errores */}
          <div className="output-section">
            <div className="output-header">
              <h3>📋 Resultado</h3>
              {currentLevel.hint && (
                <button className="hint-btn" onClick={handleHintRequest}>
                  💡 Pista
                </button>
              )}
            </div>
            
            {/* Mostrar pista */}
            {showHint && (
              <div className="hint-box">
                {currentLevel.hint}
              </div>
            )}
            
            {/* Mostrar solución */}
            {showSolution && (
              <div className="solution-box">
                <h4>📝 Solución:</h4>
                <pre>{currentLevel.solution}</pre>
              </div>
            )}
            
            {/* Error */}
            {error && (
              <div className="error-box">
                {error}
              </div>
            )}
            
            {/* Output del código */}
            <div className="output-box" ref={outputRef}>
              {executionOutput.length === 0 && !error && !showSolution ? (
                <p className="output-placeholder">
                  Ejecuta tu código para ver el resultado aquí...
                </p>
              ) : (
                executionOutput.map((line, i) => (
                  <p key={i} className="output-line">{line}</p>
                ))
              )}
            </div>
          </div>

          {/* Botones de ayuda */}
          <div className="help-section">
            <button 
              className="help-btn solution"
              onClick={handleShowSolution}
              disabled={showSolution}
            >
              👁️ Ver Solución
            </button>
            <button 
              className="help-btn"
              onClick={handleRestartLevel}
            >
              🔄 Reiniciar
            </button>
          </div>

          {/* Navegación entre niveles */}
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
