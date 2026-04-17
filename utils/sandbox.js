/**
 * Sandbox seguro para ejecutar código JavaScript
 * Implementa un entorno controlado sin acceso a DOM, fetch, etc.
 */

// Patrones peligrosos que no se permiten
const DANGEROUS_PATTERNS = [
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\s*\./i,
  /window\s*\./i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /import\s*\(/i,
  /require\s*\(/i,
  /process\s*\./i,
  /global\s*\./i,
  /\s*delete\s+/i,
  /location\s*\./i,
  /cookie/i,
  /localStorage/i,
  /sessionStorage/i,
  /alert\s*\(/i,
  /prompt\s*\(/i,
  /confirm\s*\(/i,
  /innerHTML\s*=/i,
  /outerHTML\s*=/i,
  /insertAdjacentHTML/i,
  /open\s*\(/i,
  /close\s*\(/i,
  /write\s*\(/i,
];

// Límites de ejecución
const MAX_ITERATIONS = 1000;
const MAX_POSITION = 100;

/**
 * Crea un contexto seguro con funciones permitidas
 */
export function createSafeContext(startPosition = 0) {
  const state = {
    position: startPosition,
    messageLogged: false,
    loggedText: "",
    consoleOutput: [],
    errors: [],
    bridgeOpen: false,
    conditionMet: false
  };

  const safeFunctions = {
    move: (steps) => {
      // Validar tipo
      if (typeof steps !== 'number' || !Number.isFinite(steps)) {
        throw new Error('move() requires a number');
      }
      
      // Validar rango
      if (steps < 0) {
        throw new Error('move() does not accept negative numbers');
      }
      
      if (steps > MAX_POSITION) {
        throw new Error('move() cannot move more than 100 steps at once');
      }
      
      if (state.position + steps > MAX_POSITION) {
        throw new Error('move() would exceed maximum position');
      }
      
      state.position += steps;
    },

    say: (text) => {
      if (typeof text !== 'string') {
        throw new Error('say() requires text');
      }
      state.messageLogged = true;
      state.loggedText = text;
      state.consoleOutput.push(`💬 "${text}"`);
    }
  };

  const safeConsole = {
    log: (...args) => {
      const text = args.map(arg => {
        if (typeof arg === 'undefined') return 'undefined';
        if (typeof arg === 'object' && arg === null) return 'null';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      state.consoleOutput.push(`📝 ${text}`);
      
      // Si el nivel espera un console.log, verificar
      if (text === '¡Hola, rey!' || text.includes('Hola')) {
        state.messageLogged = true;
        state.loggedText = text;
      }
    }
  };

  return { state, safeFunctions, safeConsole };
}

/**
 * Valida que el código no contenga patrones peligrosos
 */
function validateCode(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      const match = code.match(pattern);
      throw new Error(`Código no permitido: "${match[0].trim()}". Solo puedes usar: move(), say(), console.log(), variables y funciones básicas.`);
    }
  }
  
  // Verificar que no intente acceder a propiedades peligrosas
  const dangerousProperties = ['constructor', '__proto__', 'prototype'];
  for (const prop of dangerousProperties) {
    if (code.includes(`.${prop}`)) {
      throw new Error(`No puedes acceder a "${prop}". Es una propiedad peligrosa.`);
    }
  }
}

/**
 * Ejecuta código JavaScript en el sandbox
 */
export function executeCode(code, safeFunctions, safeConsole, initialState) {
  const state = { ...initialState };
  
  try {
    // Validar código primero
    validateCode(code);
    
    // Crear scope seguro
    const safeGlobal = {
      move: safeFunctions.move,
      say: safeFunctions.say,
      console: safeConsole,
      Math,
      JSON,
      Number,
      String,
      Boolean,
      Array,
      Object,
      Date,
      RegExp,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      encodeURI,
      decodeURI
    };
    
    // Crear función ejecutable con "use strict"
    const wrappedCode = `
      "use strict";
      const move = safeGlobal.move;
      const say = safeGlobal.say;
      const console = safeGlobal.console;
      const Math = safeGlobal.Math;
      const JSON = safeGlobal.JSON;
      const Number = safeGlobal.Number;
      const String = safeGlobal.String;
      const Boolean = safeGlobal.Boolean;
      const Array = safeGlobal.Array;
      const Object = safeGlobal.Object;
      const Date = safeGlobal.Date;
      const RegExp = safeGlobal.RegExp;
      const parseInt = safeGlobal.parseInt;
      const parseFloat = safeGlobal.parseFloat;
      const isNaN = safeGlobal.isNaN;
      const isFinite = safeGlobal.isFinite;
      const encodeURI = safeGlobal.encodeURI;
      const decodeURI = safeGlobal.decodeURI;
      
      ${code}
    `;
    
    // Ejecutar usando Function constructor (más seguro que eval)
    const fn = new Function('safeGlobal', wrappedCode);
    fn(safeGlobal);
    
    return {
      success: true,
      state,
      output: state.consoleOutput
    };
    
  } catch (error) {
    return {
      success: false,
      state,
      error: error.message,
      output: state.consoleOutput
    };
  }
}

/**
 * Valida el resultado contra el estado esperado
 */
export function validateResult(actualState, expectedState) {
  const errors = [];
  
  for (const [key, expectedValue] of Object.entries(expectedState)) {
    const actualValue = actualState[key];
    
    if (actualValue === undefined) {
      errors.push(`No ejecutaste la acción correcta para "${key}"`);
      continue;
    }
    
    if (actualValue !== expectedValue) {
      // Mensaje específico según el tipo de validación
      if (key === 'position') {
        errors.push(`La posición final debería ser ${expectedValue}, pero es ${actualValue}`);
      } else if (key === 'messageLogged') {
        errors.push('El mensaje no se mostró correctamente');
      } else {
        errors.push(`"${key}" debería ser ${expectedValue}, pero es ${actualValue}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
