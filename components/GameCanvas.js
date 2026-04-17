'use client';

import { useEffect, useState, useRef } from 'react';
import { themes } from '../data/levels';

/**
 * GameCanvas - Renderizado futurista del juego
 */
export default function GameCanvas({ level, currentPosition, isMoving, lastCommand }) {
  const [characterFrame, setCharacterFrame] = useState(0);
  const [showEffect, setShowEffect] = useState(null);
  const canvasRef = useRef(null);

  const theme = level ? themes[level.theme] || themes.dungeon : themes.dungeon;

  // Animación del personaje
  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => {
        setCharacterFrame(frame => (frame + 1) % 4);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setCharacterFrame(0);
    }
  }, [isMoving, currentPosition]);

  // Efecto al moverse
  useEffect(() => {
    if (currentPosition > 0) {
      setShowEffect('trail');
      setTimeout(() => setShowEffect(null), 600);
    }
  }, [currentPosition]);

  // Efecto de victoria
  useEffect(() => {
    if (isMoving === false && currentPosition === level?.goalPosition && currentPosition > 0) {
      setShowEffect('sparkle');
      setTimeout(() => setShowEffect(null), 1200);
    }
  }, [isMoving, currentPosition, level]);

  // Renderizado futurista
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;

    const ctx = canvas.getContext('2d');
    const cellSize = 56;
    const gridSize = level.gridSize;
    
    canvas.width = gridSize * cellSize;
    canvas.height = cellSize * 2;

    // Limpiar con gradiente de fondo
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#030811');
    bgGradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines futuristas
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
    }

    // Fila superior decorativa
    for (let i = 0; i < gridSize; i++) {
      const x = i * cellSize;
      
      // Fondo de celda
      ctx.fillStyle = 'rgba(0, 245, 255, 0.02)';
      ctx.fillRect(x + 1, 1, cellSize - 2, cellSize - 2);
      
      // Decoración en ciertas posiciones
      if (i % 2 === 0 && i !== level.startPosition && i !== level.goalPosition) {
        ctx.font = '20px serif';
        ctx.globalAlpha = 0.3;
        ctx.fillText(theme.decoration, x + 16, 32);
        ctx.globalAlpha = 1;
      }
    }

    // Camino principal (fila inferior)
    const pathY = cellSize;
    for (let i = 0; i < gridSize; i++) {
      const x = i * cellSize;
      
      // Camino con gradiente
      const pathGradient = ctx.createLinearGradient(x, pathY, x, pathY + cellSize);
      pathGradient.addColorStop(0, '#1a4d7c');
      pathGradient.addColorStop(1, '#0f2847');
      ctx.fillStyle = pathGradient;
      ctx.fillRect(x + 2, pathY + 2, cellSize - 4, cellSize - 4);
      
      // Borde del camino
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, pathY + 2, cellSize - 4, cellSize - 4);
    }

    // Marcas de posición en el camino
    for (let i = 0; i <= Math.max(level.goalPosition, currentPosition); i++) {
      const x = i * cellSize;
      ctx.font = '12px Orbitron, sans-serif';
      ctx.fillStyle = 'rgba(0, 245, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x + cellSize / 2, pathY + cellSize - 8);
    }

    // Punto de inicio
    const startX = level.startPosition * cellSize;
    ctx.font = '24px serif';
    ctx.fillText('▶', startX + cellSize / 2, pathY + cellSize / 2 + 8);
    
    // Meta
    const goalX = level.goalPosition * cellSize;
    ctx.font = '28px serif';
    ctx.fillText('🔷', goalX + cellSize / 2, pathY + cellSize / 2 + 8);

    // Dibujar personaje animado
    const charX = currentPosition * cellSize;
    const charY = pathY;
    const bobOffset = isMoving ? Math.sin(characterFrame * Math.PI / 2) * 3 : 0;
    
    // Glow del personaje
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 15;
    
    // Cuerpo futurista (diamante/rombo)
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.moveTo(charX + cellSize / 2, charY + 8 + bobOffset);
    ctx.lineTo(charX + cellSize / 2 + 14, charY + cellSize / 2 + bobOffset);
    ctx.lineTo(charX + cellSize / 2, charY + cellSize - 12 + bobOffset);
    ctx.lineTo(charX + cellSize / 2 - 14, charY + cellSize / 2 + bobOffset);
    ctx.closePath();
    ctx.fill();
    
    // Centro del personaje
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(charX + cellSize / 2, charY + cellSize / 2 + bobOffset, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Ojos (dos puntos)
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(charX + cellSize / 2 - 5, charY + cellSize / 2 - 3 + bobOffset, 3, 3);
    ctx.fillRect(charX + cellSize / 2 + 2, charY + cellSize / 2 - 3 + bobOffset, 3, 3);
    
    ctx.shadowBlur = 0;

    // Efecto trail
    if (showEffect === 'trail') {
      for (let i = 0; i < 5; i++) {
        const trailX = charX - (i * 8);
        ctx.fillStyle = `rgba(0, 245, 255, ${0.3 - i * 0.06})`;
        ctx.beginPath();
        ctx.arc(trailX + cellSize / 2, charY + cellSize / 2, 4 - i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Efecto de victoria
    if (showEffect === 'sparkle') {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 35 + Math.sin(Date.now() / 100) * 5;
        const x = charX + cellSize / 2 + Math.cos(angle) * radius;
        const y = charY + cellSize / 2 + Math.sin(angle) * radius;
        
        ctx.fillStyle = '#00f5ff';
        ctx.font = '16px serif';
        ctx.fillText('✦', x - 8, y + 6);
      }
    }

    // Línea de progreso
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(level.startPosition * cellSize + cellSize / 2, pathY + cellSize + 15);
    ctx.lineTo(charX + cellSize / 2, pathY + cellSize + 15);
    ctx.stroke();

  }, [level, currentPosition, characterFrame, showEffect, theme]);

  if (!level) {
    return (
      <div className="game-canvas loading">
        <p>🎮 Cargando...</p>
      </div>
    );
  }

  return (
    <div className="game-canvas">
      {/* Header */}
      <div className="canvas-header">
        <div className="level-number">{level.id}</div>
        <h3 className="level-title">{level.name}</h3>
        <span className="theme-badge" style={{ background: theme.accent }}>
          {theme.name}
        </span>
      </div>

      {/* Lienzo */}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="game-canvas-element" />
        
        {/* Posición */}
        <div className="position-display">
          <span className="position-label">📍</span>
          <span className="position-value">{currentPosition}</span>
          <span className="position-separator">/</span>
          <span className="position-goal">{level.goalPosition}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min((currentPosition / level.goalPosition) * 100, 100)}%`
            }}
          />
        </div>
        <p className="progress-hint">
          {currentPosition < level.goalPosition 
            ? `Avanza ${level.goalPosition - currentPosition} pasos`
            : currentPosition === level.goalPosition 
              ? '¡Meta alcanzada!'
              : '¡Completado!'}
        </p>
      </div>

      {/* Último comando */}
      {lastCommand && (
        <div className="last-command">
          <span className="command-label">Último:</span>
          <code>{lastCommand}</code>
        </div>
      )}
    </div>
  );
}
