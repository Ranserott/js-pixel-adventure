/**
 * Evaluador de código JavaScript - Versión Mejorada para Estudiantes
 */

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
  /\$_\w+/i,
  /__proto__/,
  /constructor/,
  /prototype/,
];

// Mensajes de error amigables en español
const ERROR_MESSAGES = {
  'not defined': (name) => `❌ "${name}" no está definido. ¿Olvidaste declararlo con let, const o var?`,
  'is not a function': (name) => `❌ "${name}" no es una función. ¿Definiste la función correctamente?`,
  'is not a constructor': `❌ Estás usando "new" con algo que no es un constructor.`,
  'Unexpected token': `❌ Error de sintaxis. Revisa paréntesis (), llaves {}, corchetes [] y punto y coma ;`,
  'Unexpected end': `❌ La expresión está incompleta. Probablemente falta cerrar algo.`,
  'Illegal': `❌ Carácter ilegal encontrado. ¿Usaste algún símbolo no permitido?`,
  'Too many': `❌ Demasiadas operaciones. ¿Hay un bucle infinito?`,
  'Cannot read': (prop) => `❌ No se puede leer "${prop}". ¿La variable existe?`,
  'invalid assignment': `❌ Asignación inválida. ¿Estás asignando a una constante?`,
  'undefined': (prop) => `❌ "${prop}" es undefined. ¿Lo definiste antes de usarlo?`,
  'null': (prop) => `❌ "${prop}" es null. ¿Lo inicializaste correctamente?`,
};

// Consejos por tipo de problema
const TIPS = {
  'let': '💡 Usa "let" para variables que cambiarán: let edad = 25;',
  'const': '💡 Usa "const" para valores fijos: const PI = 3.14;',
  'function': '💡 Declara funciones así: function nombre() { return valor; }',
  'arrow': '💡 Arrow function: const fn = (a, b) => a + b;',
  'if': '💡 Condicional: if (condicion) { /* código */ }',
  'for': '💡 Bucle: for (let i = 0; i < 5; i++) { /* código */ }',
  'while': '💡 Bucle: while (condicion) { /* código */ }',
  'return': '💡 Las funciones devuelven valores con: return valor;',
  'console.log': '💡 Muestra mensajes con: console.log("texto");',
  'array': '💡 Crea arrays: let nums = [1, 2, 3];',
  'object': '💡 Crea objetos: let obj = { clave: "valor" };',
  'typeof': '💡 Verifica tipos: typeof variable === "string"',
  'string': '💡 Los strings van entre comillas: "texto" o \'texto\'',
  'number': '💡 Los números van sin comillas: 42, 3.14',
  'boolean': '💡 Booleanos: true o false (sin comillas)',
};

function getFriendlyError(error) {
  const errorStr = String(error);
  
  for (const [key, handler] of Object.entries(ERROR_MESSAGES)) {
    if (errorStr.includes(key)) {
      if (typeof handler === 'function') {
        const match = errorStr.match(/(\w+)/);
        return handler(match ? match[1] : key);
      }
      return handler;
    }
  }
  
  return `❌ Error: ${errorStr}`;
}

// Analiza el código y da feedback constructivo
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  const suggestions = [];
  
  // Detectar código peligroso
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      issues.push(`Código no permitido detectado`);
    }
  }
  
  // Analizar qué conceptos usa el estudiante
  const concepts = detectConcepts(code);
  
  // Verificar si el concepto del nivel está presente
  if (level?.challenge?.requiredConcepts) {
    for (const concept of level.challenge.requiredConcepts) {
      if (!concepts.includes(concept)) {
        warnings.push(TIPS[concept] || `💡 Este nivel requiere: ${concept}`);
      }
    }
  }
  
  // Tips según el nivel
  if (level?.id) {
    if (level.id.includes('variable')) {
      if (!code.includes('let') && !code.includes('const')) {
        suggestions.push(TIPS['let']);
      }
    }
  }
  
  // Detectar problemas comunes
  if (code.includes('while(true)') || code.includes('while (true)')) {
    warnings.push('⚠️ Cuidado: while(true) puede crear un bucle infinito');
  }
  
  if (code.includes('for (;;)')) {
    warnings.push('⚠️ Cuidado: for(;;) puede crear un bucle infinito');
  }
  
  if (code.match(/\/\s*\*[\s\S]*?undefined/g)) {
    warnings.push('💡 undefined es un valor, no una cadena de texto');
  }
  
  // Verificar uso de = en vez de ===
  if (code.match(/if\s*\([^)]*=[^=]/)) {
    warnings.push('💡 ¿Usaste = en vez de === dentro del if?');
  }
  
  return { 
    issues, 
    warnings, 
    suggestions,
    concepts,
    isValid: issues.length === 0 
  };
}

function detectConcepts(code) {
  const concepts = [];
  const codeLower = code.toLowerCase();
  
  if (/\blet\s+\w+/.test(code)) concepts.push('let');
  if (/\bconst\s+\w+/.test(code)) concepts.push('const');
  if (/\bfunction\s+\w+/.test(code)) concepts.push('function');
  if (/=>\s*[{(]/.test(code) || /const\s+\w+\s*=\s*\([^)]*\)\s*=>/.test(code)) concepts.push('arrow');
  if (/\bif\s*\(/.test(code)) concepts.push('if');
  if (/\bfor\s*\(/.test(code)) concepts.push('for');
  if (/\bwhile\s*\(/.test(code)) concepts.push('while');
  if (/\breturn\s+/.test(code)) concepts.push('return');
  if (/console\.log/.test(code)) concepts.push('console.log');
  if (/\[\s*[\d,.\s]+\s*\]/.test(code) || /Array\s*\(/.test(code)) concepts.push('array');
  if (/{\s*[\w]+\s*:/.test(code)) concepts.push('object');
  if (/\btypeof\s+/.test(code)) concepts.push('typeof');
  if (/"[^"]*"|'[^']*'/.test(code)) concepts.push('string');
  if (/\b\d+(\.\d+)?/.test(code) && !/"[^"]*'/.test(code)) concepts.push('number');
  if (/\btrue\b|\bfalse\b/.test(code)) concepts.push('boolean');
  if (/\[\s*\]/.test(code)) concepts.push('array');
  if (/\.(push|pop|map|filter|reduce)\s*\(/.test(code)) {
    concepts.push('array-methods');
  }
  if (/\.length/.test(code)) concepts.push('property');
  if (/\.(toUpperCase|toLowerCase|includes|slice|split)\s*\(/.test(code)) {
    concepts.push('string-methods');
  }
  
  return concepts;
}

// Ejecuta código con contexto seguro
export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests configurados', testResults: [] };
  }
  
  const analysis = analyzeCodeStructure(userCode, level);
  if (!analysis.isValid) {
    return { 
      success: false, 
      error: analysis.issues[0], 
      warnings: analysis.warnings,
      testResults: [] 
    };
  }
  
  const logs = [];
  
  // Crear contexto de consola seguro
  const safeConsole = {
    log: (...args) => {
      const text = args.map(arg => {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        if (typeof arg === 'object') {
          try { return JSON.stringify(arg); } 
          catch { return String(arg); }
        }
        return String(arg);
      }).join(' ');
      logs.push(text);
      if (onProgress) onProgress({ type: 'console', text });
    },
    error: (...args) => logs.push('❌ ' + args.join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
    info: (...args) => logs.push('ℹ️ ' + args.join(' '))
  };
  
  // Variables que el código puede usar
  const allowedVars = [
    'nombre', 'edad', 'pais', 'ciudad', 'numero', 'resultado', 'suma',
    'base', 'altura', 'area', 'lenguaje', 'version', 'esGenial',
    'a', 'b', 'c', 'x', 'y', 'z', 'i', 'j', 'k', 'n', 'm',
    'texto', 'saludo', 'tipo', 'valor', 'dia', 'mensaje',
    'multiplicar', 'esPar', 'contador1', 'crearContador',
    'numeros', 'longitud', 'libro', 'obj1', 'obj2', 'persona',
    'frutas', 'notas', 'resultadoFinal', 'invertido', 'contador',
    'productos', 'nombres', 'masLargo', 'sumaTotal', 'pares',
    'positivo', 'negativo', 'cero', 'count', 'escalones'
  ];
  
  try {
    // Crear función que ejecuta el código del usuario
    const wrappedCode = `
      "use strict";
      ${userCode}
    `;
    
    // Crear valores iniciales dummy para permitir que el código compile
    const initialContext = {};
    allowedVars.forEach(v => initialContext[v] = undefined);
    
    // Ejecutar el código
    const execFn = new Function(
      'console',
      ...allowedVars,
      wrappedCode
    );
    
    // Llamar con la consola segura
    execFn(safeConsole, ...Object.values(initialContext));
    
    // Ahora evaluar los tests
    const testResults = evaluateTests(userCode, level.challenge.tests, safeConsole, allowedVars);
    
    const allPassed = testResults.every(t => t.passed);
    
    return {
      success: allPassed,
      error: allPassed ? null : testResults.find(t => !t.passed)?.message,
      warnings: analysis.warnings,
      suggestions: analysis.suggestions,
      logs: logs,
      testResults: testResults,
      concepts: analysis.concepts
    };
    
  } catch (error) {
    return {
      success: false,
      error: getFriendlyError(error),
      warnings: analysis.warnings,
      suggestions: analysis.suggestions,
      logs: logs,
      testResults: []
    };
  }
}

function evaluateTests(userCode, tests, console, allowedVars) {
  const results = [];
  
  for (const test of tests) {
    try {
      // El test es una expresión que debe evaluar a true
      // Primero ejecutamos el código del usuario, luego evaluamos el test
      const testCode = `
        "use strict";
        ${userCode}
        ;
        return (${test.code});
      `;
      
      const contextValues = {};
      allowedVars.forEach(v => contextValues[v] = undefined);
      
      const testFn = new Function('console', ...allowedVars, testCode);
      const passed = testFn(console, ...Object.values(contextValues));
      
      results.push({
        code: test.code,
        description: test.description,
        passed: Boolean(passed),
        message: passed ? '✅ Correcto' : `❌ Incorrecto: ${test.description}`
      });
      
    } catch (error) {
      results.push({
        code: test.code,
        description: test.description,
        passed: false,
        message: `❌ Error: ${getFriendlyError(error)}`
      });
    }
  }
  
  return results;
}

// Hint progresivo
export function getLevelHint(level, attemptCount = 0) {
  if (!level?.challenge?.hints) return 'Revisa la teoría y intenta de nuevo.';
  
  const hints = level.challenge.hints;
  
  if (attemptCount === 0) {
    return hints[0];
  } else if (attemptCount === 1) {
    return hints.length > 1 ? hints[1] : hints[0];
  } else if (attemptCount >= 2) {
    return hints.length > 2 ? hints[2] : hints[hints.length - 1];
  }
  
  return hints[0];
}

// Mensaje motivacional
const MOTIVATIONAL_MESSAGES = [
  '¡Sigue intentando, lo estás haciendo genial! 💪',
  '¡No te rindas! Cada error es una oportunidad de aprender 🚀',
  '¡Piensa un poco más, tú puedes! 🎯',
  'Revisa la teoría de nuevo, ahí está la pista 📚',
  '¡Un paso a la vez! Pronto lo lograrás ✨',
];

export function getMotivationalMessage() {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
}
