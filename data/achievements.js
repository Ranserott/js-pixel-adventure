/**
 * Sistema de Logros/Achievements
 */

export const achievements = [
  // Logros de inicio
  {
    id: 'first_lesson',
    title: 'Primer Paso',
    description: 'Completa tu primera lección',
    icon: '🎯',
    condition: (stats) => stats.completedLessons >= 1,
  },
  {
    id: 'first_module',
    title: 'Módulo Completo',
    description: 'Completa un módulo entero',
    icon: '📚',
    condition: (stats) => stats.completedModules >= 1,
  },
  {
    id: 'all_fundamentals',
    title: 'Fundamentos Dominados',
    description: 'Completa el módulo de Fundamentos',
    icon: '📘',
    condition: (stats, completedLessons) => 
      ['js-variables', 'js-types', 'js-operators', 'js-strings'].every(id => completedLessons.includes(id)),
  },

  // Logros de conceptos
  {
    id: 'variable_master',
    title: 'Maestro de Variables',
    description: 'Domina los conceptos de let y const',
    icon: '🔤',
    condition: (stats, completedLessons) => 
      ['js-variables'].some(id => completedLessons.includes(id)),
  },
  {
    id: 'loop_champion',
    title: 'Campeón de Bucles',
    description: 'Completa las lecciones de for y while',
    icon: '🔁',
    condition: (stats, completedLessons) => 
      ['js-for', 'js-while'].every(id => completedLessons.includes(id)),
  },
  {
    id: 'function_wizard',
    title: 'Mago de Funciones',
    description: 'Domina funciones y arrow functions',
    icon: '⚡',
    condition: (stats, completedLessons) => 
      ['js-functions-basic', 'js-arrow-functions', 'js-scope'].every(id => completedLessons.includes(id)),
  },
  {
    id: 'array_expert',
    title: 'Experto en Arrays',
    description: 'Domina arrays y sus métodos',
    icon: '📊',
    condition: (stats, completedLessons) => 
      ['js-arrays', 'js-array-methods'].every(id => completedLessons.includes(id)),
  },

  // Logros de progreso
  {
    id: 'five_lessons',
    title: 'Cinco Estrellas',
    description: 'Completa 5 lecciones',
    icon: '⭐',
    condition: (stats) => stats.completedLessons >= 5,
  },
  {
    id: 'ten_lessons',
    title: 'Diez Leyendas',
    description: 'Completa 10 lecciones',
    icon: '🌟',
    condition: (stats) => stats.completedLessons >= 10,
  },
  {
    id: 'all_lessons',
    title: 'Graduado',
    description: 'Completa todas las lecciones',
    icon: '🎓',
    condition: (stats) => stats.completedLessons >= stats.totalLessons,
  },

  // Logros especiales
  {
    id: 'streak_3',
    title: 'Racha de 3',
    description: '3 días consecutivos aprendiendo',
    icon: '🔥',
    condition: (stats) => stats.streak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Semana Perfecta',
    description: '7 días consecutivos',
    icon: '💎',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'first_attempt',
    title: 'Genio',
    description: 'Pasa un desafío en el primer intento',
    icon: '🧠',
    condition: (stats) => stats.firstAttemptWins >= 1,
  },
  {
    id: 'helper',
    title: 'Aprendiz',
    description: 'Usa la pista de un desafío',
    icon: '💡',
    condition: (stats) => stats.hintsUsed >= 1,
  },
  {
    id: 'self_learner',
    title: 'Autodidacta',
    description: 'Completa un desafío sin pistas ni solución',
    icon: '🏆',
    condition: (stats) => stats.noHelpCompletions >= 1,
  },
];

// Módulos adicionales para agregar
export const additionalModules = {
  domBasics: {
    title: "DOM y Eventos",
    description: "Aprende a manipular páginas web interactivas",
    icon: "🌐",
    lessons: [
      {
        id: "js-dom-select",
        title: "Seleccionar Elementos",
        type: "lesson",
        theory: `
# El DOM (Document Object Model)

El DOM es la representación de tu página HTML como objetos.

## Seleccionar elementos
\`\`\`javascript
document.getElementById('id');       // Por ID
document.querySelector('.clase');    // Primer coincidência CSS
document.querySelectorAll('p');       // Todos los <p>
\`\`\`

## querySelector vs querySelectorAll
\`\`\`javascript
// querySelector devuelve el PRIMER elemento
const primero = document.querySelector('.item');

// querySelectorAll devuelve TODOS (NodeList)
const todos = document.querySelectorAll('.item');
\`\`\`

## Modificar contenido
\`\`\`javascript
element.textContent = "Nuevo texto";
element.innerHTML = "<strong>HTML</strong>";
\`\`\`

## Modificar estilos
\`\`\`javascript
element.style.color = "blue";
element.style.backgroundColor = "#f0f0f0";
\`\`\`
        `,
        challenge: {
          title: "Manipula el DOM",
          description: "Simula: Crea variable 'texto' = \"Hola desde JavaScript\". El desafío real sería en una página real.",
          hints: [
            "Usa document.querySelector para seleccionar",
            "Asigna el valor a textContent"
          ],
          solution: `// En una página real:
const elemento = document.querySelector('.mensaje');
elemento.textContent = "Hola desde JavaScript";`,
          tests: [
            { code: "typeof texto === 'string'", description: "texto debe ser string" },
            { code: "texto.includes('JavaScript')", description: "Debe mencionar JavaScript" }
          ]
        }
      },
      {
        id: "js-dom-events",
        title: "Eventos",
        type: "lesson",
        theory: `
# Eventos

Los eventos permiten responder a acciones del usuario.

## addEventListener
\`\`\`javascript
const boton = document.querySelector('#miBoton');

boton.addEventListener('click', function() {
  console.log('¡Click!');
});
\`\`\`

## Eventos comunes
\`\`\`javascript
'click'        // Click del mouse
'dblclick'     // Doble click
'mouseover'    // Ratón sobre el elemento
'mouseout'     // Ratón sale del elemento
'keydown'      // Tecla presionada
'submit'       // Formulario enviado
'change'       // Input cambia
\`\`\`

## Ejemplo práctico
\`\`\`javascript
const input = document.querySelector('#nombre');

input.addEventListener('input', function(evento) {
  console.log('Valor:', evento.target.value);
});
\`\`\`

## preventDefault
\`\`\`javascript
form.addEventListener('submit', function(e) {
  e.preventDefault(); // Evita recarga
  console.log('Enviado!');
});
\`\`\`
        `,
        challenge: {
          title: "Responde a un click",
          description: "Simula crear un event listener. Crea variable 'handlerLlamado' = true cuando se simula el click.",
          hints: [
            "Usa addEventListener('click', ...)",
            "En el handler, asigna handlerLlamado = true"
          ],
          solution: `let handlerLlamado = false;

const boton = {
  addEventListener: function(evento, fn) {
    if (evento === 'click') {
      fn();
    }
  }
};

boton.addEventListener('click', function() {
  handlerLlamado = true;
});`,
          tests: [
            { code: "handlerLlamado === true", description: "El handler debe ser llamado" }
          ]
        }
      }
    ]
  },

  asyncAwait: {
    title: "Async/Await y Promesas",
    description: "Maneja operaciones asíncronas",
    icon: "⏳",
    lessons: [
      {
        id: "js-promises",
        title: "Promesas",
        type: "lesson",
        theory: `
# Promesas (Promises)

Las promesas representan un valor que estará disponible en el futuro.

## Crear una promesa
\`\`\`javascript
const miPromesa = new Promise((resolve, reject) => {
  // Simular operación async
  setTimeout(() => {
    resolve("¡Datos cargados!");
  }, 1000);
});
\`\`\`

## then() y catch()
\`\`\`javascript
miPromesa
  .then(resultado => {
    console.log(resultado); // "¡Datos cargados!"
  })
  .catch(error => {
    console.error(error);
  });
\`\`\`

## Estados de una promesa
- **pending**: En espera
- **fulfilled**: Resuelta exitosamente
- **rejected**: Rechazada con error
\`\`\`javascript
const promesa = new Promise((resolve, reject) => {
  const exito = true;
  
  if (exito) {
    resolve("OK");
  } else {
    reject("Error");
  }
});
\`\`\`
        `,
        challenge: {
          title: "Crea tu primera promesa",
          description: "Crea una promesa 'miPromesa' que se resuelva con \"Completado\" después de simular un delay.",
          hints: [
            "Usa new Promise((resolve, reject) => {...})",
            "Llama resolve() con el valor"
          ],
          solution: `const miPromesa = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Completado");
  }, 100);
});

let valorFinal;

miPromesa.then(resultado => {
  valorFinal = resultado;
});`,
          tests: [
            { code: "typeof miPromesa === 'object'", description: "miPromesa debe ser un objeto" },
            { code: "miPromesa !== null", description: "miPromesa no debe ser null" }
          ]
        }
      },
      {
        id: "js-async-await",
        title: "Async/Await",
        type: "lesson",
        theory: `
# Async/Await

Sintaxis más limpia para trabajar con promesas.

## Función async
\`\`\`javascript
async function obtenerDatos() {
  return "datos";
}

obtenerDatos().then(dato => console.log(dato));
\`\`\`

## Await
\`\`\`javascript
async function obtenerDatos() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
\`\`\`

## try/catch
\`\`\`javascript
async function obtenerDatos() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

## Ejemplo completo
\`\`\`javascript
async function iniciarSesion(usuario, password) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, password })
    });
    
    if (!response.ok) throw new Error('Login fallido');
    
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}
\`\`\`
        `,
        challenge: {
          title: "Función async",
          description: "Crea función async 'dobleAsync' que reciba n y retorne n * 2 usando Promise.",
          hints: [
            "Usa async function nombre() {...}",
            "Usa await Promise.resolve(n * 2)"
          ],
          solution: `async function dobleAsync(n) {
  return await Promise.resolve(n * 2);
}

let resultado;
dobleAsync(5).then(r => resultado = r);`,
          tests: [
            { code: "typeof dobleAsync === 'function'", description: "dobleAsync debe ser función" },
            { code: "typeof resultado !== 'undefined'", description: "resultado debe estar definido" }
          ]
        }
      }
    ]
  },

  errorHandling: {
    title: "Manejo de Errores",
    description: "Aprende a manejar errores gracefully",
    icon: "🛡️",
    lessons: [
      {
        id: "js-try-catch",
        title: "Try/Catch",
        type: "lesson",
        theory: `
# Try/Catch

Permite manejar errores sin que el programa se detenga.

## Estructura básica
\`\`\`javascript
try {
  // Código que puede fallar
  let resultado = riskyOperation();
} catch (error) {
  // Manejar el error
  console.error('Ocurrió un error:', error.message);
}
\`\`\`

## finally
\`\`\`javascript
try {
  console.log("Intentando...");
} catch (error) {
  console.log("Falló:", error.message);
} finally {
  console.log("Siempre se ejecuta");
}
\`\`\`

## Lanzar errores
\`\`\`javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir por cero");
  }
  return a / b;
}

try {
  dividir(10, 0);
} catch (e) {
  console.log(e.message); // "No se puede dividir por cero"
}
\`\`\`

## Error personalizado
\`\`\`javascript
class MiError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "MiError";
  }
}
\`\`\`
        `,
        challenge: {
          title: "Maneja el error",
          description: "Envuelve el código en try/catch. Código: throw new Error(\"Fallo\"). Debe asignar errorMessage.",
          hints: [
            "Usa try { ... } catch(e) { ... }",
            "En el catch, asigna el mensaje a errorMessage"
          ],
          solution: `let errorMessage = null;

try {
  throw new Error("Fallo");
} catch (e) {
  errorMessage = e.message;
}`,
          tests: [
            { code: "errorMessage === 'Fallo'", description: "errorMessage debe ser 'Fallo'" }
          ]
        }
      }
    ]
  },

  miniProjects: {
    title: "Mini Proyectos",
    description: "Aplica lo que aprendiste en proyectos reales",
    icon: "🚀",
    lessons: [
      {
        id: "js-project-counter",
        title: "Contador Interactivo",
        type: "project",
        theory: `
# Mini Proyecto: Contador

Vamos a crear un contador funcional.

## Estructura HTML (simulada)
\`\`\`html
<div class="contador">
  <span id="valor">0</span>
  <button id="incrementar">+</button>
  <button id="decrementar">-</button>
</div>
\`\`\`

## Lógica JavaScript
\`\`\`javascript
let cuenta = 0;
const valor = document.getElementById('valor');
const btnInc = document.getElementById('incrementar');
const btnDec = document.getElementById('decrementar');

btnInc.addEventListener('click', () => {
  cuenta++;
  valor.textContent = cuenta;
});

btnDec.addEventListener('click', () => {
  cuenta--;
  valor.textContent = cuenta;
});
\`\`\`

## Extensiones sugeridas
- Botón de reset
- Limitar valores mínimos/máximos
- Cambiar color si es negativo
- Animaciones
        `,
        challenge: {
          title: "Contador con límites",
          description: "Implementa un contador que no baje de 0 ni suba de 10. Funciones: incrementar() y decrementar().",
          hints: [
            "Usa variables globales: cuenta = 0",
            "incrementar() suma solo si cuenta < 10",
            "decrementar() resta solo si cuenta > 0"
          ],
          solution: `let cuenta = 0;

function incrementar() {
  if (cuenta < 10) {
    cuenta++;
  }
  return cuenta;
}

function decrementar() {
  if (cuenta > 0) {
    cuenta--;
  }
  return cuenta;
}`,
          tests: [
            { code: "typeof incrementar === 'function'", description: "incrementar debe ser función" },
            { code: "typeof decrementar === 'function'", description: "decrementar debe ser función" },
            { code: "incrementar() === 1", description: "incrementar() debe dar 1" },
            { code: "decrementar() === 0", description: "decrementar() debe dar 0" },
            { code: "incrementar(); incrementar(); incrementar(); cuenta === 3", description: "3 incrementos = 3" }
          ]
        }
      },
      {
        id: "js-project-todo",
        title: "Lista de Tareas",
        type: "project",
        theory: `
# Mini Proyecto: Todo List

Crea una lista de tareas simple.

## Estructura
\`\`\`javascript
let tareas = [];

function agregarTarea(texto) {
  tareas.push({
    id: Date.now(),
    texto: texto,
    completada: false
  });
}

function completarTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.completada = true;
  }
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
}

function getTareasPendientes() {
  return tareas.filter(t => !t.completada);
}
\`\`\`

## Métodos útiles de array
- push() - Añadir
- pop() - Quitar último
- find() - Buscar uno
- filter() - Filtrar muchos
- some() - Verificar si existe
        `,
        challenge: {
          title: "Gestor de tareas",
          description: "Implementa: agregarTarea(texto), completarTarea(id), getPendientes().",
          hints: [
            "tareas es un array de objetos {id, texto, completada}",
            "completarTarea busca por id y marca completada = true",
            "getPendientes retorna solo las no completadas"
          ],
          solution: `let tareas = [];

function agregarTarea(texto) {
  tareas.push({
    id: Date.now(),
    texto: texto,
    completada: false
  });
}

function completarTarea(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) tarea.completada = true;
}

function getPendientes() {
  return tareas.filter(t => !t.completada);
}`,
          tests: [
            { code: "typeof tareas !== 'undefined'", description: "tareas debe existir" },
            { code: "typeof agregarTarea === 'function'", description: "agregarTarea debe ser función" },
            { code: "typeof getPendientes === 'function'", description: "getPendientes debe ser función" },
            { code: "agregarTarea('Test'); tareas.length === 1", description: "Agregar tarea funciona" },
            { code: "getPendientes().length === 1", description: "getPendientes retorna 1" }
          ]
        }
      }
    ]
  }
};

export function getAchievementProgress(stats, completedLessons) {
  const earned = achievements.filter(a => a.condition(stats, completedLessons));
  const total = achievements.length;
  const percentage = Math.round((earned.length / total) * 100);
  
  return { earned, total, percentage };
}
