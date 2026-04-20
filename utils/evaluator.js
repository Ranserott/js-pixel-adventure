/**
 * Evaluador para JavaScript
 */

function getFriendlyError(error) {
  const str = String(error);
  if (str.includes('not defined')) {
    return `❌ Variable no definida`;
  }
  if (str.includes('Unexpected token')) {
    return `❌ Error de sintaxis`;
  }
  return `❌ ${str}`;
}

export function analyzeCodeStructure(code) {
  const issues = [];
  if (/eval\s*\(|Function\s*\(/.test(code)) {
    issues.push('Código no permitido');
  }
  return { issues, warnings: [], isValid: issues.length === 0 };
}

export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests', testResults: [] };
  }
  
  const analysis = analyzeCodeStructure(userCode);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], testResults: [] };
  }
  
  const logs = [];
  const results = [];
  
  const log = (...args) => {
    const text = args.map(a => {
      if (a === null) return 'null';
      if (a === undefined) return 'undefined';
      if (typeof a === 'object') {
        try { return JSON.stringify(a); } catch { return String(a); }
      }
      return String(a);
    }).join(' ');
    logs.push(text);
    if (onProgress) onProgress({ type: 'console', text });
  };
  
  try {
    const execCode = `
      "use strict";
      var console = { log: arguments[0] };
      ${userCode}
    `;
    
    const execFn = new Function(execCode);
    execFn(log);
    
    for (const test of level.challenge.tests) {
      try {
        const testCode = `
          "use strict";
          var console = { log: function(){} };
          ${userCode}
          ;
          return (${test.code});
        `;
        
        const testFn = new Function(testCode);
        const passed = testFn();
        
        results.push({
          description: test.description,
          passed: Boolean(passed),
          message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}`
        });
        
      } catch (e) {
        results.push({
          description: test.description,
          passed: false,
          message: `❌ Error: ${getFriendlyError(e)}`
        });
      }
    }
    
    const allPassed = results.every(r => r.passed);
    
    return {
      success: allPassed,
      error: allPassed ? null : results.find(r => !r.passed)?.message,
      logs,
      testResults: results
    };
    
  } catch (error) {
    return {
      success: false,
      error: getFriendlyError(error),
      logs,
      testResults: []
    };
  }
}

export function getLevelHint(level, attemptCount = 0) {
  if (!level?.challenge?.hints) return 'Revisa la teoría';
  const hints = level.challenge.hints;
  if (attemptCount === 0) return hints[0];
  if (attemptCount === 1) return hints[Math.min(1, hints.length - 1)];
  return hints[Math.min(2, hints.length - 1)];
}

const MOTIVATIONAL_MESSAGES = [
  '¡Sigue intentando! 💪',
  '¡No te rindas! 🚀',
  '¡Tú puedes! 🎯',
];

export function getMotivationalMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}