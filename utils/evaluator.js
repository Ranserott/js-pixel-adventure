/**
 * Evaluador de código JavaScript - Simplificado v2
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

function getFriendlyError(error) {
  const errorStr = String(error);
  
  if (errorStr.includes('not defined')) {
    const match = errorStr.match(/["']?(\w+)["']?/);
    return `❌ La variable "${match ? match[1] : 'desconocida'}" no está definida.`;
  }
  if (errorStr.includes('is not a function')) {
    return `❌ Eso no es una función.`;
  }
  if (errorStr.includes('Unexpected token')) {
    return `❌ Error de sintaxis. Revisa paréntesis y puntos y coma.`;
  }
  if (errorStr.includes('Unexpected end')) {
    return `❌ La expresión está incompleta.`;
  }
  
  return `❌ Error: ${errorStr}`;
}

export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      issues.push(`Código no permitido detectado`);
    }
  }
  
  if (code.includes('while(true)') || code.includes('while (true)')) {
    warnings.push('⚠️ Cuidado: while(true) puede crear un bucle infinito');
  }
  
  return { issues, warnings, suggestions: [], isValid: issues.length === 0 };
}

export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests configurados', testResults: [] };
  }
  
  const analysis = analyzeCodeStructure(userCode, level);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], testResults: [] };
  }
  
  const logs = [];
  
  // Logger simple
  const logger = {
    log: function() {
      const text = Array.from(arguments).map(arg => {
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
    }
  };
  
  try {
    // Extraer nombres de variables del código
    const declaredVars = getDeclaredVars(userCode);
    
    // Crear contexto que incluya console E injecte las variables declaradas
    // El truco: envolvemos el código y retornamos las variables
    const wrapperCode = `
      "use strict";
      var __log = arguments[0];
      var console = { log: __log.log.bind(__log) };
      
      // Las variables del usuario
      ${userCode}
      
      // Retornar un objeto con las variables
      ;(function() {
        var result = {};
        var varList = ${JSON.stringify(declaredVars)};
        varList.forEach(function(v) {
          try { result[v] = eval(v); } catch(e) { result[v] = undefined; }
        });
        return result;
      })();
    `;
    
    const execFn = new Function(wrapperCode);
    const capturedVars = execFn(logger);
    
    // Evaluar tests con las variables capturadas
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

function getDeclaredVars(code) {
  const vars = [];
  
  // Buscar let, const, var
  const declMatch = code.matchAll(/(?:let|const|var)\s+(\w+)/g);
  for (const match of declMatch) {
    if (!vars.includes(match[1])) vars.push(match[1]);
  }
  
  // Buscar function declarations
  const funcMatch = code.matchAll(/function\s+(\w+)/g);
  for (const match of funcMatch) {
    if (!vars.includes(match[1])) vars.push(match[1]);
  }
  
  return vars;
}

function evaluateTestsWithVars(capturedVars, tests) {
  const results = [];
  
  for (const test of tests) {
    try {
      const varNames = Object.keys(capturedVars);
      const testCode = `
        "use strict";
        ${varNames.map(v => `var ${v} = arguments[0]["${v}"];`).join(';')}
        return (${test.code});
      `;
      
      const testFn = new Function(testCode);
      const passed = testFn(capturedVars);
      
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

export function getLevelHint(level, attemptCount = 0) {
  if (!level?.challenge?.hints) return 'Revisa la teoría y piensa en la solución.';
  
  const hints = level.challenge.hints;
  
  if (attemptCount === 0) return hints[0];
  if (attemptCount === 1) return hints.length > 1 ? hints[1] : hints[0];
  if (attemptCount >= 2) return hints.length > 2 ? hints[2] : hints[hints.length - 1];
  
  return hints[0];
}

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
