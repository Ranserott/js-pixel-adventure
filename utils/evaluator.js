/**
 * Evaluador de código JavaScript - Versión Mejorada
 */

const DANGEROUS_PATTERNS = [
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\s*\./i,
  /window\s*\./i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /import\s*\(/i,
  /require\s*\(/i,
  /process\s*\./i,
  /global\s*\./i,
  /location\s*\./i,
  /\$_\w+/i,
  /__proto__/,
  /constructor/,
  /prototype/,
];

// Mensajes de error amigables en español
const ERROR_MESSAGES = {
  'not defined': (name) => `❌ La variable "${name}" no está definida. ¿Olvidaste declararla?`,
  'is not a function': (name) => `❌ "${name}" no es una función.`,
  'is not a constructor': `❌ Estás usando "new" con algo que no es constructor.`,
  'Unexpected token': `❌ Error de sintaxis. Revisa paréntesis, llaves y punto y coma.`,
  'Unexpected end': `❌ La expresión está incompleta.`,
  'Illegal': `❌ Carácter ilegal encontrado.`,
  'Too many': `❌ Demasiadas operaciones. ¿Hay un bucle infinito?`,
  'Cannot read': (prop) => `❌ No se puede leer "${prop}".`,
  'invalid assignment': `❌ Asignación inválida.`,
  'undefined': (prop) => `❌ "${prop}" es undefined.`,
  'null': (prop) => `❌ "${prop}" es null.`,
};

function getFriendlyError(error) {
  const errorStr = String(error);
  
  for (const [key, handler] of Object.entries(ERROR_MESSAGES)) {
    if (errorStr.includes(key)) {
      if (typeof handler === 'function') {
        const match = errorStr.match(/["']?(\w+)["']?/);
        return handler(match ? match[1] : key);
      }
      return handler;
    }
  }
  
  return `❌ Error: ${errorStr}`;
}

// Analiza el código
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      issues.push(`Código no permitido detectado`);
    }
  }
  
  if (code.includes('while(true)') || code.includes('while (true)')) {
    warnings.push('⚠️ Cuidado: while(true) puede crear un bucle infinito');
  }
  
  if (code.match(/if\s*\([^)]*=[^=]/)) {
    warnings.push('💡 ¿Usaste = en vez de === dentro del if?');
  }
  
  return { issues, warnings, suggestions, isValid: issues.length === 0 };
}

// Ejecuta código y retorna variables
export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests configurados', testResults: [] };
  }
  
  const analysis = analyzeCodeStructure(userCode, level);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], testResults: [] };
  }
  
  const logs = [];
  
  const safeConsole = {
    log: (...args) => {
      const text = args.map(arg => {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (typeof arg === 'object') {
          try { return JSON.stringify(arg); } 
          catch { return String(arg); }
        }
        return String(arg);
      }).join(' ');
      logs.push(text);
      if (onProgress) onProgress({ type: 'console', text });
    },
    error: (...args) => logs.push('❌ ' + args.join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
    info: (...args) => logs.push('ℹ️ ' + args.join(' '))
  };
  
  try {
    // Crear contexto que ejecute el código y capture las variables
    const contextCode = `
      "use strict";
      const console = arguments[0];
      ${userCode}
      ;
      return { ${getDeclaredVars(userCode).join(', ')} };
    `;
    
    const capturedVars = new Function('console', contextCode)(safeConsole);
    
    // Ahora evaluar los tests con las variables capturadas
    const testResults = evaluateTestsWithVars(capturedVars, level.challenge.tests);
    
    const allPassed = testResults.every(t => t.passed);
    
    return {
      success: allPassed,
      error: allPassed ? null : testResults.find(t => !t.passed)?.message,
      warnings: analysis.warnings,
      logs: logs,
      testResults: testResults
    };
    
  } catch (error) {
    return {
      success: false,
      error: getFriendlyError(error),
      warnings: analysis.warnings,
      logs: logs,
      testResults: []
    };
  }
}

// Extrae los nombres de variables declaradas en el código
function getDeclaredVars(code) {
  const vars = [];
  
  // Buscar let, const, var declarations
  const letMatch = code.matchAll(/(?:let|const|var)\s+(\w+)/g);
  for (const match of letMatch) {
    vars.push(match[1]);
  }
  
  // Buscar function declarations
  const funcMatch = code.matchAll(/function\s+(\w+)/g);
  for (const match of funcMatch) {
    vars.push(match[1]);
  }
  
  return vars;
}

// Evalúa los tests con las variables capturadas
function evaluateTestsWithVars(capturedVars, tests) {
  const results = [];
  
  for (const test of tests) {
    try {
      // Crear una función que tenga acceso a las variables capturadas
      const testCode = `
        "use strict";
        const { ${Object.keys(capturedVars).join(', ')} } = arguments[0];
        return (${test.code});
      `;
      
      const passed = new Function(testCode)(capturedVars);
      
      results.push({
        code: test.code,
        description: test.description,
        passed: Boolean(passed),
        message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}`
      });
      
    } catch (error) {
      results.push({
        code: test.code,
        description: test.description,
        passed: false,
        message: `❌ Error: ${getFriendlyError(error)}`
      });
    }
  }
  
  return results;
}

// Hint progresivo
export function getLevelHint(level, attemptCount = 0) {
  if (!level?.challenge?.hints) return 'Revisa la teoría y piensa en la solución.';
  
  const hints = level.challenge.hints;
  
  if (attemptCount === 0) {
    return hints[0];
  } else if (attemptCount === 1) {
    return hints.length > 1 ? hints[1] : hints[0];
  } else if (attemptCount >= 2) {
    return hints.length > 2 ? hints[2] : hints[hints.length - 1];
  }
  
  return hints[0];
}

// Mensaje motivacional
const MOTIVATIONAL_MESSAGES = [
  '¡Sigue intentando, lo estás haciendo genial! 💪',
  '¡No te rindas! Cada error es una oportunidad de aprender 🚀',
  '¡Piensa un poco más, tú puedes! 🎯',
  'Revisa la teoría de nuevo, ahí está la pista 📚',
  '¡Un paso a la vez! Pronto lo lograrás ✨',
];

export function getMotivationalMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
