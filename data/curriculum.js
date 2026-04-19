/**
 * Currículo de JavaScript - Lecciones y Desafíos
 */

export const curriculum = {
  // MÓDULO 1: Fundamentos
  fundamentals: {
    title: "Fundamentos de JavaScript",
    description: "Aprende los conceptos básicos del lenguaje",
    icon: "📘",
    lessons: [
      {
        id: "js-variables",
        title: "Variables: let y const",
        type: "lesson",
        theory: `
# Variables en JavaScript

Las variables son contenedores para almacenar datos.

## let
\`\`\`javascript
let nombre = "Ana";
nombre = "Carlos"; // ✅ Puedo cambiar el valor
\`\`\`

## const
\`\`\`javascript
const PI = 3.1416;
PI = 3.14; // ❌ Error: No puedo cambiar el valor
\`\`\`

## var (antiguo)
\`\`\`javascript
var edad = 25; // ⚠️ No recomendado
\`\`\`

## Reglas para nombres
- No pueden empezar con números
- Pueden tener letras, números, _ y $
- Son sensibles a mayúsculas
        `,
        challenge: {
          title: "Declara tus primeras variables",
          description: "Crea una variable 'nombre' con tu nombre, una variable 'edad' con tu edad (número), y una constante 'pais' con tu país.",
          hints: [
            "Usa let para nombre y edad",
            "Usa const para pais",
            "Los strings van entre comillas"
          ],
          tests: [
            { code: "typeof nombre === 'string'", description: "nombre debe ser un string" },
            { code: "typeof edad === 'number'", description: "edad debe ser un número" },
            { code: "typeof pais === 'string'", description: "pais debe ser un string" },
            { code: "pais !== undefined", description: "pais debe estar definido" }
          ]
        }
      },
      {
        id: "js-types",
        title: "Tipos de Datos",
        type: "lesson",
        theory: `
# Tipos de Datos

## String (Texto)
\`\`\`javascript
let nombre = "Hola mundo";
let template = \`Hola, \${nombre}\`;
\`\`\`

## Number (Números)
\`\`\`javascript
let entero = 42;
let decimal = 3.14;
\`\`\`

## Boolean
\`\`\`javascript
let esMayor = true;
let tienePermiso = false;
\`\`\`

## Undefined y Null
\`\`\`javascript
let sinDefinir; // undefined
let vacio = null; // null
\`\`\`

## Operador typeof
\`\`\`javascript
typeof "hola"    // "string"
typeof 42        // "number"
typeof true     // "boolean"
\`\`\`
        `,
        challenge: {
          title: "Identifica los tipos",
          description: "Crea: 'lenguaje' = \"JavaScript\", 'version' = 2024, 'esGenial' = true.",
          hints: [
            "Strings usan comillas",
            "Los booleanos son true o false sin comillas"
          ],
          tests: [
            { code: "typeof lenguaje === 'string'", description: "lenguaje debe ser string" },
            { code: "lenguaje === 'JavaScript'", description: "lenguaje debe ser 'JavaScript'" },
            { code: "typeof version === 'number'", description: "version debe ser number" },
            { code: "typeof esGenial === 'boolean'", description: "esGenial debe ser boolean" }
          ]
        }
      },
      {
        id: "js-operators",
        title: "Operadores",
        type: "lesson",
        theory: `
# Operadores

## Aritméticos
\`\`\`javascript
5 + 3    // 8
5 - 3    // 2
5 * 3    // 15
5 / 3    // 1.67
5 % 3    // 2 (resto)
5 ** 3   // 125 (potencia)
\`\`\`

## Comparación
\`\`\`javascript
5 == "5"   // true (débil)
5 === "5"  // false (estricto)
5 !== "5"  // true
3 > 2      // true
\`\`\`

## Lógicos
\`\`\`javascript
true && false  // false (AND)
true || false  // true (OR)
!true          // false (NOT)
\`\`\`
        `,
        challenge: {
          title: "Calcula el área",
          description: "Crea 'base' = 10, 'altura' = 5, calcula 'area' = base * altura.",
          hints: [
            "Multiplicación usa *",
            "El resultado en 'area'"
          ],
          tests: [
            { code: "base === 10", description: "base debe ser 10" },
            { code: "altura === 5", description: "altura debe ser 5" },
            { code: "area === 50", description: "area debe ser 50" }
          ]
        }
      },
      {
        id: "js-strings",
        title: "Manipulación de Strings",
        type: "lesson",
        theory: `
# Strings

## Propiedades
\`\`\`javascript
let texto = "Hola";
texto.length        // 4
texto[0]            // "H"
\`\`\`

## Métodos
\`\`\`javascript
"Hola".toUpperCase()     // "HOLA"
"Hola".toLowerCase()     // "hola"
"Hola Mundo".includes("Mundo") // true
"Hola".slice(0, 2)       // "Ho"
\`\`\`

## Template Literals
\`\`\`javascript
let nombre = "Ana";
\`Hola, \${nombre}!\`  // "Hola, Ana!"
\`\`\`
        `,
        challenge: {
          title: "Formatea un saludo",
          description: "Crea 'nombre' = \"Carlos\". Crea 'saludo' con template literal: \"Hola, Carlos!\"",
          hints: [
            "Usa backticks: ` `",
            "\\${variable} inserta el valor"
          ],
          tests: [
            { code: "nombre === 'Carlos'", description: "nombre debe ser 'Carlos'" },
            { code: "saludo === 'Hola, Carlos!'", description: "saludo debe ser 'Hola, Carlos!'" }
          ]
        }
      }
    ]
  },

  // MÓDULO 2: Control Flow
  controlFlow: {
    title: "Control de Flujo",
    description: "Aprende a controlar el flujo de tu código",
    icon: "🔀",
    lessons: [
      {
        id: "js-ifelse",
        title: "Condicionales if/else",
        type: "lesson",
        theory: `
# Condicionales

## if básico
\`\`\`javascript
let edad = 18;
if (edad >= 18) {
  console.log("Mayor de edad");
}
\`\`\`

## if/else
\`\`\`javascript
if (edad >= 18) {
  console.log("Adulto");
} else {
  console.log("Menor");
}
\`\`\`

## else if
\`\`\`javascript
let nota = 85;
if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 70) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}
\`\`\`

## Operador Ternario
\`\`\`javascript
let tipo = edad >= 18 ? "adulto" : "menor";
\`\`\`
        `,
        challenge: {
          title: "Clasificador de números",
          description: "'numero' = 15. 'resultado' = \"positivo\" si > 0, \"negativo\" si < 0, \"cero\" si === 0.",
          hints: [
            "Usa if, else if, else",
            "Compara con === 0 para cero"
          ],
          tests: [
            { code: "numero === 15", description: "numero debe ser 15" },
            { code: "resultado === 'positivo'", description: "resultado debe ser 'positivo'" }
          ]
        }
      },
      {
        id: "js-switch",
        title: "Sentencia Switch",
        type: "lesson",
        theory: `
# Switch

Alternativa a múltiples if/else.

## Estructura
\`\`\`javascript
let dia = "lunes";
switch (dia) {
  case "lunes":
    console.log("Inicio");
    break;
  case "viernes":
    console.log("¡Viernes!");
    break;
  default:
    console.log("Otro día");
}
\`\`\`

## Fall-through
\`\`\`javascript
switch (tipo) {
  case "fruta":
  case "verdura":
    console.log("Saludable");
    break;
}
\`\`\`
        `,
        challenge: {
          title: "Día de la semana",
          description: "'dia' = \"martes\". 'mensaje': \"lunes\"→\"Inicio\", \"martes\"→\"Segundo día\", otros→\"Otro día\".",
          hints: [
            "Usa switch con case",
            "No olvides el break"
          ],
          tests: [
            { code: "dia === 'martes'", description: "dia debe ser 'martes'" },
            { code: "mensaje === 'Segundo día'", description: "mensaje debe ser 'Segundo día'" }
          ]
        }
      },
      {
        id: "js-for",
        title: "Bucle for",
        type: "lesson",
        theory: `
# Bucle for

Repite código un número de veces.

## Estructura
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
\`\`\`

## Ejemplos
\`\`\`javascript
// Contar 1-5
for (let i = 1; i <= 5; i++) { }

// De 2 en 2
for (let i = 0; i <= 10; i += 2) { }

// Recorrer array
let frutas = ["manzana", "pera"];
for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}
\`\`\`

## for...of
\`\`\`javascript
for (let fruta of frutas) {
  console.log(fruta);
}
\`\`\`
        `,
        challenge: {
          title: "Suma los primeros N",
          description: "Suma números del 1 al 10 con for. Guarda en 'suma'. Debe dar 55.",
          hints: [
            "Inicializa suma = 0",
            "suma += i en cada iteración",
            "Bucle de 1 a 10"
          ],
          tests: [
            { code: "suma === 55", description: "suma debe ser 55" }
          ]
        }
      },
      {
        id: "js-while",
        title: "Bucle while",
        type: "lesson",
        theory: `
# while

Repite mientras la condición sea true.

## Estructura
\`\`\`javascript
let count = 1;
while (count <= 5) {
  console.log(count);
  count++;
}
\`\`\`

## do...while
\`\`\`javascript
let i = 1;
do {
  console.log(i);
  i++;
} while (i <= 5);
// Siempre ejecuta al menos una vez
\`\`\`

## Cuidado con bucles infinitos
\`\`\`javascript
// ❌while (true) { } // ¡Nunca hace esto!
\`\`\`
        `,
        challenge: {
          title: "Primer múltiplo de 3",
          description: "Encuentra el primer múltiplo de 3 >= 100. Guarda en 'resultado'. (Debe ser 102)",
          hints: [
            "Usa while (resultado < 100)",
            "Incrementa de 3 en 3"
          ],
          tests: [
            { code: "resultado === 102", description: "resultado debe ser 102" }
          ]
        }
      }
    ]
  },

  // MÓDULO 3: Funciones
  functions: {
    title: "Funciones",
    description: "Aprende a crear y usar funciones",
    icon: "⚡",
    lessons: [
      {
        id: "js-functions-basic",
        title: "Funciones Básicas",
        type: "lesson",
        theory: `
# Funciones

Bloques de código reutilizables.

## Declaración
\`\`\`javascript
function saludar() {
  console.log("¡Hola!");
}
saludar();
\`\`\`

## Con parámetros
\`\`\`javascript
function saludarPersona(nombre) {
  return "¡Hola, " + nombre + "!";
}
saludarPersona("Ana"); // "¡Hola, Ana!"
\`\`\`

## Return
\`\`\`javascript
function sumar(a, b) {
  return a + b;
}
sumar(3, 5); // 8
\`\`\`

## Parámetros por defecto
\`\`\`javascript
function greet(nombre = "Mundo") {
  return "Hola, " + nombre;
}
\`\`\`
        `,
        challenge: {
          title: "Función multiplicar",
          description: "Crea 'multiplicar(a, b)' que retorne a * b. Llama multiplicar(4, 5) y guarda en 'resultado'.",
          hints: [
            "function multiplicar(a, b) { return a * b; }",
            "let resultado = multiplicar(4, 5);"
          ],
          tests: [
            { code: "typeof multiplicar === 'function'", description: "multiplicar debe ser función" },
            { code: "resultado === 20", description: "resultado debe ser 20" }
          ]
        }
      },
      {
        id: "js-arrow-functions",
        title: "Arrow Functions",
        type: "lesson",
        theory: `
# Arrow Functions

Sintaxis más corta para funciones.

## Básica
\`\`\`javascript
// Tradicional
function sumar(a, b) { return a + b; }

// Arrow
const sumar = (a, b) => a + b;
\`\`\`

## Con cuerpo
\`\`\`javascript
const saludar = (nombre) => {
  return "Hola, " + nombre;
};
\`\`\`

## Return implícito
\`\`\`javascript
const duplicar = x => x * 2;
\`\`\`

## Sin parámetros
\`\`\`javascript
const getDate = () => new Date();
\`\`\`
        `,
        challenge: {
          title: "Arrow: esPar",
          description: "Crea arrow function 'esPar(n)' que retorne true si n es par. Verifica esPar(4).",
          hints: [
            "const esPar = (n) => n % 2 === 0",
            "Guarda esPar(4) en resultado"
          ],
          tests: [
            { code: "typeof esPar === 'function'", description: "esPar debe ser función" },
            { code: "resultado === true", description: "resultado debe ser true" }
          ]
        }
      },
      {
        id: "js-scope",
        title: "Scope y Closures",
        type: "lesson",
        theory: `
# Scope

El scope determina dónde las variables son accesibles.

## Variable Scope
\`\`\`javascript
let global = "todas";

function miFunc() {
  let local = "solo aquí";
  console.log(global); // ✅
}
console.log(global);   // ✅
console.log(local);    // ❌ Error
\`\`\`

# Closures

Una función "recuerda" variables de su scope exterior.

\`\`\`javascript
function crearContador() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const contador = crearContador();
contador(); // 1
contador(); // 2
\`\`\`
        `,
        challenge: {
          title: "Contador con closure",
          description: "Crea 'crearContador' que retorne función. Cada llamada incrementa contador interno.",
          hints: [
            "let count = 0 dentro de crearContador",
            "return function() { count++; return count; }"
          ],
          tests: [
            { code: "typeof crearContador === 'function'", description: "crearContador debe ser función" },
            { code: "typeof contador1 === 'function'", description: "contador1 debe ser función" },
            { code: "contador1() === 1", description: "Primera llamada = 1" },
            { code: "contador1() === 2", description: "Segunda llamada = 2" }
          ]
        }
      }
    ]
  },

  // MÓDULO 4: Arrays y Objetos
  arraysObjects: {
    title: "Arrays y Objetos",
    description: "Estructuras de datos fundamentales",
    icon: "📦",
    lessons: [
      {
        id: "js-arrays",
        title: "Arrays",
        type: "lesson",
        theory: `
# Arrays

Listas ordenadas de elementos.

## Crear
\`\`\`javascript
let frutas = ["manzana", "pera", "uva"];
let numeros = [1, 2, 3, 4, 5];
\`\`\`

## Acceder
\`\`\`javascript
frutas[0]  // "manzana"
numeros[2]  // 3
frutas.length // 3
\`\`\`

## Modificar
\`\`\`javascript
frutas.push("kiwi");     // Añadir al final
frutas.pop();            // Quitar del final
frutas.unshift("fresa"); // Añadir al inicio
frutas.shift();          // Quitar del inicio
\`\`\`

## Recorrer
\`\`\`javascript
for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}

for (let fruta of frutas) {
  console.log(fruta);
}
\`\`\`
        `,
        challenge: {
          title: "Manipula un array",
          description: "Crea 'numeros' = [1, 2, 3]. Añade 4 con push(). Guarda longitud en 'longitud'.",
          hints: [
            "let numeros = [1, 2, 3];",
            "numeros.push(4);",
            "longitud = numeros.length;"
          ],
          tests: [
            { code: "Array.isArray(numeros)", description: "numeros debe ser array" },
            { code: "numeros.includes(4)", description: "Debe contener 4" },
            { code: "longitud === 4", description: "longitud debe ser 4" }
          ]
        }
      },
      {
        id: "js-array-methods",
        title: "Métodos de Arrays",
        type: "lesson",
        theory: `
# Métodos de Arrays

## map - Transformar
\`\`\`javascript
[1, 2, 3].map(n => n * 2); // [2, 4, 6]
\`\`\`

## filter - Filtrar
\`\`\`javascript
[1, 2, 3, 4, 5].filter(n => n > 2); // [3, 4, 5]
\`\`\`

## reduce - Reducir a un valor
\`\`\`javascript
[1, 2, 3, 4].reduce((acc, n) => acc + n, 0); // 10
\`\`\`

## find - Encontrar
\`\`\`javascript
[1, 2, 3].find(n => n > 1); // 2
\`\`\`

## some y every
\`\`\`javascript
[2, 4, 6].some(n => n > 5);   // true
[2, 4, 6].every(n => n > 5);  // false
\`\`\`
        `,
        challenge: {
          title: "Transforma y filtra",
          description: "Dado [1,2,3,4,5,6]: duplica con map(), filtra > 6. Resultado: [8,10,12]",
          hints: [
            "[1,2,3,4,5,6].map(n => n * 2)",
            "Encadena .filter(n => n > 6)"
          ],
          tests: [
            { code: "JSON.stringify(resultado) === '[8,10,12]'", description: "resultado debe ser [8,10,12]" }
          ]
        }
      },
      {
        id: "js-objects",
        title: "Objetos",
        type: "lesson",
        theory: `
# Objetos

Colecciones de pares clave-valor.

## Crear
\`\`\`javascript
let persona = {
  nombre: "Ana",
  edad: 28,
  ciudad: "Lima"
};
\`\`\`

## Acceder
\`\`\`javascript
persona.nombre     // "Ana"
persona["edad"]     // 28
\`\`\`

## Modificar
\`\`\`javascript
persona.edad = 29;
persona.pais = "Chile";
\`\`\`

## Métodos
\`\`\`javascript
let persona = {
  nombre: "Ana",
  saludar: function() {
    return "Hola, soy " + this.nombre;
  }
};
persona.saludar(); // "Hola, soy Ana"
\`\`\`

## Destructuring
\`\`\`javascript
const { nombre, edad } = persona;
\`\`\`
        `,
        challenge: {
          title: "Crea tu primer objeto",
          description: "Crea 'libro' con titulo=\"El Principito\", autor=\"Saint-Exupéry\", año=1943. Método resumen().",
          hints: [
            "this.titulo, this.autor, this.año",
            "resumen: function() { return ... }"
          ],
          tests: [
            { code: "typeof libro === 'object'", description: "libro debe ser objeto" },
            { code: "libro.titulo === 'El Principito'", description: "titulo correcto" },
            { code: "typeof libro.resumen === 'function'", description: "resumen debe ser función" },
            { code: "libro.resumen() === 'El Principito de Antoine de Saint-Exupéry (1943)'", description: "resumen correcto" }
          ]
        }
      }
    ]
  }
};
