'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { curriculum } from '../../data/curriculum';
import { curriculumPython } from '../../data/curriculum-python';

export default function LangSelect() {
  const [hovered, setHovered] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const chars = ['{ }', '( )', '[ ]', '< >', '=>', '++', '&&', '||', '::', '###', '>>>', '---'];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
      size: 12 + Math.random() * 16
    }));
    setParticles(newParticles);
  }, []);

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '📘',
      color: '#f7df1e',
      secondaryColor: '#323330',
      description: 'Domina el lenguaje de la web',
      lessons: Object.values(curriculum).reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
      href: '/',
      features: ['ES6+ moderno', 'DOM manipulation', 'Async/Await']
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#3776ab',
      secondaryColor: '#ffd43b',
      description: 'El poder de la simplicidad',
      lessons: Object.values(curriculumPython).reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
      href: '/python',
      features: ['Sintaxis limpia', 'Data Science', 'IA/ML']
    }
  ];

  return (
    <div className="lang-select-container">
      {/* Floating particles background */}
      <div className="particles">
        {particles.map(p => (
          <span 
            key={p.id} 
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`
            }}
          >
            {p.char}
          </span>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="lang-select-content">
        {/* Logo */}
        <div className="logo-section">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">AprendeCódigo</span>
        </div>

        {/* Title */}
        <h1 className="lang-select-title">
          <span className="title-prefix">DESAFIO:</span>
          <span className="title-sub">Elige tu camino</span>
        </h1>
        
        <p className="lang-select-subtitle">
          Selecciona un lenguaje y comienza tu viaje de aprendizaje
        </p>

        {/* Language Cards */}
        <div className="lang-cards">
          {languages.map((lang) => (
            <Link 
              href={lang.href} 
              key={lang.id}
              className={`lang-card ${hovered === lang.id ? 'hovered' : ''}`}
              style={{ '--lang-color': lang.color, '--lang-secondary': lang.secondaryColor }}
              onMouseEnter={() => setHovered(lang.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Background gradient */}
              <div className="card-bg"></div>
              
              {/* Icon */}
              <div className="card-icon-wrapper">
                <span className="card-icon">{lang.icon}</span>
              </div>

              {/* Content */}
              <h2 className="card-title">{lang.name}</h2>
              <p className="card-description">{lang.description}</p>

              {/* Features */}
              <div className="card-features">
                {lang.features.map((f, i) => (
                  <span key={i} className="feature-tag">{f}</span>
                ))}
              </div>

              {/* Lessons count */}
              <div className="card-lessons">
                <span className="lessons-icon">📚</span>
                <span>{lang.lessons} lecciones</span>
              </div>

              {/* Arrow */}
              <div className="card-arrow">→</div>

              {/* Hover shine effect */}
              <div className="card-shine"></div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="lang-footer">
          <p>🎯 Aprende jugando, completa desafíos y domina nuevos lenguajes</p>
        </div>
      </div>

      <style jsx>{`
        .lang-select-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Floating particles */
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          color: rgba(255, 255, 255, 0.08);
          font-family: 'Fira Code', monospace;
          animation: float-particle linear infinite;
          top: -50px;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Glowing orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation: pulse-orb 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
          animation: pulse-orb 10s ease-in-out infinite reverse;
        }

        @keyframes pulse-orb {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .lang-select-content {
          text-align: center;
          max-width: 1000px;
          width: 100%;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 48px;
        }

        .logo-icon {
          font-size: 40px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .logo-text {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Title */
        .lang-select-title {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .title-prefix {
          font-size: 72px;
          font-weight: 800;
          background: linear-gradient(135deg, #f7df1e 0%, #ff6b6b 50%, #c44569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          text-shadow: 0 0 80px rgba(247, 223, 30, 0.3);
          animation: glow-text 3s ease-in-out infinite;
        }

        @keyframes glow-text {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        .title-sub {
          font-size: 32px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 8px;
        }

        .lang-select-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 56px;
        }

        /* Cards */
        .lang-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-bottom: 48px;
        }

        .lang-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 48px 40px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .card-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--lang-color) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .lang-card:hover .card-bg,
        .lang-card.hovered .card-bg {
          opacity: 0.08;
        }

        .card-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .lang-card:hover .card-shine,
        .lang-card.hovered .card-shine {
          left: 100%;
        }

        .lang-card:hover,
        .lang-card.hovered {
          transform: translateY(-12px) scale(1.02);
          border-color: var(--lang-color);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(var(--lang-color), 0.15);
        }

        .card-icon-wrapper {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--lang-color) 0%, var(--lang-secondary) 100%);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.4s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .lang-card:hover .card-icon-wrapper,
        .lang-card.hovered .card-icon-wrapper {
          transform: scale(1.1) rotate(-5deg);
        }

        .card-icon {
          font-size: 48px;
        }

        .card-title {
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .card-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 20px 0;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .feature-tag {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .card-lessons {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--lang-color);
          font-weight: 600;
        }

        .lessons-icon {
          font-size: 18px;
        }

        .card-arrow {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 28px;
          color: var(--lang-color);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .lang-card:hover .card-arrow,
        .lang-card.hovered .card-arrow {
          opacity: 1;
          transform: translateY(-50%) translateX(8px);
        }

        /* Footer */
        .lang-footer {
          margin-top: 16px;
        }

        .lang-footer p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .title-prefix {
            font-size: 48px;
          }

          .title-sub {
            font-size: 24px;
          }

          .lang-cards {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .lang-card {
            padding: 36px 28px;
          }

          .card-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
