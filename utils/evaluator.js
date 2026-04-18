/**
 * Motor de evaluación - Juego 2D con movimiento en 4 direcciones
 */

import { createSafeContext2D, executeCode2D } from './sandbox2d.js';

/**
 * Analiza estructura del código
 */
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  
  const cleanCode = code.trim();
  
  // Detectar patrones
  const detected = {
    // Variables
    hasVariableLet: /\blet\s+\w+/.test(cleanCode),
    hasVariableConst: /\bconst\s+\w+/.test(cleanCode),
    hasVariableAssignment: /\w+\s*=\s*\d+/.test(cleanCode),
    
    // Control flow
    hasForLoop: /\bfor\s*\(/.test(cleanCode),
    hasWhileLoop: /\bwhile\s*\(/.test(cleanCode),
    hasIfCondition: /\bif\s*\(/.test(cleanCode),
    
    // Funciones
    hasFunctionDeclaration: /\bfunction\s+\w+\s*\(/.test(cleanCode),
    hasFunctionCall: /\w+\s*\(\s*\)/.test(cleanCode),
    
    // Movimientos
    hasMove: /\bmove\s*\(/.test(cleanCode),
    hasMoveUp: /move\s*\(\s*["']up["']\s*\)/.test(cleanCode),
    hasMoveDown: /move\s*\(\s*["']down["']\s*\)/.test(cleanCode),
    hasMoveLeft: /move\s*\(\s*["']left["']\s*\)/.test(cleanCode),
    hasMoveRight: /move\s*\(\s*["']right["']\s*\)/.test(cleanCode),
    
    // Outputs
    hasConsoleLog: /console\.log\s*\(/.test(cleanCode),
    hasSay: /\bsay\s*\(/.test(cleanCode),
    
    // Comparaciones
    hasComparison: /[<>!=]=?|===?|!==/.test(cleanCode),
  };
  
  // Validación por nivel
  switch (level.id) {
    case 1: // Tutorial - move simple
      if (!detected.hasMove) {
        issues.push('💡 Usa move("right") para moverte a la derecha');
      }
      // Verificar move(right) con el número correcto de pasos
      const rightMatch = cleanCode.match(/move\s*\(\s*["']right["']\s*,\s*(\d+)\s*\)/);
      if (!rightMatch) {
        issues.push('💡 move("right", número) mueve a la derecha');
      } else if (parseInt(rightMatch[1]) !== level.targetPosition.x) {
        issues.push(`⚠️ Para este nivel necesitas moverte ${level.targetPosition.x} pasos a la derecha`);
      }
      break;
      
    case 2: // Variables let
      if (!detected.hasVariableLet) {
        issues.push('💡 Declara una variable con "let". Ejemplo: let pasos = 3;');
      }
      if (!detected.hasMoveRight) {
        issues.push('💡 Usa move("right", pasos) para moverte');
      }
      break;
      
    case 3: // Variables const
      if (!detected.hasVariableConst) {
        issues.push('💡 Usa "const" para valores que no cambian');
      }
      if (!detected.hasMove) {
        issues.push('💡 Mueve el mago con move("right", valor)');
      }
      break;
      
    case 4: // Condicional if
      if (!detected.hasIfCondition) {
        issues.push('💡 Usa "if" para verificar una condición');
      }
      if (!detected.hasComparison) {
        issues.push('💡 Compara valores con >, <, ===, etc.');
      }
      break;
      
    case 5: // Bucle for
      if (!detected.hasForLoop) {
        issues.push('💡 Usa "for" para repetir movimientos');
      }
      if (detected.hasForLoop && !cleanCode.match(/for\s*\([^)]+\)\s*\{/)) {
        issues.push('⚠️ El for necesita { }');
      }
      break;
      
    case 6: // console.log
      if (!detected.hasConsoleLog) {
        issues.push('💡 Usa console.log() para mostrar mensajes');
      }
      break;
      
    case 7: // Bucle while
      if (!detected.hasWhileLoop) {
        issues.push('💡 Usa "while" para repetir mientras la condición sea verdadera');
      }
      break;
      
    case 8: // Funciones
      if (!detected.hasFunctionDeclaration) {
        issues.push('💡 Crea una función con "function"');
      }
      if (!detected.hasFunctionCall) {
        issues.push('💡 Llama la función después de crearla');
      }
      break;
      
    case 9: // Parámetros
      if (!detected.hasFunctionDeclaration) {
        issues.push('💡 Crea una función con parámetro');
      }
      break;
      
    case 10: // Combinación
      const missing = [];
      if (!detected.hasVariableLet && !detected.hasVariableConst) missing.push('variable');
      if (!detected.hasFunctionDeclaration) missing.push('función');
      if (!detected.hasForLoop && !detected.hasWhileLoop) missing.push('bucle');
      if (missing.length > 0) {
        issues.push(`💡 Combina: ${missing.join(', ')}`);
      }
      break;
  }
  
  return { issues, warnings, detected };
}

/**
 * Ejecuta código en el contexto 2D
 */
export function runCode(code, level, onProgress) {
  const initialState = {
    x: level.startPosition.x,
    y: level.startPosition.y,
    starsCollected: [],
    moveCount: 0,
    consoleOutput: []
  };
  
  const { safeFunctions, safeConsole } = createSafeContext2D(initialState, level, onProgress);

  // Ejecutar
  const result = executeCode2D(code, safeFunctions, safeConsole);
  
  // Análisis de estructura
  const analysis = analyzeCodeStructure(code, level);
  
  // Validar resultado
  const resultErrors = [];
  
  // Verificar posición final
  if (result.state.x !== level.targetPosition.x) {
    resultErrors.push(`Posición X: ${result.state.x}. Debería ser: ${level.targetPosition.x}`);
  }
  if (result.state.y !== level.targetPosition.y) {
    resultErrors.push(`Posición Y: ${result.state.y}. Debería ser: ${level.targetPosition.y}`);
  }
  
  // Verificar estrellas recolectadas
  if (level.stars && level.stars.length > 0) {
    const requiredStars = level.stars.length;
    const collected = result.state.starsCollected.length;
    if (collected < requiredStars) {
      resultErrors.push(`Estrellas: ${collected}/${requiredStars}. ¡Recolecta todas las estrellas!`);
    }
  }
  
  return {
    success: result.success,
    error: result.error,
    state: result.state,
    validation: {
      isValid: resultErrors.length === 0 && analysis.issues.length === 0,
      errors: [...resultErrors, ...analysis.issues],
      warnings: analysis.warnings
    },
    consoleOutput: result.state.consoleOutput,
    finalPosition: { x: result.state.x, y: result.state.y },
    starsCollected: result.state.starsCollected
  };
}

export function getFriendlyError(errorMessage) {
  const errors = {
    'move() requires direction': '💡 move() necesita dirección: "up", "down", "left", "right"',
    'move() requires a number': '💡 move() necesita un número de pasos',
    'is not defined': '❓ Variable no definida',
    'Unexpected end of input': '📝 Falta cerrar algo',
    'Unexpected token': '📝 Error de sintaxis',
  };
  
  for (const [pattern, msg] of Object.entries(errors)) {
    if (errorMessage.includes(pattern)) return msg;
  }
  
  if (errorMessage.includes('not defined')) return '❓ Algo no está definido';
  return `❌ ${errorMessage.substring(0, 80)}`;
}

export function getLevelHint(level) {
  const hints = {
    1: 'Mueve a la derecha: move("right", 3)',
    2: 'Usa let para variable: let pasos = 3; move("right", pasos);',
    3: 'Usa const: const pasos = 3; move("right", pasos);',
    4: 'Usa if: if (x < 5) { move("right", 1); }',
    5: 'Usa for: for(let i=0; i<3; i++){ move("right", 1); }',
    6: 'Usa console.log("tu mensaje");',
    7: 'Usa while: let i=0; while(i<3){ move("right", 1); i++; }',
    8: 'Crea función: function avanzar(){ move("right", 1); } avanzar();',
    9: 'Función con parámetro: function mover(p){ move("right", p); } mover(3);',
    10: 'Combina todo lo aprendido'
  };
  return hints[level.id] || level.hint;
}
