'use client';

import { useState, useEffect } from 'react';
import { achievements, getAchievementProgress } from '../data/achievements';

export default function AchievementsPanel({ stats, completedLessons }) {
  const [showPanel, setShowPanel] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const progress = getAchievementProgress(stats, completedLessons);

  // Mostrar notificación cuando se desbloquea algo nuevo
  useEffect(() => {
    const lastShown = localStorage.getItem('lastShownAchievements');
    const lastShownArray = lastShown ? JSON.parse(lastShown) : [];
    
    const newlyEarned = progress.earned.filter(a => !lastShownArray.includes(a.id));
    
    if (newlyEarned.length > 0) {
      setNewAchievements(newlyEarned);
      localStorage.setItem('lastShownAchievements', JSON.stringify(progress.earned.map(a => a.id)));
      
      // Ocultar después de 3 segundos
      setTimeout(() => setNewAchievements([]), 4000);
    }
  }, [progress.earned]);

  return (
    <>
      {/* Botón de logros */}
      <button className="achievements-btn" onClick={() => setShowPanel(!showPanel)}>
        🏆 <span className="achievements-count">{progress.earned.length}</span>
      </button>

      {/* Notificación de nuevo logro */}
      {newAchievements.length > 0 && (
        <div className="achievement-notification">
          <span className="notification-icon">🎉</span>
          <div className="notification-content">
            <strong>¡Nuevo logro!</strong>
            <span>{newAchievements[0].title}</span>
          </div>
        </div>
      )}

      {/* Panel de logros */}
      {showPanel && (
        <div className="achievements-panel">
          <div className="panel-header">
            <h3>🏆 Logros</h3>
            <span className="progress-text">{progress.earned.length}/{progress.total}</span>
            <button className="close-panel" onClick={() => setShowPanel(false)}>×</button>
          </div>
          
          <div className="progress-bar-container">
            <div className="achievements-progress-bar">
              <div 
                className="achievements-progress-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="progress-percentage">{progress.percentage}%</span>
          </div>

          <div className="achievements-grid">
            {achievements.map(achievement => {
              const isEarned = progress.earned.some(a => a.id === achievement.id);
              
              return (
                <div 
                  key={achievement.id}
                  className={`achievement-item ${isEarned ? 'earned' : 'locked'}`}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                  </div>
                  {isEarned && <span className="achievement-check">✅</span>}
                  {!isEarned && <span className="achievement-lock">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
