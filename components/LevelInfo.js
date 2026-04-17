'use client';

/**
 * Componente LevelInfo - Muestra la información de la historia y objetivo del nivel
 * @description Presenta la narrativa y metas del nivel actual
 */
export default function LevelInfo({ level }) {
  if (!level) {
    return (
      <div className="level-info">
        <p>Cargando nivel...</p>
      </div>
    );
  }

  return (
    <div className="level-info">
      {/* Historia del nivel */}
      <div className="story-box">
        <h3>📖 Historia</h3>
        <p>{level.story}</p>
      </div>

      {/* Objetivo del nivel */}
      <div className="objective-box">
        <h3>🎯 Objetivo</h3>
        <p>{level.objective}</p>
      </div>

      {/* Concepto enseñado */}
      <div className="concept-box">
        <span className="concept-label">📚 Concepto:</span>
        <span className="concept-value">{level.concept}</span>
      </div>
    </div>
  );
}
