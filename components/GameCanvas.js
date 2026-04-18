'use client';

import { useEffect, useState, useRef } from 'react';
import { themes } from '../data/levels';

/**
 * GameCanvas - Renderizado del juego con gráficos mejorados
 */
export default function GameCanvas({ level, currentPosition, isMoving, lastCommand }) {
  const [frame, setFrame] = useState(0);
  const [effect, setEffect] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const theme = level ? themes[level.theme] || themes.forest : themes.forest;

  // Animación del bucle
  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => setFrame(f => (f + 1) % 4), 150);
      return () => clearInterval(interval);
    } else {
      setFrame(0);
    }
  }, [isMoving]);

  // Efecto de movimiento
  useEffect(() => {
    if (currentPosition > 0 && isMoving) {
      setEffect('dust');
      setTimeout(() => setEffect(null), 400);
    }
  }, [currentPosition, isMoving]);

  // Efecto de victoria
  useEffect(() => {
    if (!isMoving && currentPosition === level?.goalPosition && currentPosition > 0) {
      setEffect('victory');
      setTimeout(() => setEffect(null), 1500);
    }
  }, [isMoving, currentPosition, level]);

  // Renderizado principal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !level) return;

    const ctx = canvas.getContext('2d');
    const cellSize = 64;
    const gridSize = Math.min(level.gridSize, 10);
    
    canvas.width = gridSize * cellSize + 40;
    canvas.height = cellSize * 2.5;

    // Fondo según tema
    if (level.theme === 'forest') {
      // Bosque con gradiente
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0a1a0a');
      bgGrad.addColorStop(0.5, '#0d2810');
      bgGrad.addColorStop(1, '#1a3d1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Árboles de fondo
      for (let i = 0; i < gridSize; i += 2) {
        drawTree(ctx, i * cellSize + cellSize/2 + 20, cellSize * 0.8, 0.4);
      }
    } else if (level.theme === 'magic') {
      // Tema mágico con partículas
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0a0a1a');
      bgGrad.addColorStop(1, '#1a0a2e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Partículas flotantes
      drawParticles(ctx, canvas.width, canvas.height);
    } else {
      // Default oscuro
      ctx.fillStyle = '#0a0a15';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Camino principal
    const pathY = cellSize * 1.2;
    const pathHeight = cellSize * 1.2;
    
    // Borde del camino
    ctx.fillStyle = 'rgba(20, 80, 20, 0.5)';
    ctx.fillRect(20, pathY - 4, gridSize * cellSize, pathHeight + 8);
    
    // Camino
    const pathGrad = ctx.createLinearGradient(0, pathY, 0, pathY + pathHeight);
    pathGrad.addColorStop(0, '#2d4a2d');
    pathGrad.addColorStop(1, '#1a3d1a');
    ctx.fillStyle = pathGrad;
    ctx.fillRect(20, pathY, gridSize * cellSize, pathHeight);
    
    // Líneas del camino
    ctx.strokeStyle = 'rgba(100, 180, 100, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i < gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(20 + i * cellSize, pathY);
      ctx.lineTo(20 + i * cellSize, pathY + pathHeight);
      ctx.stroke();
    }

    // Posición inicio
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▶', 20 + level.startPosition * cellSize + cellSize/2, pathY + pathHeight + 20);

    // Meta
    const goalX = 20 + level.goalPosition * cellSize + cellSize/2;
    ctx.fillStyle = '#fbbf24';
    ctx.font = '24px serif';
    ctx.fillText('⭐', goalX, pathY + pathHeight/2 + 8);

    // Dibujar mago
    const charX = 20 + currentPosition * cellSize + cellSize/2;
    const charY = pathY + pathHeight/2;
    
    drawWizard(ctx, charX, charY, frame, isMoving, effect === 'victory');

    // Efecto de polvo
    if (effect === 'dust') {
      for (let i = 0; i < 6; i++) {
        const dustX = charX - 10 + Math.random() * 20;
        const dustY = charY + 25 + Math.random() * 10;
        ctx.fillStyle = `rgba(150, 200, 150, ${0.6 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(dustX, dustY, 3 - i * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Línea de progreso
    if (currentPosition > 0) {
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20 + cellSize/2, pathY + pathHeight + 35);
      ctx.lineTo(charX, pathY + pathHeight + 35);
      ctx.stroke();
    }

  }, [level, currentPosition, frame, effect, theme]);

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

/**
 * Dibuja un árbol
 */
function drawTree(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Tronco
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(-8, 0, 16, 50);
  
  // Hojas (triángulo)
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(-35, 10);
  ctx.lineTo(35, 10);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.lineTo(-30, 0);
  ctx.lineTo(30, 0);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

/**
 * Dibuja partículas flotantes
 */
function drawParticles(ctx, width, height) {
  const time = Date.now() / 1000;
  for (let i = 0; i < 15; i++) {
    const x = (Math.sin(time + i * 0.7) * 0.5 + 0.5) * width;
    const y = (Math.cos(time * 0.8 + i * 0.5) * 0.5 + 0.5) * height;
    const size = 1 + Math.sin(time * 2 + i) * 0.5;
    const alpha = 0.3 + Math.sin(time * 3 + i * 0.3) * 0.2;
    
    ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Dibuja el mago con animaciones
 */
function drawWizard(ctx, x, y, frame, isMoving, isVictory) {
  ctx.save();
  ctx.translate(x, y);
  
  // Animación de flotación/bounce
  const bounce = isMoving ? Math.sin(frame * Math.PI / 2) * 3 : Math.sin(Date.now() / 500) * 2;
  ctx.translate(0, bounce);
  
  // Glow efecto
  if (isVictory) {
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 30;
  } else {
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 15;
  }
  
  // Cuerpo (túnica)
  ctx.fillStyle = '#5b21b6';
  ctx.beginPath();
  ctx.moveTo(-15, 10);
  ctx.lineTo(-20, 35);
  ctx.lineTo(20, 35);
  ctx.lineTo(15, 10);
  ctx.closePath();
  ctx.fill();
  
  // Detalle de la túnica
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(-10, 15);
  ctx.lineTo(-12, 35);
  ctx.lineTo(12, 35);
  ctx.lineTo(10, 15);
  ctx.closePath();
  ctx.fill();
  
  // Cabeza
  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(0, -5, 14, 0, Math.PI * 2);
  ctx.fill();
  
  // Sombrero puntiagudo
  ctx.fillStyle = '#5b21b6';
  ctx.beginPath();
  ctx.moveTo(-18, -5);
  ctx.lineTo(0, -45);
  ctx.lineTo(18, -5);
  ctx.closePath();
  ctx.fill();
  
  // Ala del sombrero
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.arc(-5, -15, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Ojos
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(-5, -6, 2.5, 0, Math.PI * 2);
  ctx.arc(5, -6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Sonrisa
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -2, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  
  // Varita
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(18, 5);
  ctx.lineTo(30, -15);
  ctx.stroke();
  
  // Punta de varita brillante
  ctx.fillStyle = '#fbbf24';
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(32, -17, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Efecto de victoria
  if (isVictory) {
    const time = Date.now() / 200;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const radius = 40 + Math.sin(time * 2) * 5;
      const starX = Math.cos(angle) * radius;
      const starY = Math.sin(angle) * radius - 10;
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = '12px serif';
      ctx.fillText('✦', starX - 6, starY);
    }
  }
  
  ctx.restore();
}
