/**
 * Evaluador para Python (simula validación en el cliente)
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
  
  // Parse Python code to extract variables
  const extractedVars = {};
  
  // Split by lines and process each
  const lines = userCode.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Match variable assignment: name = value
    const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      let value = assignMatch[2].trim();
      value = value.replace(/;$/, '').trim();
      value = value.split('#')[0].trim();
      
      if (value === 'True' || value === 'False') {
        extractedVars[varName] = value === 'True';
      } else if (value === 'None') {
        extractedVars[varName] = null;
      } else if ((value.startsWith('"') && value.endsWith('"')) || 
                 (value.startsWith("'") && value.endsWith("'"))) {
        extractedVars[varName] = value.slice(1, -1);
      } else if (value.startsWith('f"') || value.startsWith("f'") || value.startsWith('f"""')) {
        extractedVars[varName] = value.slice(value.indexOf('"') + 1, -1);
      } else if (value.startsWith('[') && value.endsWith(']')) {
        try {
          extractedVars[varName] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          extractedVars[varName] = value;
        }
      } else if (value.startsWith('{') && value.endsWith('}')) {
        if (value.includes(':')) {
          try {
            extractedVars[varName] = JSON.parse(value.replace(/'/g, '"'));
          } catch {
            extractedVars[varName] = value;
          }
        } else {
          try {
            const setItems = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
            extractedVars[varName] = new Set(setItems);
          } catch {
            extractedVars[varName] = value;
          }
        }
      } else if (!isNaN(value)) {
        extractedVars[varName] = Number(value);
      } else if (value.includes('+') || value.includes('*') || value.includes('-') || value.includes('/')) {
        try {
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
    const funcMatch = trimmed.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
      // Store function as a special object
      extractedVars[funcName] = { type: 'function', name: funcName, params };
    }
    
    // Match lambda assignment
    const lambdaMatch = trimmed.match(/^(\w+)\s*=\s*lambda\s+(.+)$/);
    if (lambdaMatch) {
      extractedVars[lambdaMatch[1]] = { type: 'function', name: lambdaMatch[1] };
    }
    
    // Match class definition
    const classMatch = trimmed.match(/^class\s+(\w+)/);
    if (classMatch) {
      extractedVars[classMatch[1]] = { type: 'class', name: classMatch[1] };
    }
  }
  
  // Evaluate each test
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
                            actualVal instanceof Set ? 'set' :
                            actualVal === null ? 'NoneType' :
                            typeof actualVal === 'object' && actualVal.type ? actualVal.type :
                            typeof actualVal;
          
          const typeMap = {
            'int': 'number', 'float': 'number', 'str': 'string', 'string': 'string',
            'bool': 'boolean', 'boolean': 'boolean', 'list': 'array', 'array': 'array',
            'dict': 'object', 'object': 'object', 'set': 'object', 'tuple': 'object'
          };
          
          const mappedExpected = typeMap[expectedType] || expectedType;
          passed = actualType === mappedExpected;
        }
        continue;
      }
      
      // Test: 'variable' in dir() or 'variable' in locals()
      if (testCode.includes('in dir()') || testCode.includes('in locals()')) {
        const varMatch = testCode.match(/'(\w+)'/);
        if (varMatch) {
          passed = varMatch[1] in extractedVars;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: callable(x)
      if (testCode.includes('callable')) {
        const callableMatch = testCode.match(/callable\s*\(\s*(\w+)\s*\)/);
        if (callableMatch) {
          passed = extractedVars[callableMatch[1]]?.type === 'function';
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: x in y (element in collection)
      if (testCode.includes(' in ') && !testCode.includes('not in')) {
        const inMatch = testCode.match(/'(\w+)'\s+in\s+(\w+)/);
        if (inMatch) {
          const element = inMatch[1];
          const collection = inMatch[2];
          const coll = extractedVars[collection];
          if (Array.isArray(coll)) passed = coll.includes(element);
          else if (coll instanceof Set) passed = coll.has(element);
          else if (typeof coll === 'string') passed = coll.includes(element);
          else if (typeof coll === 'object') passed = element in coll;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: x not in y
      if (testCode.includes('not in')) {
        const notInMatch = testCode.match(/'(\w+)'\s+not\s+in\s+(\w+)/);
        if (notInMatch) {
          const element = notInMatch[1];
          const collection = notInMatch[2];
          const coll = extractedVars[collection];
          if (Array.isArray(coll)) passed = !coll.includes(element);
          else if (coll instanceof Set) passed = !coll.has(element);
          else if (typeof coll === 'string') passed = !coll.includes(element);
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: len(x) == n or len(x) >= n
      if (testCode.includes('len(')) {
        const lenMatch = testCode.match(/len\s*\(\s*(\w+)\s*\)\s*([=!<>]+)\s*(\d+)/);
        if (lenMatch) {
          const varName = lenMatch[1];
          const operator = lenMatch[2];
          const expected = parseInt(lenMatch[3]);
          let actual = -1;
          
          if (Array.isArray(extractedVars[varName])) actual = extractedVars[varName].length;
          else if (extractedVars[varName] instanceof Set) actual = extractedVars[varName].size;
          else if (typeof extractedVars[varName] === 'string') actual = extractedVars[varName].length;
          else if (typeof extractedVars[varName] === 'object') actual = Object.keys(extractedVars[varName]).length;
          
          if (operator === '==') passed = actual === expected;
          else if (operator === '>=') passed = actual >= expected;
          else if (operator === '<=') passed = actual <= expected;
          else if (operator === '>') passed = actual > expected;
          else if (operator === '<') passed = actual < expected;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: collection[-1] == value (negative index access)
      const negIndexMatch = testCode.match(/(\w+)\s*\[\s*(-?\d+)\s*\]\s*([=!]+)\s*(.+)/);
      if (negIndexMatch && parseInt(negIndexMatch[2]) < 0) {
        const collName = negIndexMatch[1];
        const index = parseInt(negIndexMatch[2]);
        const operator = negIndexMatch[3];
        const expectedVal = negIndexMatch[4].replace(/;$/, '').trim().replace(/['"]/g, '');
        
        const coll = extractedVars[collName];
        if (Array.isArray(coll) || typeof coll === 'string') {
          const actualVal = coll[index];
          if (operator === '==') passed = actualVal == expectedVal || String(actualVal) === expectedVal;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: x == value (simple equality)
      if (testCode.includes('==') && !testCode.includes('===')) {
        const parts = testCode.split('==');
        if (parts.length === 2) {
          const left = parts[0].trim();
          let right = parts[1].trim().replace(/;$/, '').trim();
          
          // Get left value
          let leftVal;
          if (left in extractedVars) {
            leftVal = extractedVars[left];
          } else if (left === 'True') leftVal = true;
          else if (left === 'False') leftVal = false;
          else if (left === 'None') leftVal = null;
          else if (!isNaN(left)) leftVal = Number(left);
          else leftVal = left.replace(/['"]/g, '');
          
          // Get right value
          let rightVal;
          if (right === 'True') rightVal = true;
          else if (right === 'False') rightVal = false;
          else if (right === 'None') rightVal = null;
          else if ((right.startsWith("'") && right.endsWith("'")) || 
                   (right.startsWith('"') && right.endsWith('"'))) {
            rightVal = right.slice(1, -1);
          } else if (!isNaN(right)) {
            rightVal = Number(right);
          } else if (right in extractedVars) {
            rightVal = extractedVars[right];
          } else {
            rightVal = right.replace(/['"]/g, '');
          }
          
          // Compare
          if (Array.isArray(leftVal) && Array.isArray(rightVal)) {
            passed = JSON.stringify(leftVal) === JSON.stringify(rightVal);
          } else {
            passed = leftVal == rightVal;
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: dict['key'] access
      const dictAccessMatch = testCode.match(/(\w+)\s*\[\s*['"](\w+)['"]\s*\]\s*([=!]+)\s*(.+)/);
      if (dictAccessMatch) {
        const dictName = dictAccessMatch[1];
        const key = dictAccessMatch[2];
        const operator = dictAccessMatch[3];
        let expectedVal = dictAccessMatch[4].replace(/;$/, '').trim().replace(/['"]/g, '');
        
        const dict = extractedVars[dictName];
        if (dict && typeof dict === 'object' && !Array.isArray(dict)) {
          const actualVal = dict[key];
          if (operator === '==' || operator === '===') {
            passed = actualVal == expectedVal || String(actualVal) === expectedVal;
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Fallback: try to evaluate directly
      const contextParts = Object.entries(extractedVars)
        .filter(([k]) => !['type', 'name', 'params'].includes(k))
        .map(([k, v]) => {
          if (v === null) return `var ${k}=null`;
          if (typeof v === 'boolean') return `var ${k}=${v}`;
          if (typeof v === 'number') return `var ${k}=${v}`;
          if (typeof v === 'string') return `var ${k}="${v.replace(/"/g, '\\"')}"`;
          if (Array.isArray(v)) return `var ${k}=${JSON.stringify(v)}`;
          if (v instanceof Set) return `var ${k}=Array.from(${JSON.stringify([...v])})`;
          if (typeof v === 'object') return `var ${k}=${JSON.stringify(v)}`;
          return `var ${k}="${String(v)}"`;
        });
      
      try {
        const testFn = new Function(contextParts.join(';') + '; return (' + testCode.replace(/;/g, '') + ');');
        passed = Boolean(testFn());
      } catch (e) {
        passed = false;
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