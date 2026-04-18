/**
 * Sandbox 2D para movimiento en 4 direcciones
 */

// Patrones peligrosos
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
  /location\s*\./i,
];

const MAX_MOVES = 1000;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 6;

/**
 * Crea contexto seguro 2D
 */
export function createSafeContext2D(initialState, level, onProgress) {
  const state = {
    x: initialState.x,
    y: initialState.y,
    starsCollected: [],
    moveCount: 0,
    consoleOutput: [],
    errors: []
  };

  const validDirections = ['up', 'down', 'left', 'right'];

  const safeFunctions = {
    move: (direction, steps = 1) => {
      // Validar dirección
      if (typeof direction !== 'string') {
        throw new Error('move() requires direction as string: "up", "down", "left", "right"');
      }
      
      const dir = direction.toLowerCase();
      if (!validDirections.includes(dir)) {
        throw new Error(`Invalid direction: "${direction}". Use: "up", "down", "left", "right"`);
      }
      
      // Validar pasos
      if (typeof steps !== 'number' || steps < 1 || !Number.isFinite(steps)) {
        throw new Error('move() requires a positive number for steps');
      }
      
      if (steps > 10) {
        throw new Error('Maximum 10 steps per move');
      }
      
      if (state.moveCount >= MAX_MOVES) {
        throw new Error('Too many moves! Maximum 1000 moves allowed.');
      }
      
      // Ejecutar movimiento
      for (let i = 0; i < steps; i++) {
        let newX = state.x;
        let newY = state.y;
        
        switch (dir) {
          case 'up':    newY = Math.max(0, state.y - 1); break;
          case 'down':  newY = Math.min(GRID_HEIGHT - 1, state.y + 1); break;
          case 'left':  newX = Math.max(0, state.x - 1); break;
          case 'right': newX = Math.min(GRID_WIDTH - 1, state.x + 1); break;
        }
        
        state.x = newX;
        state.y = newY;
        state.moveCount++;
        
        // Notificar progreso
        if (onProgress) {
          onProgress({ 
            type: 'move', 
            direction: dir, 
            x: state.x, 
            y: state.y,
            steps: i + 1
          });
        }
        
        // Verificar si recolectó una estrella
        if (level.stars) {
          for (const star of level.stars) {
            if (star.x === state.x && star.y === state.y && !state.starsCollected.includes(`${star.x},${star.y}`)) {
              state.starsCollected.push(`${star.x},${star.y}`);
              if (onProgress) {
                onProgress({ type: 'collectStar', x: state.x, y: state.y, total: state.starsCollected.length });
              }
            }
          }
        }
      }
    },

    say: (text) => {
      if (typeof text !== 'string') {
        throw new Error('say() requires text');
      }
      state.consoleOutput.push(`💬 "${text}"`);
      if (onProgress) {
        onProgress({ type: 'say', text });
      }
    }
  };

  const safeConsole = {
    log: (...args) => {
      const text = args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' ');
      state.consoleOutput.push(`📝 ${text}`);
      if (onProgress) {
        onProgress({ type: 'console', text });
      }
    }
  };

  return { state, safeFunctions, safeConsole };
}

/**
 * Valida que el código sea seguro
 */
function validateCode(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      throw new Error(`Código no permitido: "${pattern}"`);
    }
  }
}

/**
 * Ejecuta código 2D
 */
export function executeCode2D(code, safeFunctions, safeConsole) {
  const state = { ...safeFunctions.move, x: 0, y: 0, starsCollected: [], moveCount: 0, consoleOutput: [] };
  
  // Rebuild state from closure
  const executionState = {
    x: 0,
    y: 0,
    starsCollected: [],
    moveCount: 0,
    consoleOutput: []
  };
  
  try {
    validateCode(code);
    
    const wrappedCode = `
      "use strict";
      const move = safeFunctions.move;
      const say = safeFunctions.say;
      const console = safeConsole;
      ${code}
    `;
    
    const fn = new Function('safeFunctions', 'safeConsole', wrappedCode);
    fn(safeFunctions, safeConsole);
    
    return {
      success: true,
      state: executionState,
      error: null
    };
    
  } catch (error) {
    return {
      success: false,
      state: executionState,
      error: error.message
    };
  }
}
