/**
 * Evaluador seguro de código JavaScript
 * Ejecuta código del usuario en un entorno controlado (sandbox)
 */

import { createSafeContext, executeCode, validateResult } from './sandbox.js';

/**
 * Ejecuta código y retorna resultado con feedback detallado
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
      onProgress({
        type: 'move',
        steps,
        position: initialState.position,
        character: level.character
      });
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

  // Ejecutar código
  const result = executeCode(code, {
    ...safeFunctions,
    move: trackedMove,
    say: trackedSay
  }, trackedConsole, initialState);

  // Validar resultado
  const validation = validateResult(result.state, level.expectedState);

  return {
    ...result,
    validation,
    executionLog,
    finalPosition: result.state.position,
    consoleOutput: result.state.consoleOutput
  };
}

/**
 * Analiza el código para dar pistas específicas
 */
export function analyzeCode(code) {
  const issues = [];
  const suggestions = [];

  // Detectar problemas comunes
  if (!code.includes('move(') && !code.includes('console.log')) {
    issues.push('No usas move() ni console.log(). ¿Olvidaste llamar una función?');
  }

  if (code.includes('move()') || code.includes('say()')) {
    issues.push('move() y say() requieren un valor. Ejemplo: move(3), say("hola")');
  }

  if (code.includes('let ') && !code.includes('=')) {
    issues.push('La variable necesita un valor. Ejemplo: let x = 5;');
  }

  if (code.includes('const ') && !code.includes('=')) {
    issues.push('La constante necesita un valor. Ejemplo: const x = 5;');
  }

  if (code.includes('for') && !code.includes('{')) {
    issues.push('El for necesita llaves { } para el bloque de código');
  }

  if (code.includes('if') && !code.includes('{')) {
    issues.push('El if necesita llaves { } para el bloque de código');
  }

  if (code.includes('while') && !code.includes('{')) {
    issues.push('El while necesita llaves { } para el bloque de código');
  }

  // Verificar patrones de solución correcta
  const hasForLoop = /for\s*\(\s*let\s+\w+/.test(code);
  const hasWhileLoop = /while\s*\(/.test(code);
  const hasFunction = /function\s+\w+/.test(code);
  const hasVariable = /(let|const)\s+\w+/.test(code);
  const hasMove = /move\s*\(/.test(code);
  const hasConsoleLog = /console\.log\s*\(/.test(code);

  return {
    issues,
    suggestions,
    detected: { hasForLoop, hasWhileLoop, hasFunction, hasVariable, hasMove, hasConsoleLog }
  };
}

/**
 * Genera un mensaje de error amigable
 */
export function getFriendlyError(errorMessage) {
  const friendlyErrors = {
    'move() requires a number': '🔢 ¡move() necesita un número! Ejemplo: move(3)',
    'move() does not accept negative numbers': '⬇️ No puedes usar números negativos con move()',
    'move() cannot move more than 100 steps at once': '🦘 ¡No puedes moverte más de 100 pasos de una vez!',
    'say() requires text': '💬 say() necesita texto entre comillas. Ejemplo: say("hola")',
    'is not defined': '❓ ¡Esta variable no existe! ¿Escribiste bien el nombre?',
    'Unexpected end of input': '📝 ¡Falta cerrar algo! Revisa paréntesis ) y llaves }',
    'Unexpected token': '📝 ¡Error de sintaxis! Revisa que todo esté bien escrito',
    'Missing semicolon': '🔚 ¡Falta un punto y coma ; al final de las líneas!',
    'Cannot read property': '❓ Estás usando algo que no existe o está vacío'
  };

  for (const [pattern, message] of Object.entries(friendlyErrors)) {
    if (errorMessage.includes(pattern)) {
      return message;
    }
  }

  // Mensaje genérico simplificado
  if (errorMessage.includes('Unexpected')) {
    return '📝 Hay un error de sintaxis. Revisa: paréntesis, comillas, punto y coma';
  }
  
  if (errorMessage.includes('not defined')) {
    return '❓ Algo no está definido. ¿Escribiste bien el nombre de la variable o función?';
  }

  return `❌ Error: ${errorMessage.substring(0, 100)}`;
}
