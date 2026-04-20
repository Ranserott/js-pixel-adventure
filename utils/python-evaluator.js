/**
 * Evaluador simple para Python (simula validación en el cliente)
 * Nota: Este es un evaluador básico. Para producción se necesitaría un backend.
 */

export function analyzePythonStructure(code) {
  const issues = [];
  if (/exec\s*\(|eval\s*\(|compile\s*\(|__import__/.test(code)) {
    issues.push('Código no permitido');
  }
  return { issues, warnings: [], isValid: issues.length === 0 };
}

export function runPythonCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests', testResults: [] };
  }
  
  const analysis = analyzePythonStructure(userCode);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], testResults: [] };
  }
  
  const logs = [];
  const results = [];
  
  const log = (...args) => {
    const text = args.map(a => String(a)).join(' ');
    logs.push(text);
    if (onProgress) onProgress({ type: 'console', text });
  };
  
  // Parse Python-like code to extract variables
  // Este es un evaluador simplificado que entiende la estructura básica de Python
  
  const extractedVars = {};
  
  // Extraer asignaciones simples: variable = valor
  const assignmentRegex = /^(\w+)\s*=\s*(.+)$/gm;
  let match;
  while ((match = assignmentRegex.exec(userCode)) !== null) {
    const varName = match[1];
    let value = match[2].trim();
    
    // Remover comentarios
    value = value.split('#')[0].trim();
    
    // Procesar diferentes tipos de valores
    if (value === 'True' || value === 'False') {
      extractedVars[varName] = value === 'True';
    } else if (value.startsWith('"') || value.startsWith("'")) {
      // String
      extractedVars[varName] = value.slice(1, -1);
    } else if (!isNaN(value) || value === 'None') {
      // Number or None
      extractedVars[varName] = value === 'None' ? null : Number(value);
    } else if (value.includes('[') && value.includes(']')) {
      // List
      try {
        extractedVars[varName] = eval(value);
      } catch {
        extractedVars[varName] = value;
      }
    } else if (value.includes('{') && value.includes('}')) {
      // Dict or Set
      try {
        extractedVars[varName] = eval(value);
      } catch {
        extractedVars[varName] = value;
      }
    } else {
      // Intentamos evaluar expresiones simples
      try {
        extractedVars[varName] = Function('"use strict"; return (' + value + ')')();
      } catch {
        extractedVars[varName] = value;
      }
    }
  }
  
  // También buscar definiciones de funciones
  const funcRegex = /def\s+(\w+)\s*\([^)]*\)\s*:/g;
  while ((match = funcRegex.exec(userCode)) !== null) {
    extractedVars[match[1]] = { type: 'function', name: match[1] };
  }
  
  // También buscar clases
  const classRegex = /class\s+(\w+)\s*[\(:]/g;
  while ((match = classRegex.exec(userCode)) !== null) {
    extractedVars[match[1]] = { type: 'class', name: match[1] };
  }
  
  // Evaluar cada test
  for (const test of level.challenge.tests) {
    try {
      let passed = false;
      const testCode = test.code;
      
      // Test: isinstance(x, str/int/float/bool/list/dict/set/tuple)
      const isinstanceMatch = testCode.match(/isinstance\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/);
      if (isinstanceMatch) {
        const varName = isinstanceMatch[1];
        const expectedType = isinstanceMatch[2];
        const actualType = Array.isArray(extractedVars[varName]) ? 'list' :
                          extractedVars[varName] === null ? 'NoneType' :
                          typeof extractedVars[varName];
        passed = actualType === expectedType || 
                 (expectedType === 'int' && actualType === 'number') ||
                 (expectedType === 'str' && actualType === 'string');
      }
      // Test: 'variable' in dir() o 'variable' in locals()
      else if (testCode.includes('in dir()') || testCode.includes('in locals()')) {
        const varMatch = testCode.match(/'(\w+)'/);
        if (varMatch) {
          passed = varName in extractedVars || extractedVars.hasOwnProperty(varMatch[1]);
        }
      }
      // Test: x == value
      else if (testCode.includes('==') && !testCode.includes('===')) {
        const parts = testCode.split('==');
        if (parts.length === 2) {
          const left = parts[0].trim();
          const right = parts[1].trim().replace(/;/g, '');
          const leftVal = extractedVars[left] !== undefined ? extractedVars[left] : left;
          const rightVal = eval(right);
          passed = leftVal == rightVal;
        }
      }
      // Test: callable(x)
      else if (testCode.includes('callable')) {
        const callableMatch = testCode.match(/callable\s*\(\s*(\w+)\s*\)/);
        if (callableMatch) {
          const varName = callableMatch[1];
          passed = extractedVars[varName]?.type === 'function';
        }
      }
      // Test: x in set/list/etc
      else if (testCode.includes(' in ')) {
        const inMatch = testCode.match(/'(\w+)'\s+in\s+(\w+)/);
        if (inMatch) {
          const element = inMatch[1];
          const collection = inMatch[2];
          if (Array.isArray(extractedVars[collection])) {
            passed = extractedVars[collection].includes(element);
          } else if (typeof extractedVars[collection] === 'string') {
            passed = extractedVars[collection].includes(element);
          }
        }
        const notInMatch = testCode.match(/'(\w+)'\s+not\s+in\s+(\w+)/);
        if (notInMatch) {
          const element = notInMatch[1];
          const collection = notInMatch[2];
          if (Array.isArray(extractedVars[collection])) {
            passed = !extractedVars[collection].includes(element);
          } else if (typeof extractedVars[collection] === 'string') {
            passed = !extractedVars[collection].includes(element);
          }
        }
      }
      // Test: len(x) == n
      else if (testCode.includes('len(')) {
        const lenMatch = testCode.match(/len\s*\(\s*(\w+)\s*\)\s*([=!<>]+)\s*(\d+)/);
        if (lenMatch) {
          const varName = lenMatch[1];
          const operator = lenMatch[2];
          const expected = parseInt(lenMatch[3]);
          const actual = extractedVars[varName]?.length ?? -1;
          if (operator === '==') passed = actual === expected;
          else if (operator === '>=') passed = actual >= expected;
          else if (operator === '<=') passed = actual <= expected;
          else if (operator === '>') passed = actual > expected;
          else if (operator === '<') passed = actual < expected;
        }
      }
      // Test: directamente evaluar la expresión
      else {
        // Crear un contexto con las variables extraídas
        const contextVars = Object.entries(extractedVars)
          .filter(([k]) => !['type', 'name'].includes(k))
          .map(([k, v]) => `${typeof v === 'string' ? 'var ' : 'var '}${k}=${JSON.stringify(v)}`)
          .join(';');
        
        try {
          const testFn = new Function(`${contextVars}; return (${testCode.replace(/;/g, '')});`);
          passed = Boolean(testFn());
        } catch {
          passed = false;
        }
      }
      
      results.push({
        description: test.description,
        passed: Boolean(passed),
        message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}`
      });
      
    } catch (e) {
      results.push({
        description: test.description,
        passed: false,
        message: `❌ Error: ${e.message}`
      });
    }
  }
  
  const allPassed = results.length > 0 && results.every(r => r.passed);
  
  return {
    success: allPassed,
    error: allPassed ? null : (results.find(r => !r.passed)?.message || 'Error en los tests'),
    logs,
    testResults: results
  };
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

export function analyzeCodeStructure(code) {
  return analyzePythonStructure(code);
}