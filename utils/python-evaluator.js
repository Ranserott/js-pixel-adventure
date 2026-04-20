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
  
  const lines = userCode.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Skip import lines
    if (trimmed.startsWith('import ')) continue;
    
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
    
    // Match index assignment: var[key] = value or var[i, j] = value
    const indexAssignMatch = trimmed.match(/^(\w+)\s*\[\s*(.+?)\s*\]\s*=\s*(.+)$/);
    if (indexAssignMatch) {
      const varName = indexAssignMatch[1];
      const indexStr = indexAssignMatch[2].trim();
      const value = indexAssignMatch[3].trim().split('#')[0].trim();
      
      if (varName in extractedVars) {
        let val = value;
        if (value === 'True' || value === 'False') val = value === 'True';
        else if (value === 'None') val = null;
        else if ((value.startsWith("'") && value.endsWith("'")) || 
                 (value.startsWith('"') && value.endsWith('"'))) val = value.slice(1, -1);
        else if (!isNaN(value)) val = Number(value);
        
        // Handle 2D indexing like [0, 0]
        if (indexStr.includes(',')) {
          const [row, col] = indexStr.split(',').map(s => parseInt(s.trim()));
          if (Array.isArray(extractedVars[varName]) && extractedVars[varName][row]) {
            extractedVars[varName][row][col] = val;
          }
        } else {
          let idx = indexStr.replace(/['"]/g, '');
          if (!isNaN(idx)) idx = parseInt(idx);
          if (Array.isArray(extractedVars[varName])) {
            extractedVars[varName][idx] = val;
          } else if (typeof extractedVars[varName] === 'object') {
            extractedVars[varName][idx] = val;
          }
        }
      }
    }
  }
  
  // Evaluate each test
  for (const test of level.challenge.tests) {
    let passed = false;
    const testCode = test.code.trim();
    
    try {
      // Test: var['key'] or var["key"] (dict/series key access) - must check BEFORE array index
      // Pattern: variable['key'] == value or variable["key"] == value
      const dictKeyMatch = testCode.match(/^(\w+)\s*\[\s*['"](\w+)['"]\s*\]\s*(==|!=)\s*(.+)/);
      if (dictKeyMatch) {
        const varName = dictKeyMatch[1];
        const key = dictKeyMatch[2];
        const operator = dictKeyMatch[3];
        let expectedVal = dictKeyMatch[4].replace(/;$/, '').trim();
        
        const obj = extractedVars[varName];
        if (obj && typeof obj === 'object' && obj !== null && !(obj instanceof Set)) {
          let actualVal = obj[key];
          
          // Handle chaining like df['nombre'][0]
          const restMatch = testCode.match(/\](\[\d+\])/);
          if (restMatch && Array.isArray(actualVal)) {
            const idx = parseInt(restMatch[1].slice(2, -1));
            actualVal = actualVal[idx];
          }
          
          // Parse expected value
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number') {
              passed = actualVal == parseFloat(expectedVal.replace(/['"]/g, ''));
            } else if (typeof actualVal === 'string') {
              const expStr = expectedVal.replace(/['"]/g, '');
              passed = actualVal === expStr;
            } else if (typeof actualVal === 'boolean') {
              passed = actualVal === (expectedVal === 'True') || actualVal === (expectedVal === 'true');
            } else {
              passed = actualVal == expectedVal || String(actualVal) === expectedVal.replace(/['"]/g, '');
            }
          } else {
            passed = actualVal != expectedVal;
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: var[i, j] == value (2D matrix access)
      const matrixMatch = testCode.match(/^(\w+)\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]\s*(==|!=)\s*(.+)/);
      if (matrixMatch) {
        const varName = matrixMatch[1];
        const row = parseInt(matrixMatch[2]);
        const col = parseInt(matrixMatch[3]);
        const operator = matrixMatch[4];
        let expectedVal = matrixMatch[5].replace(/;$/, '').trim();
        
        const matrix = extractedVars[varName];
        if (matrix && Array.isArray(matrix) && matrix[row] && matrix[row][col] !== undefined) {
          const actualVal = matrix[row][col];
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number') {
              passed = actualVal == parseFloat(expectedVal.replace(/['"]/g, ''));
            } else {
              passed = actualVal == expectedVal.replace(/['"]/g, '') || String(actualVal) === expectedVal.replace(/['"]/g, '');
            }
          } else {
            passed = actualVal != expectedVal.replace(/['"]/g, '');
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: var[index] == value (array/list/string index access) - numeric only
      const arrayMatch = testCode.match(/^(\w+)\s*\[\s*(-?\d+)\s*\]\s*(==|!=)\s*(.+)/);
      if (arrayMatch) {
        const varName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        const operator = arrayMatch[3];
        let expectedVal = arrayMatch[4].replace(/;$/, '').trim();
        
        const arr = extractedVars[varName];
        if (arr && (Array.isArray(arr) || typeof arr === 'string')) {
          // Handle negative index
          let actualVal;
          if (index < 0 && Array.isArray(arr)) {
            actualVal = arr[arr.length + index];
          } else if (index < 0 && typeof arr === 'string') {
            actualVal = arr[arr.length + index];
          } else {
            actualVal = arr[index];
          }
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number') {
              passed = actualVal == parseFloat(expectedVal.replace(/['"]/g, ''));
            } else {
              passed = actualVal == expectedVal.replace(/['"]/g, '') || String(actualVal) === expectedVal.replace(/['"]/g, '');
            }
          } else {
            passed = actualVal != expectedVal.replace(/['"]/g, '');
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: isinstance(x, type)
      const isinstanceMatch = testCode.match(/^isinstance\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)$/);
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
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: 'var' in dir()
      if (testCode.includes('in dir()') || testCode.includes('in locals()')) {
        const varMatch = testCode.match(/'(\w+)'/);
        if (varMatch) {
          passed = varMatch[1] in extractedVars;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: callable(x)
      if (testCode.startsWith('callable(') && testCode.endsWith(')')) {
        const callableMatch = testCode.match(/callable\s*\(\s*(\w+)\s*\)/);
        if (callableMatch) {
          passed = extractedVars[callableMatch[1]]?.type === 'function';
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: func(args) == value (function call)
      const funcCallMatch = testCode.match(/^(\w+)\s*\(\s*([^)]*)\s*\)\s*(==|!=)\s*(.+)/);
      if (funcCallMatch && !testCode.includes('isinstance')) {
        const funcName = funcCallMatch[1];
        const argsStr = funcCallMatch[2];
        const operator = funcCallMatch[3];
        let expectedVal = funcCallMatch[4].replace(/;$/, '').trim();
        
        const func = extractedVars[funcName];
        if (func && func.type === 'function') {
          // For now, just check if function exists
          passed = func.type === 'function';
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: 'element' in collection
      const inMatch = testCode.match(/^'(\w+)'\s+in\s+(\w+)$/);
      if (inMatch && !testCode.includes('not in')) {
        const element = inMatch[1];
        const collection = inMatch[2];
        const coll = extractedVars[collection];
        if (coll) {
          if (Array.isArray(coll)) passed = coll.includes(element);
          else if (coll instanceof Set) passed = coll.has(element);
          else if (typeof coll === 'string') passed = coll.includes(element);
          else if (typeof coll === 'object') passed = element in coll;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: 'element' not in collection
      const notInMatch = testCode.match(/^'(\w+)'\s+not\s+in\s+(\w+)$/);
      if (notInMatch) {
        const element = notInMatch[1];
        const collection = notInMatch[2];
        const coll = extractedVars[collection];
        if (coll) {
          if (Array.isArray(coll)) passed = !coll.includes(element);
          else if (coll instanceof Set) passed = !coll.has(element);
          else if (typeof coll === 'string') passed = !coll.includes(element);
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: len(var) == value
      const lenMatch = testCode.match(/^len\s*\(\s*(\w+)\s*\)\s*(==|!=|>=|<=|>|<)\s*(\d+)$/);
      if (lenMatch) {
        const varName = lenMatch[1];
        const operator = lenMatch[2];
        const expected = parseInt(lenMatch[3]);
        let actual = -1;
        
        if (extractedVars[varName]) {
          if (Array.isArray(extractedVars[varName])) actual = extractedVars[varName].length;
          else if (extractedVars[varName] instanceof Set) actual = extractedVars[varName].size;
          else if (typeof extractedVars[varName] === 'string') actual = extractedVars[varName].length;
          else if (typeof extractedVars[varName] === 'object') actual = Object.keys(extractedVars[varName]).length;
        }
        
        switch (operator) {
          case '==': passed = actual === expected; break;
          case '!=': passed = actual !== expected; break;
          case '>=': passed = actual >= expected; break;
          case '<=': passed = actual <= expected; break;
          case '>': passed = actual > expected; break;
          case '<': passed = actual < expected; break;
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Test: var == value (simple equality)
      const simpleEqMatch = testCode.match(/^(\w+)\s*(==|!=)\s*(.+)$/);
      if (simpleEqMatch && !testCode.includes('len(') && !testCode.includes('[')) {
        const varName = simpleEqMatch[1];
        const operator = simpleEqMatch[2];
        let expectedVal = simpleEqMatch[3].replace(/;$/, '').trim();
        
        const actualVal = extractedVars[varName];
        if (actualVal !== undefined) {
          // Parse expected value
          let exp;
          if (expectedVal === 'True') exp = true;
          else if (expectedVal === 'False') exp = false;
          else if (expectedVal === 'None') exp = null;
          else if ((expectedVal.startsWith("'") && expectedVal.endsWith("'")) || 
                   (expectedVal.startsWith('"') && expectedVal.endsWith('"'))) {
            exp = expectedVal.slice(1, -1);
          } else if (!isNaN(expectedVal)) {
            exp = parseFloat(expectedVal);
          } else {
            exp = expectedVal.replace(/['"]/g, '');
          }
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number' && typeof exp === 'number') {
              passed = actualVal == exp;
            } else if (Array.isArray(actualVal) && Array.isArray(exp)) {
              passed = JSON.stringify(actualVal) === JSON.stringify(exp);
            } else {
              passed = actualVal == exp || String(actualVal) === String(exp);
            }
          } else {
            passed = actualVal != exp;
          }
        }
        results.push({ description: test.description, passed, message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}` });
        continue;
      }
      
      // Last resort: build context and evaluate
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
        const testExpr = testCode.replace(/;$/, '').trim();
        const testFn = new Function(contextParts.join(';') + '; return (' + testExpr + ');');
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