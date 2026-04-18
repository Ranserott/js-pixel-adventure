/**
 * Motor de evaluación mejorado para JS Pixel Adventure
 * Valida tanto el código como el resultado
 */

import { createSafeContext, executeCode } from './sandbox.js';

/**
 * Analiza el código del usuario para verificar que usó los conceptos correctos
 */
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const detected = {
    hasVariableLet: /\blet\s+\w+\s*=/.test(code),
    hasVariableConst: /\bconst\s+\w+\s*=/.test(code),
    hasForLoop: /\bfor\s*\(/.test(code),
    hasWhileLoop: /\bwhile\s*\(/.test(code),
    hasIfCondition: /\bif\s*\(/.test(code),
    hasFunction: /\bfunction\s+\w+/.test(code),
    hasFunctionCall: /\w+\s*\(/, // Any function call
    hasMove: /\bmove\s*\(/.test(code),
    hasConsoleLog: /console\.log\s*\(/.test(code),
    hasSay: /\bsay\s*\(/.test(code),
    hasParameter: /function\s+\w+\s*\(\s*\w+\s*\)/.test(code), // function with param
  };

  // Verificar requisitos específicos del nivel
  const concept = level.concept.toLowerCase();

  // Nivel 2: Variables let
  if (concept.includes('let')) {
    if (!detected.hasVariableLet) {
      issues.push('💡 Este nivel enseña variables con "let". Declara una variable con: let nombre = valor');
    }
  }

  // Nivel 3: Variables const
  if (concept.includes('const')) {
    if (!detected.hasVariableConst) {
      issues.push('💡 Este nivel enseña variables con "const". Declara una constante con: const nombre = valor');
    }
  }

  // Nivel 4: Condicional if
  if (concept.includes('if') || concept.includes('condicional')) {
    if (!detected.hasIfCondition) {
      issues.push('💡 Usa un condicional "if" para verificar si una condición es verdadera');
    }
  }

  // Nivel 5: Bucle for
  if (concept.includes('for') || concept.includes('bucle')) {
    if (!detected.hasForLoop) {
      issues.push('💡 Usa un bucle "for" para repetir acciones: for (let i = 0; i < n; i++) { }');
    }
  }

  // Nivel 6: console.log
  if (concept.includes('console') || concept.includes('mensaje')) {
    if (!detected.hasConsoleLog) {
      issues.push('💡 Usa console.log() para mostrar el mensaje. Ejemplo: console.log("tu mensaje")');
    }
  }

  // Nivel 7: Bucle while
  if (concept.includes('while')) {
    if (!detected.hasWhileLoop) {
      issues.push('💡 Usa un bucle "while" para repetir mientras la condición sea verdadera');
    }
  }

  // Nivel 8: Funciones
  if (concept.includes('función') && !concept.includes('parámetro')) {
    if (!detected.hasFunction) {
      issues.push('💡 Crea una función con "function nombre() { }" y luego llámala con nombre()');
    }
  }

  // Nivel 9: Parámetros
  if (concept.includes('parámetro')) {
    if (!detected.hasParameter) {
      issues.push('💡 Crea una función con parámetro: function nombre(param) { move(param); }');
    }
  }

  // Nivel 10: Combinación - necesita variable, función y loop
  if (concept.includes('combina') || concept.includes('reto final')) {
    const missing = [];
    if (!detected.hasVariableLet && !detected.hasVariableConst) missing.push('variable (let/const)');
    if (!detected.hasFunction) missing.push('función');
    if (!detected.hasForLoop && !detected.hasWhileLoop) missing.push('bucle (for/while)');
    if (missing.length > 0) {
      issues.push(`💡 Combina: ${missing.join(', ')}`);
    }
  }

  // Errores de sintaxis comunes
  if (code.includes('move()') || code.includes('say()')) {
    issues.push('⚠️ move() y say() necesitan un valor. Ejemplo: move(3), say("hola")');
  }

  if (code.includes('let ') && !code.includes('=') && !code.includes(';')) {
    issues.push('⚠️ La variable "let" necesita un valor: let x = 5');
  }

  return { issues, detected };
}

/**
 * Ejecuta el código y retorna resultado completo
 */
export function runCode(code, level, onProgress) {
  const { state: initialState, safeFunctions, safeConsole } = createSafeContext(level.startPosition);
  
  const executionLog = [];
  
  // Wrapper para trackear cada paso
  const trackedMove = (steps) => {
    safeFunctions.move(steps);
    executionLog.push({
      type: 'move',
      steps,
      position: initialState.position,
      timestamp: Date.now()
    });
    if (onProgress) {
      onProgress({ type: 'move', steps, position: initialState.position });
    }
  };
  
  const trackedSay = (text) => {
    safeFunctions.say(text);
    executionLog.push({
      type: 'say',
      text,
      timestamp: Date.now()
    });
    if (onProgress) {
      onProgress({ type: 'say', text });
    }
  };
  
  // Console wrapper
  const trackedConsole = {
    log: (...args) => {
      const text = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      safeConsole.log(text);
      executionLog.push({
        type: 'console',
        text,
        timestamp: Date.now()
      });
      if (onProgress) {
        onProgress({ type: 'console', text });
      }
    }
  };

  // Ejecutar
  const result = executeCode(code, {
    move: trackedMove,
    say: trackedSay
  }, trackedConsole, initialState);

  // Análisis del código
  const analysis = analyzeCodeStructure(code, level);
  
  // Validar resultado
  const validationErrors = [];
  
  // Verificar estado esperado
  for (const [key, expectedValue] of Object.entries(level.expectedState)) {
    const actualValue = result.state[key];
    
    if (actualValue === undefined) {
      validationErrors.push(`No completaste el objetivo: ${key}`);
    } else if (actualValue !== expectedValue) {
      if (key === 'position') {
        validationErrors.push(`La posición final es ${actualValue}, pero debería ser ${expectedValue}`);
      } else if (key === 'messageLogged') {
        validationErrors.push('El mensaje no se mostró correctamente');
      } else {
        validationErrors.push(`El resultado de "${key}" no es correcto`);
      }
    }
  }

  return {
    ...result,
    validation: {
      isValid: validationErrors.length === 0 && analysis.issues.length === 0,
      errors: [...validationErrors, ...analysis.issues],
      codeAnalysis: analysis
    },
    executionLog,
    finalPosition: result.state.position,
    consoleOutput: result.state.consoleOutput,
    conceptRequired: level.concept
  };
}

/**
 * Genera mensaje de error amigable
 */
export function getFriendlyError(errorMessage) {
  const friendlyErrors = {
    'move() requires a number': '🔢 move() necesita un número. Ejemplo: move(3)',
    'move() does not accept negative numbers': '⬇️ No uses números negativos con move()',
    'move() cannot move more than 100 steps at once': '🦘 move() no puede mover más de 100 pasos',
    'say() requires text': '💬 say() necesita texto entre comillas. Ejemplo: say("hola")',
    'is not defined': '❓ Esa variable no existe. ¿Escriste bien el nombre?',
    'Unexpected end of input': '📝 Falta cerrar algo. Revisa paréntesis ) y llaves }',
    'Unexpected token': '📝 Error de sintaxis. Revisa que todo esté bien escrito',
    'Missing semicolon': '🔚 Falta un punto y coma ; al final',
    'Unexpected identifier': '📝 Identificador inesperado. ¿Falta una coma o punto y coma?',
    'Invalid or unexpected token': '📝 Token inválido. Revisa caracteres especiales'
  };

  for (const [pattern, message] of Object.entries(friendlyErrors)) {
    if (errorMessage.includes(pattern)) {
      return message;
    }
  }

  if (errorMessage.includes('Unexpected')) {
    return '📝 Error de sintaxis. Revisa: paréntesis, comillas, punto y coma';
  }
  
  if (errorMessage.includes('not defined')) {
    return '❓ Algo no está definido. ¿Escriste bien el nombre?';
  }

  return `❌ ${errorMessage.substring(0, 100)}`;
}

/**
 * Obtiene hint específico según el nivel
 */
export function getLevelHint(level) {
  const hints = {
    1: 'La función move() acepta un número. Ejemplo: move(3); avanza 3 pasos',
    2: 'Declara una variable: let pasos = 5; y luego usa: move(pasos);',
    3: 'Usa const para valores que no cambian: const pasos = 4; move(pasos);',
    4: 'Un if verifica si algo es verdadero: if (valor > 5) { move(3); }',
    5: 'El for repite código: for (let i = 0; i < 5; i++) { move(1); }',
    6: 'console.log() muestra mensajes: console.log("¡Hola, rey!");',
    7: 'while repite mientras sea verdad: let i = 0; while (i < 4) { move(1); i++; }',
    8: 'function crear una función: function avanzar() { move(2); } avanzar();',
    9: 'Función con parámetro: function moverMagia(pasos) { move(pasos); } moverMagia(3);',
    10: 'Combina todo: let pasos = 4; function atacar() { move(1); } for(let i=0; i<pasos; i++) { atacar(); }'
  };
  
  return hints[level.id] || level.hint;
}
