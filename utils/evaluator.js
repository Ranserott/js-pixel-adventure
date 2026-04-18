/**
 * Motor de evaluación mejorado - Validación estricta por nivel
 */

import { createSafeContext, executeCode } from './sandbox.js';

/**
 * Analiza estructura del código y valida según el nivel específico
 */
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  
  // Limpiar código
  const cleanCode = code.trim();
  
  // Detectar patrones usados
  const detected = {
    // Variables
    hasVariableLet: /\blet\s+\w+/.test(cleanCode),
    hasVariableConst: /\bconst\s+\w+/.test(cleanCode),
    hasVariableAssignment: /\w+\s*=\s*\d+/.test(cleanCode),
    
    // Control flow
    hasForLoop: /\bfor\s*\(/.test(cleanCode),
    hasWhileLoop: /\bwhile\s*\(/.test(cleanCode),
    hasIfCondition: /\bif\s*\(/.test(cleanCode),
    hasElseCondition: /\belse\b/.test(cleanCode),
    
    // Funciones
    hasFunctionDeclaration: /\bfunction\s+\w+\s*\(/.test(cleanCode),
    hasFunctionCall: /\w+\s*\(\s*\)/.test(cleanCode),
    hasFunctionCallWithArg: /\w+\s*\(\s*[\w\d]+\s*\)/.test(cleanCode),
    
    // Outputs
    hasMove: /\bmove\s*\(/.test(cleanCode),
    hasConsoleLog: /console\.log\s*\(/.test(cleanCode),
    hasSay: /\bsay\s*\(/.test(cleanCode),
    
    // Comparaciones
    hasComparison: /[<>!=]=?|===?|!==/.test(cleanCode),
    hasComparisonTrue: /true|false/.test(cleanCode),
    
    // Parámetros de función
    hasFunctionParam: /\bfunction\s+\w+\s*\(\s*\w+\s*\)/.test(cleanCode),
    hasParamUsage: /\bfunction\s+\w+\s*\(\s*(\w+)\s*\)/.test(cleanCode),
    
    // Incremento/decremento
    hasIncrement: /\+\+|--/.test(cleanCode),
    hasCompoundAssign: /[\+\-\*\/]=/.test(cleanCode),
  };
  
  // Validación por nivel
  switch (level.id) {
    case 1: // move() básico
      if (!detected.hasMove) {
        issues.push('💡 Usa la función move() para mover al personaje');
      }
      // Verificar que move tiene argumento
      const moveMatch = cleanCode.match(/move\s*\(\s*(\d+)\s*\)/);
      if (!moveMatch) {
        issues.push('⚠️ move() necesita un número. Ejemplo: move(3)');
      } else if (parseInt(moveMatch[1]) !== level.expectedState.position) {
        issues.push(`⚠️ move() debe recibir exactamente ${level.expectedState.position} como argumento`);
      }
      break;
      
    case 2: // Variables let
      if (!detected.hasVariableLet) {
        issues.push('💡 Declara una variable con "let". Ejemplo: let pasos = 5;');
      }
      if (!detected.hasMove) {
        issues.push('💡 Usa move() para moverte');
      }
      // Verificar que la variable se usa
      if (detected.hasVariableLet && !detected.hasVariableAssignment) {
        issues.push('⚠️ La variable necesita un valor. Ejemplo: let pasos = 5;');
      }
      break;
      
    case 3: // Variables const
      if (!detected.hasVariableConst) {
        issues.push('💡 Usa "const" para valores que no cambian. Ejemplo: const pasos = 4;');
      } else if (!detected.hasVariableAssignment) {
        issues.push('⚠️ La constante necesita un valor. Ejemplo: const pasos = 4;');
      }
      if (!detected.hasMove) {
        issues.push('💡 Usa move() para moverte');
      }
      break;
      
    case 4: // Condicional if
      if (!detected.hasIfCondition) {
        issues.push('💡 Usa un condicional "if" para verificar una condición');
      }
      if (!detected.hasComparison) {
        issues.push('💡 Compara valores usando >, <, >=, <=, ===, o !==');
      }
      if (detected.hasIfCondition && !cleanCode.includes('{')) {
        issues.push('⚠️ El if necesita llaves { } para el bloque de código');
      }
      break;
      
    case 5: // Bucle for
      if (!detected.hasForLoop) {
        issues.push('💡 Usa un bucle "for" para repetir. Ejemplo: for (let i = 0; i < 5; i++) { }');
      }
      if (detected.hasForLoop) {
        // Verificar que el for tiene { }
        if (!cleanCode.match(/for\s*\([^)]+\)\s*\{/)) {
          issues.push('⚠️ El for necesita llaves { } para el bloque de código');
        }
        // Verificar que move está dentro del for
        const forBlock = cleanCode.match(/for\s*\([^)]+\)\s*\{([^}]+)\}/);
        if (forBlock && !forBlock[1].includes('move')) {
          issues.push('💡 El bucle debe contener move() para avanzar');
        }
      }
      break;
      
    case 6: // console.log
      if (!detected.hasConsoleLog) {
        issues.push('💡 Usa console.log() para mostrar mensajes');
      } else {
        // Verificar el mensaje exacto
        const logMatch = cleanCode.match(/console\.log\s*\(\s*["']([^"']+)["']\s*\)/);
        if (!logMatch) {
          issues.push('⚠️ El mensaje debe ir entre comillas. Ejemplo: console.log("texto")');
        } else if (logMatch[1] !== '¡Hola, rey!') {
          issues.push('⚠️ El mensaje debe ser exactamente: "¡Hola, rey!"');
        }
      }
      break;
      
    case 7: // Bucle while
      if (!detected.hasWhileLoop) {
        issues.push('💡 Usa un bucle "while" para repetir mientras la condición sea verdadera');
      }
      if (detected.hasWhileLoop && !cleanCode.match(/while\s*\([^)]+\)\s*\{/)) {
        issues.push('⚠️ El while necesita llaves { } para el bloque de código');
      }
      // Verificar que hay incremento dentro del while
      if (detected.hasWhileLoop) {
        const whileBlock = cleanCode.match(/while\s*\([^)]+\)\s*\{([^}]+)\}/);
        if (whileBlock && !whileBlock[1].match(/\+\+|Worklet|=\s*\w+\s*\+/)) {
          warnings.push('⚠️ Asegúrate de aumentar el contador dentro del while para no crear un loop infinito');
        }
      }
      break;
      
    case 8: // Funciones
      if (!detected.hasFunctionDeclaration) {
        issues.push('💡 Crea una función con "function". Ejemplo: function avanzar() { }');
      }
      if (detected.hasFunctionDeclaration && !cleanCode.match(/function\s+\w+\s*\(\s*\)\s*\{/)) {
        issues.push('⚠️ La función no debe tener parámetros para este nivel');
      }
      if (!detected.hasFunctionCall) {
        issues.push('💡 Llama la función después de crearla');
      }
      // Verificar que move está en la función
      const funcBlock = cleanCode.match(/function\s+\w+\s*\([^)]*\)\s*\{([^}]+)\}/);
      if (funcBlock && !funcBlock[1].includes('move')) {
        issues.push('⚠️ La función debe contener move()');
      }
      break;
      
    case 9: // Parámetros
      if (!detected.hasFunctionParam) {
        issues.push('💡 La función debe tener un parámetro. Ejemplo: function mover(pasos) { }');
      }
      if (detected.hasFunctionParam) {
        // Verificar que el parámetro se usa en move
        const paramMatch = cleanCode.match(/function\s+\w+\s*\(\s*(\w+)\s*\)/);
        if (paramMatch && !cleanCode.includes(`move(${paramMatch[1]})`) && !cleanCode.includes(`move( ${paramMatch[1]} )`)) {
          issues.push('⚠️ Usa el parámetro dentro de move(). Ejemplo: move(pasos)');
        }
        // Verificar que se llama con argumento
        if (!detected.hasFunctionCallWithArg) {
          issues.push('⚠️ Llama la función con un argumento. Ejemplo: mover(3)');
        }
      }
      break;
      
    case 10: // Combinación - TODO
      if (!detected.hasVariableLet && !detected.hasVariableConst) {
        issues.push('💡 Declara una variable para guardar el número de pasos');
      }
      if (!detected.hasFunctionDeclaration) {
        issues.push('💡 Crea una función que ejecute move(1)');
      }
      if (!detected.hasForLoop && !detected.hasWhileLoop) {
        issues.push('💡 Usa un bucle (for o while) para repetir');
      }
      if (detected.hasForLoop || detected.hasWhileLoop) {
        // Verificar que se usa la variable en el loop
        const varInLoop = cleanCode.match(/\b(for|while)\s*\([^)]*\b(\w+)\b[^)]*\)/);
        if (varInLoop && !cleanCode.includes(varInLoop[2])) {
          issues.push('⚠️ Asegúrate de usar la variable en el bucle');
        }
      }
      break;
  }
  
  // Errores comunes de sintaxis
  if (cleanCode.match(/^move\s*\(\s*\)/)) {
    issues.push('⚠️ move() necesita un número. Ejemplo: move(3)');
  }
  
  if (cleanCode.match(/let\s+\w+\s*;/) || cleanCode.match(/const\s+\w+\s*;/)) {
    issues.push('⚠️ La variable necesita un valor. Ejemplo: let x = 5;');
  }
  
  return { issues, warnings, detected };
}

/**
 * Ejecuta código y retorna resultado completo
 */
export function runCode(code, level, onProgress) {
  const { state: initialState, safeFunctions, safeConsole } = createSafeContext(level.startPosition);
  
  const executionLog = [];
  
  // Wrapper para trackear
  const trackedMove = (steps) => {
    safeFunctions.move(steps);
    executionLog.push({ type: 'move', steps, position: initialState.position });
    if (onProgress) onProgress({ type: 'move', steps, position: initialState.position });
  };
  
  const trackedSay = (text) => {
    safeFunctions.say(text);
    executionLog.push({ type: 'say', text });
    if (onProgress) onProgress({ type: 'say', text });
  };
  
  const trackedConsole = {
    log: (...args) => {
      const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      safeConsole.log(text);
      executionLog.push({ type: 'console', text });
      if (onProgress) onProgress({ type: 'console', text });
    }
  };

  // Ejecutar
  const result = executeCode(code, { move: trackedMove, say: trackedSay }, trackedConsole, initialState);
  
  // Análisis de estructura
  const analysis = analyzeCodeStructure(code, level);
  
  // Validar resultado
  const resultErrors = [];
  for (const [key, expected] of Object.entries(level.expectedState)) {
    const actual = result.state[key];
    if (actual === undefined) {
      resultErrors.push(`No completaste el objetivo: ${key}`);
    } else if (actual !== expected) {
      if (key === 'position') {
        resultErrors.push(`Posición final: ${actual}. Debería ser: ${expected}`);
      } else {
        resultErrors.push(`Error en "${key}": obtenido ${actual}, esperado ${expected}`);
      }
    }
  }
  
  return {
    ...result,
    validation: {
      isValid: resultErrors.length === 0 && analysis.issues.length === 0,
      errors: [...resultErrors, ...analysis.issues],
      warnings: analysis.warnings,
      codeAnalysis: analysis
    },
    executionLog,
    finalPosition: result.state.position,
    consoleOutput: result.state.consoleOutput
  };
}

/**
 * Mensaje de error amigable
 */
export function getFriendlyError(errorMessage) {
  const errors = {
    'move() requires a number': '🔢 move() necesita un número. Ejemplo: move(3)',
    'move() does not accept negative numbers': '⬇️ No uses números negativos',
    'move() cannot move more than 100 steps at once': '🦘 Máximo 100 pasos por vez',
    'say() requires text': '💬 say() necesita texto entre comillas',
    'is not defined': '❓ Variable no definida. ¿Escribiste bien el nombre?',
    'Unexpected end of input': '📝 Falta cerrar algo. Revisa: ) }',
    'Unexpected token': '📝 Error de sintaxis. Revisa paréntesis y llaves',
    'Missing semicolon': '🔚 Falta punto y coma ;',
  };
  
  for (const [pattern, msg] of Object.entries(errors)) {
    if (errorMessage.includes(pattern)) return msg;
  }
  
  if (errorMessage.includes('Unexpected')) return '📝 Error de sintaxis';
  if (errorMessage.includes('not defined')) return '❓ Algo no está definido';
  
  return `❌ ${errorMessage.substring(0, 80)}`;
}

/**
 * Hint por nivel
 */
export function getLevelHint(level) {
  const hints = {
    1: 'La función move(n) mueve n pasos. Para este nivel: move(3)',
    2: 'Usa let para declarar variable: let pasos = 5; luego move(pasos);',
    3: 'Usa const para valor fijo: const pasos = 4; move(pasos);',
    4: 'If verifica condición: if (x > 5) { move(3); }',
    5: 'For repite código: for (let i = 0; i < 5; i++) { move(1); }',
    6: 'console.log muestra texto: console.log("¡Hola, rey!");',
    7: 'While repite mientras: let i=0; while(i<4){ move(1); i++; }',
    8: 'Crea función: function avanzar(){ move(2); } avanzar();',
    9: 'Función con parámetro: function mover(pasos){ move(pasos); } mover(3);',
    10: 'Combina todo: let pasos=4; function atacar(){ move(1); } for(let i=0;i<pasos;i++){ atacar(); }'
  };
  return hints[level.id] || level.hint;
}
