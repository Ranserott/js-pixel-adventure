'use client';

import { useEffect, useState, useRef } from 'react';
import { themes } from '../data/levels';

/**
 * GameCanvas 2D - Renderizado del juego con grid 2D
 */
export default function GameCanvas({ level, playerPos, collectedStars, isMoving, lastCommand }) {
  const [frame, setFrame] = useState(0);
  const [effect, setEffect] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const theme = level ? themes[level.theme] || themes.forest : themes.forest;
  const pos = playerPos || { x: 0, y: 0 };

  // Animación
  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => setFrame(f => (f + 1) % 4), 150);
      return () => clearInterval(interval);
    } else {
      setFrame(0);
    }
  }, [isMoving]);

  // Efecto de recolectar estrella
  useEffect(() => {
    if (collectedStars && collectedStars.length > 0) {
      setEffect('starCollect');
      setTimeout(() => setEffect(null), 500);
    }
  }, [collectedStars]);

  // Efecto de victoria
  useEffect(() => {
    if (!isMoving && pos.x === level?.targetPosition?.x && pos.y === level?.targetPosition?.y) {
      setEffect('victory');
      setTimeout(() => setEffect(null), 2000);
    }
  }, [isMoving, pos.x, pos.y, level]);

  // Renderizado
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;

    const ctx = canvas.getContext('2d');
    const cellSize = 56;
    const width = level.gridSize.width * cellSize + 40;
    const height = level.gridSize.height * cellSize + 40;
    
    canvas.width = width;
    canvas.height = height;

    // Fondo
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.background);
    bgGrad.addColorStop(1, theme.ground);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid
    for (let y = 0; y < level.gridSize.height; y++) {
      for (let x = 0; x < level.gridSize.width; x++) {
        const cellX = 20 + x * cellSize;
        const cellY = 20 + y * cellSize;
        
        // Celda
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
        
        // Borde
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
      }
    }

    // Decoraciones según tema
    for (let y = 0; y < level.gridSize.height; y++) {
      for (let x = 0; x < level.gridSize.width; x++) {
        if ((x + y) % 3 === 0 && x !== level.startPosition.x || y !== level.startPosition.y) {
          if (Math.random() > 0.5) {
            const cellX = 20 + x * cellSize + cellSize / 2;
            const cellY = 20 + y * cellSize + cellSize / 2;
            ctx.globalAlpha = 0.15;
            ctx.font = '20px serif';
            ctx.fillText(theme.decoration, cellX - 10, cellY + 7);
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    // Inicio
    const startX = 20 + level.startPosition.x * cellSize + cellSize / 2;
    const startY = 20 + level.startPosition.y * cellSize + cellSize / 2;
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INICIO', startX, startY + 35);

    // Estrellas por recolectar
    if (level.stars) {
      for (const star of level.stars) {
        const isCollected = collectedStars && collectedStars.includes(`${star.x},${star.y}`);
        if (!isCollected) {
          const starX = 20 + star.x * cellSize + cellSize / 2;
          const starY = 20 + star.y * cellSize + cellSize / 2;
          
          // Estrella brillante
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 15;
          ctx.font = '28px serif';
          ctx.fillText('⭐', starX - 10, starY + 10);
          ctx.shadowBlur = 0;
        }
      }
    }

    // Meta
    const goalX = 20 + level.targetPosition.x * cellSize + cellSize / 2;
    const goalY = 20 + level.targetPosition.y * cellSize + cellSize / 2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;
    ctx.font = '32px serif';
    ctx.fillText('🏆', goalX - 12, goalY + 12);
    ctx.shadowBlur = 0;

    // Jugador (Mago)
    const playerX = 20 + pos.x * cellSize + cellSize / 2;
    const playerY = 20 + pos.y * cellSize + cellSize / 2;
    
    const bounce = isMoving ? Math.sin(frame * Math.PI / 2) * 4 : Math.sin(Date.now() / 400) * 2;
    
    // Glow
    ctx.shadowColor = effect === 'victory' ? '#fbbf24' : '#a855f7';
    ctx.shadowBlur = effect === 'victory' ? 30 : 15;
    
    // Cuerpo del mago
    ctx.fillStyle = '#5b21b6';
    ctx.beginPath();
    ctx.arc(playerX, playerY + bounce, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Sombrero
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(playerX - 15, playerY - 5 + bounce);
    ctx.lineTo(playerX, playerY - 35 + bounce);
    ctx.lineTo(playerX + 15, playerY - 5 + bounce);
    ctx.closePath();
    ctx.fill();
    
    // Cara
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(playerX, playerY - 8 + bounce, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(playerX - 4, playerY - 10 + bounce, 2, 0, Math.PI * 2);
    ctx.arc(playerX + 4, playerY - 10 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Varita
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(playerX + 15, playerY + 5 + bounce);
    ctx.lineTo(playerX + 28, playerY - 10 + bounce);
    ctx.stroke();
    
    // Punta brillante
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(playerX + 30, playerY - 12 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;

    // Efecto victoria
    if (effect === 'victory') {
      const time = Date.now() / 150;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const radius = 45 + Math.sin(time * 2) * 8;
        const starX = playerX + Math.cos(angle) * radius;
        const starY = playerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = '#fbbf24';
        ctx.font = '14px serif';
        ctx.fillText('✦', starX - 7, starY + 5);
      }
    }

    // Efecto recolectar estrella
    if (effect === 'starCollect') {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const sparkleX = playerX + Math.cos(angle) * 30;
        const sparkleY = playerY + Math.sin(angle) * 30;
        
        ctx.fillStyle = `rgba(251, 191, 36, ${0.8 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

  }, [level, pos.x, pos.y, frame, effect, theme, collectedStars]);

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
          <span className="position-value">{pos.x}</span>
          <span className="position-separator">,</span>
          <span className="position-goal">{pos.y}</span>
        </div>
        
        {/* Estrellas */}
        {level.stars && level.stars.length > 0 && (
          <div className="stars-display">
            <span>⭐</span>
            <span className="stars-current">{collectedStars?.length || 0}</span>
            <span className="stars-separator">/</span>
            <span className="stars-total">{level.stars.length}</span>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="progress-container">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min(((pos.x + pos.y) / (level.targetPosition.x + level.targetPosition.y)) * 100, 100)}%`
            }}
          />
        </div>
        <p className="progress-hint">
          Posición: ({pos.x}, {pos.y}) → Meta: ({level.targetPosition.x}, {level.targetPosition.y})
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
