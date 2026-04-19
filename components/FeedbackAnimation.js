'use client';

import { useState, useEffect } from 'react';

export default function FeedbackAnimation({ testResults, onAnimationEnd }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [passedTests, setPassedTests] = useState([]);
  const [currentAnim, setCurrentAnim] = useState(0);

  useEffect(() => {
    if (testResults && testResults.length > 0) {
      const allPassed = testResults.every(t => t.passed);
      const passed = testResults.filter(t => t.passed);
      
      if (allPassed) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      } else {
        setPassedTests(passed);
        if (passed.length > 0) {
          setShowFail(true);
          // Animar cada test pasado
          animateTests(passed.length);
        }
      }
    }
  }, [testResults]);

  const animateTests = (count) => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentAnim(i);
      if (i >= count) {
        clearInterval(interval);
        setTimeout(() => setShowFail(false), 1000);
      }
    }, 300);
  };

  if (showSuccess) {
    return (
      <div className="success-animation">
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                '--delay': `${Math.random() * 0.5}s`,
                '--x': `${Math.random() * 200 - 100}px`,
                '--rotation': `${Math.random() * 360}deg`,
                '--color': ['#22c55e', '#6366f1', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
        <div className="success-message">
          <span className="success-icon">🎉</span>
          <h3>¡Excelente!</h3>
          <p>Todos los tests pasaron</p>
        </div>
      </div>
    );
  }

  if (showFail && passedTests.length > 0) {
    return (
      <div className="fail-animation">
        <div className="fail-message">
          <div className="fail-icon">💪</div>
          <p>{passedTests.length} de {testResults.length} tests pasaron</p>
          <div className="passed-tests-list">
            {passedTests.map((test, i) => (
              <span 
                key={i} 
                className="passed-badge"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                ✅ {test.description.length > 30 
                  ? test.description.substring(0, 30) + '...' 
                  : test.description}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
