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
  
  // Parse Python code - two pass system
  // Pass 1: collect all variable assignments as strings
  // Pass 2: evaluate expressions using all known variables
  
  const varExpressions = {};
  const lines = userCode.split('\n');
  
  // Pass 1: collect all variable assignments
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
      
      varExpressions[varName] = value;
    }
    
    // Match function definition
    const funcMatch = trimmed.match(/^def\s+(\w+)\s*\(([^)]*)\)\s*:/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
      varExpressions[funcName] = { type: 'function', name: funcName, params };
    }
    
    // Match lambda assignment
    const lambdaMatch = trimmed.match(/^(\w+)\s*=\s*lambda\s+(.+)$/);
    if (lambdaMatch) {
      varExpressions[lambdaMatch[1]] = { type: 'function', name: lambdaMatch[1] };
    }
    
    // Match class definition
    const classMatch = trimmed.match(/^class\s+(\w+)/);
    if (classMatch) {
      varExpressions[classMatch[1]] = { type: 'class', name: classMatch[1] };
    }
  }
  
  // Helper function to evaluate an expression with all variables available
  function evaluateExpr(expr, knownVars) {
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;
    
    // String literal
    if ((expr.startsWith('"') && expr.endsWith('"')) || 
        (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // f-string (take raw value for now)
    if (expr.startsWith('f"') || expr.startsWith("f'") || expr.startsWith('f"""')) {
      return expr.slice(expr.indexOf('"') + 1, -1);
    }
    
    // List
    if (expr.startsWith('[') && expr.endsWith(']')) {
      try {
        return JSON.parse(expr.replace(/'/g, '"'));
      } catch {
        return expr;
      }
    }
    
    // Dict
    if (expr.startsWith('{') && expr.endsWith('}')) {
      if (expr.includes(':')) {
        try {
          return JSON.parse(expr.replace(/'/g, '"'));
        } catch {
          return expr;
        }
      } else {
        // Set
        try {
          const setItems = expr.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
          return new Set(setItems);
        } catch {
          return expr;
        }
      }
    }
    
    // Number
    if (!isNaN(expr)) {
      return parseFloat(expr);
    }
    
    // Expression with operators - try to evaluate with known variables
    if (expr.includes('+') || expr.includes('*') || expr.includes('-') || expr.includes('/')) {
      let evalExpr = expr;
      const varRefs = evalExpr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      const uniqueVars = [...new Set(varRefs)];
      
      // Replace each variable with its value
      let canEvaluate = true;
      for (const v of uniqueVars) {
        if (v in knownVars && typeof knownVars[v] !== 'object') {
          const replacement = typeof knownVars[v] === 'string' 
            ? `"${knownVars[v]}"` 
            : String(knownVars[v]);
          evalExpr = evalExpr.replace(new RegExp('\\b' + v + '\\b', 'g'), replacement);
        } else if (v === 'True' || v === 'False' || v === 'None') {
          // These are keywords, not variables
        } else {
          canEvaluate = false;
          break;
        }
      }
      
      if (canEvaluate) {
        // Validate the expression is safe (no remaining letters except keywords)
        const safeCheck = evalExpr.replace(/[\d\s\.\+\*\/\-\(\)\"\']+/g, '');
        const keywordsOk = safeCheck.replace(/\b(True|False|None)\b/g, '') === '';
        if (keywordsOk) {
          try {
            return Function('"use strict"; return (' + evalExpr + ')')();
          } catch {
            return expr;
          }
        }
      }
    }
    
    // If it's a variable reference, return the variable value
    if (expr in knownVars) {
      return knownVars[expr];
    }
    
    return expr;
  }
  
  // Pass 2: evaluate all expressions with two passes to handle dependencies
  const extractedVars = {};
  
  // Multiple passes until no changes (handles chained dependencies)
  let changed = true;
  let iterations = 0;
  const maxIterations = 10;
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    
    for (const [varName, expr] of Object.entries(varExpressions)) {
      // Skip if already processed as non-expression
      if (extractedVars[varName] !== undefined && typeof extractedVars[varName] !== 'string') {
        continue;
      }
      
      const result = evaluateExpr(expr, extractedVars);
      
      // Only update if we got a better result (not just the string expr)
      if (result !== expr || typeof extractedVars[varName] === 'undefined') {
        if (typeof result !== 'string' || 
            (result !== expr && !result.includes('+' && result.includes('*'))) ||
            typeof extractedVars[varName] === 'undefined') {
          extractedVars[varName] = result;
          changed = true;
        } else if (typeof expr === 'string' && expr in extractedVars) {
          extractedVars[varName] = extractedVars[expr];
          changed = true;
        }
      }
    }
  }
  
  // Handle index assignments (e.g., df['col'] = value)
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Match index assignment: var[key] = value or var[i, j] = value
    const indexAssignMatch = trimmed.match(/^(\w+)\s*\[\s*(.+?)\s*\]\s*=\s*(.+)$/);
    if (indexAssignMatch) {
      const varName = indexAssignMatch[1];
      const indexStr = indexAssignMatch[2].trim();
      const value = indexAssignMatch[3].trim().split('#')[0].trim();
      
      if (varName in extractedVars) {
        let val = evaluateExpr(value, extractedVars);
        
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
      // Test: var['key'] or var["key"] (dict/series key access)
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
          
          const exp = evaluateExpr(expectedVal, extractedVars);
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number' && typeof exp === 'number') {
              passed = actualVal == exp;
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
          const exp = evaluateExpr(expectedVal, extractedVars);
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number' && typeof exp === 'number') {
              passed = actualVal == exp;
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
      
      // Test: var[index] == value (array/list/string index access)
      const arrayMatch = testCode.match(/^(\w+)\s*\[\s*(-?\d+)\s*\]\s*(==|!=)\s*(.+)/);
      if (arrayMatch) {
        const varName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        const operator = arrayMatch[3];
        let expectedVal = arrayMatch[4].replace(/;$/, '').trim();
        
        const arr = extractedVars[varName];
        if (arr && (Array.isArray(arr) || typeof arr === 'string')) {
          let actualVal;
          if (index < 0 && Array.isArray(arr)) {
            actualVal = arr[arr.length + index];
          } else if (index < 0 && typeof arr === 'string') {
            actualVal = arr[arr.length + index];
          } else {
            actualVal = arr[index];
          }
          
          const exp = evaluateExpr(expectedVal, extractedVars);
          
          if (operator === '==' || operator === '===') {
            if (typeof actualVal === 'number' && typeof exp === 'number') {
              passed = actualVal == exp;
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
      
      // Test: func(args) == value
      const funcCallMatch = testCode.match(/^(\w+)\s*\(\s*([^)]*)\s*\)\s*(==|!=)\s*(.+)/);
      if (funcCallMatch && !testCode.includes('isinstance')) {
        const funcName = funcCallMatch[1];
        const func = extractedVars[funcName];
        if (func && func.type === 'function') {
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
          const exp = evaluateExpr(expectedVal, extractedVars);
          
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