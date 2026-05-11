/**
 * Evaluador para JavaScript - Versión Flexible
 */

function getFriendlyError(error) {
  const str = String(error);
  if (str.includes('not defined')) {
    return `❌ Variable no definida. ¿Olvidaste declararla?`;
  }
  if (str.includes('Unexpected token')) {
    return `❌ Error de sintaxis. Revisa paréntesis, llaves y punto y coma`;
  }
  if (str.includes('is not defined')) {
    return `❌ Algo no está definido. ¿Tipaste mal el nombre?`;
  }
  return `❌ ${str}`;
}

// Normaliza strings: elimina espacios extra, minusculas para comparaciones
function normalizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/\s+/g, ' ');
}

// Compara dos valores de forma flexible (ignora mayúsculas para strings)
function flexibleCompare(userValue, expectedValue) {
  // Si ambos son strings, compara sin importar mayúsculas
  if (typeof userValue === 'string' && typeof expectedValue === 'string') {
    return normalizeString(userValue).toLowerCase() === normalizeString(expectedValue).toLowerCase();
  }
  // Para números, permite comparación flexible (5 == "5")
  if (typeof userValue === 'number' && typeof expectedValue === 'string') {
    const num = Number(expectedValue);
    if (!isNaN(num)) return userValue === num;
  }
  if (typeof expectedValue === 'number' && typeof userValue === 'string') {
    const num = Number(userValue);
    if (!isNaN(num)) return num === expectedValue;
  }
  // Comparación estricta para el resto
  return userValue === expectedValue;
}

export function analyzeCodeStructure(code) {
  const issues = [];
  const warnings = [];
  
  if (/eval\s*\(/.test(code)) {
    issues.push('Código no permitido: eval()');
  }
  if (/Function\s*\(/.test(code)) {
    issues.push('Código no permitido: Function()');
  }
  
  // Warnings para common mistakes
  if (/=\s*\w+\s*==/.test(code)) {
    warnings.push('💡 Quizás quisiste usar === en lugar de ==');
  }
  
  return { issues, warnings, isValid: issues.length === 0 };
}

// Extrae variables declaradas por el usuario
function extractUserVariables(userCode) {
  const variables = new Set();
  // Match: let xxx, const xxx, var xxx
  const declareMatch = userCode.matchAll(/(?:let|const|var)\s+(\w+)/g);
  for (const match of declareMatch) {
    variables.add(match[1]);
  }
  // Match: xxx = value (asignaciones sin declarar antes)
  const assignMatch = userCode.matchAll(/^(\w+)\s*=/gm);
  for (const match of assignMatch) {
    variables.add(match[1]);
  }
  return variables;
}

export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests', testResults: [] };
  }
  
  const analysis = analyzeCodeStructure(userCode);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], testResults: [], warnings: analysis.warnings };
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
    // Ejecutar el código del usuario
    const execCode = `
      "use strict";
      var console = { log: function(){ 
        var args = Array.from(arguments).map(a => {
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          if (typeof a === 'object') {
            try { return JSON.stringify(a); } catch(e) { return String(a); }
          }
          return String(a);
        }).join(' ');
        __log(text);
      }};
      var __log = function(text) { __capturedLogs.push(text); };
      var __capturedLogs = [];
      ${userCode}
    `;
    
    const capturedLogs = [];
    const execFn = new Function('__log', execCode);
    
    try {
      execFn((text) => capturedLogs.push(text));
      capturedLogs.forEach(t => {
        logs.push(t);
        if (onProgress) onProgress({ type: 'console', text: t });
      });
    } catch (execError) {
      // Error de ejecución - puede ser por sintaxis
      return {
        success: false,
        error: getFriendlyError(execError),
        logs,
        testResults: [],
        warnings: analysis.warnings
      };
    }
    
    // Obtener variables declaradas por el usuario
    const userVars = extractUserVariables(userCode);
    
    // Ejecutar cada test
    for (const test of level.challenge.tests) {
      try {
        // Extraer el nombre de variable del test (ej: "resultado === 'positivo'" -> "resultado")
        const varNameMatch = test.code.match(/^(\w+)\s*[=!<>]+/);
        const varName = varNameMatch ? varNameMatch[1] : null;
        
        // Verificar si la variable existe
        if (varName && !userVars.has(varName) && !userVars.has(varName.charAt(0).toLowerCase() + varName.slice(1))) {
          // Variable no declarada - dar mensaje amigable
          results.push({
            description: test.description,
            passed: false,
            message: `❌ La variable "${varName}" no está definida. Revisa mayúsculas: ¿escribiste "${varName}" con mayúscula?`
          });
          continue;
        }
        
        // Evaluar el test
        const testCode = `
          "use strict";
          var console = { log: function(){} };
          ${userCode}
          ;
          return (${test.code});
        `;
        
        const testFn = new Function(testCode);
        const passed = testFn();
        
        if (passed) {
          results.push({
            description: test.description,
            passed: true,
            message: '✅ Correcto'
          });
        } else {
          // Test falló - dar feedback helpful
          let hint = '';
          if (varName) {
            hint = ` Revisa el valor de "${varName}"`;
          }
          results.push({
            description: test.description,
            passed: false,
            message: `❌ Incorrecto: ${test.description}${hint}`
          });
        }
        
      } catch (e) {
        // Error en el test - puede ser porque la variable tiene mal el nombre
        const varMatch = test.code.match(/^(\w+)\s*[=!<>]+/);
        const varName = varMatch ? varMatch[1] : null;
        
        let errorMsg = getFriendlyError(e);
        if (e.message.includes('is not defined') && varName) {
          errorMsg = `❌ La variable "${varName}" no se encuentra. ¿Usaste mayúsculas? (ej: "Resultado" vs "resultado")`;
        }
        
        results.push({
          description: test.description,
          passed: false,
          message: errorMsg
        });
      }
    }
    
    const allPassed = results.every(r => r.passed);
    
    return {
      success: allPassed,
      error: allPassed ? null : results.find(r => !r.passed)?.message,
      logs,
      testResults: results,
      warnings: analysis.warnings
    };
    
  } catch (error) {
    return {
      success: false,
      error: getFriendlyError(error),
      logs,
      testResults: [],
      warnings: analysis.warnings
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
  '瓜女婿 de errores se aprende 🤓',
  '¡Ya casi lo tienes! 💡',
  'Piensa un poco... 🤔',
];

export function getMotivationalMessage(testResults = [], attemptCount = 0, hasHints = false) {
  if (testResults.length > 0 && testResults.some(t => !t.passed)) {
    const failedTest = testResults.find(t => !t.passed);
    // Mensajes según el error
    if (failedTest.message.includes('mayúscula')) {
      return '💡 Revisa las mayúsculas en los nombres de variables';
    }
    if (failedTest.message.includes('no está definida')) {
      return '💡 Primero declara la variable con let o const';
    }
  }
  
  if (attemptCount > 2) {
    return '💡 ¿Necesitas una pista? Presiona "Mostrar pista"';
  }
  
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}