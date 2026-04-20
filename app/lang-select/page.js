'use client';

import { useState } from 'react';
import Link from 'next/link';
import { curriculum } from '../../data/curriculum';
import { curriculumPython } from '../../data/curriculum-python';

export default function LangSelect() {
  const [hovered, setHovered] = useState(null);

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: '📘',
      color: '#f7df1e',
      description: 'Aprende los fundamentos de JS',
      href: '/',
      stats: curriculum
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#3776ab',
      description: 'Aprende los fundamentos de Python',
      href: '/python',
      stats: curriculumPython
    }
  ];

  return (
    <div className="lang-select-container">
      <div className="lang-select-content">
        <h1 className="lang-select-title">DESAFIO:</h1>
        <p className="lang-select-subtitle">Selecciona un lenguaje para comenzar</p>
        
        <div className="lang-cards">
          {languages.map((lang) => (
            <Link 
              href={lang.href} 
              key={lang.id}
              className={`lang-card ${hovered === lang.id ? 'hovered' : ''}`}
              style={{ '--lang-color': lang.color }}
              onMouseEnter={() => setHovered(lang.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="lang-card-icon">{lang.icon}</div>
              <h2>{lang.name}</h2>
              <p>{lang.description}</p>
              <div className="lang-card-stats">
                <span className="stat-icon">📚</span>
                <span>{Object.values(lang.stats).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lecciones</span>
              </div>
              <div className="lang-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .lang-select-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .lang-select-content {
          text-align: center;
          max-width: 800px;
          width: 100%;
        }

        .lang-select-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #f7df1e 0%, #ff6b6b 50%, #c44569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        .lang-select-subtitle {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 48px;
        }

        .lang-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .lang-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 32px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .lang-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--lang-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .lang-card:hover::before,
        .lang-card.hovered::before {
          transform: scaleX(1);
        }

        .lang-card:hover,
        .lang-card.hovered {
          transform: translateY(-8px);
          border-color: var(--lang-color);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }

        .lang-card-icon {
          font-size: 64px;
        }

        .lang-card h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .lang-card p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .lang-card-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 8px;
        }

        .stat-icon {
          font-size: 18px;
        }

        .lang-card-arrow {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
          color: var(--lang-color);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .lang-card:hover .lang-card-arrow,
        .lang-card.hovered .lang-card-arrow {
          opacity: 1;
        }

        @media (max-width: 600px) {
          .lang-cards {
            grid-template-columns: 1fr;
          }

          .lang-select-title {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}
