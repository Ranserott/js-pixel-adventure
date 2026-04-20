/**
 * Evaluador simple para Python (simula validación en el cliente)
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
  
  // Debug log for development
  console.log('runPythonCode called with code:', userCode);
  console.log('Tests:', level.challenge.tests);
  
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
  const extractedVars = {};
  
  // Split by lines and process each
  const lines = userCode.split('\n');
  
  for (const line of lines) {
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Match variable assignment: name = value
    // Handle both simple and complex values
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      let value = assignMatch[2].trim();
      
      // Remove trailing semicolon if present
      value = value.replace(/;$/, '').trim();
      
      // Remove inline comments
      value = value.split('#')[0].trim();
      
      // Process different types of values
      if (value === 'True' || value === 'False') {
        extractedVars[varName] = value === 'True';
      } else if (value === 'None') {
        extractedVars[varName] = null;
      } else if ((value.startsWith('"') && value.endsWith('"')) || 
                 (value.startsWith("'") && value.endsWith("'"))) {
        // String - remove quotes
        extractedVars[varName] = value.slice(1, -1);
      } else if (value.startsWith('f"') || value.startsWith("f'")) {
        // f-string - remove f and quotes
        extractedVars[varName] = value.slice(2, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // List
        try {
          extractedVars[varName] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          extractedVars[varName] = value;
        }
      } else if (value.startsWith('{') && value.endsWith('}')) {
        // Dict or Set
        try {
          extractedVars[varName] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          extractedVars[varName] = value;
        }
      } else if (!isNaN(value)) {
        // Number
        extractedVars[varName] = Number(value);
      } else if (value.includes('+') || value.includes('*') || value.includes('-')) {
        // Expression - try to evaluate
        try {
          // Simple numeric expressions
          const expr = value.replace(/\s/g, '');
          if (/^[\d\.\+\*\/\-\(\)]+$/.test(expr)) {
            extractedVars[varName] = Function('"use strict"; return (' + value + ')')();
          } else {
            extractedVars[varName] = value;
          }
        } catch {
          extractedVars[varName] = value;
        }
      } else {
        extractedVars[varName] = value;
      }
    }
    
    // Match function definition
    const funcMatch = trimmed.match(/^def\s+(\w+)\s*\(/);
    if (funcMatch) {
      extractedVars[funcMatch[1]] = { type: 'function', name: funcMatch[1] };
    }
    
    // Match class definition
    const classMatch = trimmed.match(/^class\s+(\w+)/);
    if (classMatch) {
      extractedVars[classMatch[1]] = { type: 'class', name: classMatch[1] };
    }
    
    // Match lambda
    const lambdaMatch = trimmed.match(/^(\w+)\s*=\s*lambda\s+/);
    if (lambdaMatch) {
      extractedVars[lambdaMatch[1]] = { type: 'function', name: lambdaMatch[1] };
    }
  }
  
  // Now evaluate each test
  for (const test of level.challenge.tests) {
    let passed = false;
    const testCode = test.code.trim();
    
    try {
      // Test: isinstance(x, str/int/float/bool/list/dict/set/tuple)
      const isinstanceMatch = testCode.match(/isinstance\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/);
      if (isinstanceMatch) {
        const varName = isinstanceMatch[1];
        const expectedType = isinstanceMatch[2];
        const actualVal = extractedVars[varName];
        
        if (actualVal !== undefined) {
          const actualType = Array.isArray(actualVal) ? 'list' :
                            actualVal === null ? 'NoneType' :
                            typeof actualVal === 'object' ? (actualVal.type || 'dict') :
                            typeof actualVal;
          
          passed = (expectedType === 'int' && actualType === 'number') ||
                   (expectedType === 'str' && actualType === 'string') ||
                   actualType === expectedType;
        }
      }
      // Test: 'variable' in dir() or 'variable' in locals()
      else if (testCode.includes('in dir()') || testCode.includes('in locals()')) {
        const varMatch = testCode.match(/'(\w+)'/);
        if (varMatch) {
          passed = varMatch[1] in extractedVars;
        }
      }
      // Test: x == value (strict equality for Python)
      else if (testCode.includes('==') && !testCode.includes('===')) {
        const parts = testCode.split('==');
        if (parts.length === 2) {
          const left = parts[0].trim();
          const right = parts[1].trim().replace(/;$/, '').trim();
          
          // Get left value
          let leftVal;
          if (left in extractedVars) {
            leftVal = extractedVars[left];
          } else if (left === 'True' || left === 'False' || left === 'None') {
            leftVal = left === 'True' ? true : left === 'False' ? false : null;
          } else if (!isNaN(left)) {
            leftVal = Number(left);
          } else {
            leftVal = left.replace(/['"]/g, '');
          }
          
          // Get right value - handle different types
          let rightVal;
          if (right === 'True' || right === 'False' || right === 'None') {
            rightVal = right === 'True' ? true : right === 'False' ? false : null;
          } else if (right.startsWith("'") || right.startsWith('"')) {
            rightVal = right.slice(1, -1);
          } else if (!isNaN(right)) {
            rightVal = Number(right);
          } else if (right in extractedVars) {
            rightVal = extractedVars[right];
          } else {
            rightVal = right.replace(/['"]/g, '');
          }
          
          // Compare
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
      // Test: x in y
      else if (testCode.includes(' in ') && !testCode.includes('not in')) {
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
      }
      // Test: x not in y
      else if (testCode.includes('not in')) {
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
      // Test: directly evaluate the expression
      else {
        // Create context with extracted variables
        const contextParts = Object.entries(extractedVars)
          .filter(([k]) => !['type', 'name'].includes(k))
          .map(([k, v]) => {
            if (typeof v === 'string') return `var ${k}="${v.replace(/"/g, '\\"')}"`;
            if (v === null) return `var ${k}=null`;
            if (typeof v === 'boolean') return `var ${k}=${v}`;
            if (typeof v === 'number') return `var ${k}=${v}`;
            if (Array.isArray(v)) return `var ${k}=${JSON.stringify(v)}`;
            return `var ${k}="${String(v).replace(/"/g, '\\"')}"`;
          });
        
        try {
          const testFn = new Function(contextParts.join(';') + '; return (' + testCode.replace(/;/g, '') + ');');
          passed = Boolean(testFn());
        } catch (e) {
          passed = false;
        }
      }
      
    } catch (e) {
      passed = false;
    }
    
    results.push({
      description: test.description,
      passed: Boolean(passed),
      message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}`
    });
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