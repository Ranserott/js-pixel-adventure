/**
 * Evaluador de código JavaScript - Versión Desafíos
 */

// Código peligroso a detectar
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
  /\$_\w+/i,          // Variables PHP
  /__proto__/,
  /constructor/,
  /prototype/,
];

const MAX_OPERATIONS = 10000;

/**
 * Obtiene mensajes de error amigables en español
 */
export function getFriendlyError(error) {
  const errorStr = String(error);
  
  if (errorStr.includes('is not defined')) {
    const varName = errorStr.match(/(\w+) is not defined/)?.[1] || 'una variable';
    return `❌ "${varName}" no está definida. ¿Olvidaste declararla con let, const o function?`;
  }
  
  if (errorStr.includes('is not a function')) {
    const fnName = errorStr.match(/(\w+) is not a function/)?.[1] || 'la función';
    return `❌ "${fnName}" no es una función. ¿Definiste la función correctamente?`;
  }
  
  if (errorStr.includes('is not a constructor')) {
    return `❌ Estás intentando usar "new" con algo que no es un constructor.`;
  }
  
  if (errorStr.includes('Unexpected token')) {
    return `❌ Hay un error de sintaxis. Revisa paréntesis, llaves o punto y coma.`;
  }
  
  if (errorStr.includes('Unexpected end')) {
    return `❌ La expresión está incompleta. Falta cerrar algo.`;
  }
  
  if (errorStr.includes('Illegal')) {
    return `❌ Carácter ilegal encontrado.`;
  }
  
  if (errorStr.includes('Too many')) {
    return `❌ Demasiadas operaciones. Posible bucle infinito.`;
  }
  
  return `❌ Error: ${errorStr}`;
}

/**
 * Hint específico por nivel
 */
export function getLevelHint(level) {
  if (!level?.challenge?.hints) return 'Revisa la teoría y piensa en la solución.';
  return level.challenge.hints[0];
}

/**
 * Analiza estructura del código
 */
export function analyzeCodeStructure(code, level) {
  const issues = [];
  const warnings = [];
  
  // Detectar código peligroso
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      issues.push(`Código no permitido: ${pattern}`);
    }
  }
  
  // Warnings útiles
  if (code.includes('while(true)') || code.includes('while (true)')) {
    warnings.push('⚠️ Posible bucle infinito con while(true)');
  }
  
  if ((code.match(/for\s*\(/g) || []).length > 5) {
    warnings.push('⚠️ Muchos bucles for detectados');
  }
  
  return { issues, warnings, isValid: issues.length === 0 };
}

/**
 * Ejecuta código en sandbox y retorna el estado final
 */
export function runCode(userCode, level, onProgress) {
  if (!level?.challenge?.tests) {
    return { success: false, error: 'Nivel sin tests configurados', variables: {} };
  }
  
  // Validar código
  const analysis = analyzeCodeStructure(userCode, level);
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], variables: {} };
  }
  
  // Contexto seguro
  const safeContext = createSafeContext();
  
  // Hook de progreso para debug
  const log = (msg) => {
    if (onProgress) onProgress({ type: 'console', text: msg });
  };
  
  try {
    // Crear función con el código del usuario
    // Aseguramos que las variables declaradas estén disponibles
    const wrappedCode = `
      "use strict";
      ${userCode}
    `;
    
    // Ejecutar en contexto seguro
    const fn = new Function(
      'console',
      ...safeContext.allowedVars,
      wrappedCode
    );
    
    // Valores iniciales
    const initialValues = {
      console: {
        log: (...args) => log(args.map(String).join(' ')),
        error: (...args) => log('ERROR: ' + args.join(' ')),
        warn: (...args) => log('WARN: ' + args.join(' '))
      },
      // Variables predefinidas del challenge
      ...safeContext.predefined
    };
    
    // Ejecutar
    fn(...Object.values(initialValues));
    
    // Recolectar variables del usuario
    const userVars = {};
    for (const varName of safeContext.allowedVars) {
      try {
        // Intentar leer la variable ejecutando el código de nuevo y extrayendo
        const extractFn = new Function(
          'console',
          ...safeContext.allowedVars,
          `${userCode}; return { ${safeContext.allowedVars.join(', ')} };`
        );
        const result = extractFn(...Object.values(initialValues));
        if (result && result[varName] !== undefined) {
          userVars[varName] = result[varName];
        }
      } catch {
        // Variable no definida, continuar
      }
    }
    
    // Evaluar tests
    const testResults = evaluateTests(userCode, level.challenge.tests, safeContext);
    
    return {
      success: testResults.allPassed,
      error: testResults.allPassed ? null : testResults.failedTests[0]?.description,
      testResults: testResults.results,
      variables: userVars
    };
    
  } catch (error) {
    return {
      success: false,
      error: getFriendlyError(error),
      variables: {}
    };
  }
}

/**
 * Crea contexto seguro para ejecución
 */
function createSafeContext() {
  return {
    allowedVars: [
      // Variables comunes que el usuario puede definir
      'nombre', 'edad', 'pais', 'ciudad', 'numero', 'resultado', 'suma',
      'base', 'altura', 'area', 'lenguaje', 'version', 'esGenial',
      'a', 'b', 'c', 'x', 'y', 'z', 'i', 'j', 'k', 'n', 'm',
      'texto', 'saludo', 'tipo', 'valor', 'dia', 'mensaje',
      'multiplicar', 'esPar', 'contador1', 'crearContador',
      'numeros', 'longitud', 'libro', 'obj1', 'obj2', 'persona',
      'frutas', 'notas', 'resultadoFinal', 'invertido', 'contador',
      'productos', 'nombres', 'masLargo', 'sumaTotal', 'pares'
    ],
    predefined: {}
  };
}

/**
 * Evalúa los tests de un challenge
 */
function evaluateTests(userCode, tests, context) {
  const results = [];
  
  for (const test of tests) {
    try {
      // Crear un entorno con el código del usuario + el test
      const testCode = `
        ${userCode}
        return (${test.code});
      `;
      
      // Preparar valores iniciales
      const initialContext = { ...context.predefined };
      
      const testFn = new Function(
        ...context.allowedVars,
        testCode
      );
      
      // Llamar con valores dummy que el código del usuario debería definir
      const dummyValues = context.allowedVars.reduce((acc, v) => {
        acc[v] = undefined;
        return acc;
      }, {});
      
      // Primero ejecutar el código del usuario
      const execFn = new Function(
        ...context.allowedVars,
        userCode
      );
      execFn(...Object.values(dummyValues));
      
      // Ahora evaluar el test con los valores reales
      // Para esto necesitamos un enfoque diferente
      const fullCode = `
        ${userCode}
        ;
        return (${test.code});
      `;
      
      // Crear contexto con variables globales
      const evalFn = new Function(
        'return (function() { ' + userCode + '; return (' + test.code + '); })()'
      );
      
      const passed = evalFn();
      
      results.push({
        code: test.code,
        description: test.description,
        passed: Boolean(passed),
        error: null
      });
      
    } catch (error) {
      results.push({
        code: test.code,
        description: test.description,
        passed: false,
        error: String(error)
      });
    }
  }
  
  const allPassed = results.every(r => r.passed);
  const failedTests = results.filter(r => !r.passed);
  
  return { results, allPassed, failedTests, passedCount: results.filter(r => r.passed).length };
}

/**
 * Ejecuta código simple y retorna el resultado
 */
export function executeCode(code) {
  const analysis = analyzeCodeStructure(code, {});
  if (!analysis.isValid) {
    return { success: false, error: analysis.issues[0], output: [] };
  }
  
  const logs = [];
  
  try {
    const fn = new Function('console', `
      "use strict";
      const __logs = [];
      const console = {
        log: (...args) => __logs.push(args.join(' ')),
        error: (...args) => __logs.push('ERROR: ' + args.join(' ')),
        warn: (...args) => __logs.push('WARN: ' + args.join(' '))
      };
      ${code}
      return __logs;
    `);
    
    const output = fn(console);
    
    return {
      success: true,
      output: output || [],
      error: null
    };
    
  } catch (error) {
    return {
      success: false,
      output: logs,
      error: getFriendlyError(error)
    };
  }
}
