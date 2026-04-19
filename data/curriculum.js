/**
 * Currículo de JavaScript - Lecciones y Desafíos con Soluciones
 */

export const curriculum = {
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
            "Usa let para nombre y edad, const para pais",
            "Los strings van entre comillas: \"valor\"",
            "Los números van sin comillas: 25"
          ],
          solution: `let nombre = "María";
let edad = 25;
const pais = "Chile";`,
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
            "Strings usan comillas: \"JavaScript\"",
            "Los booleanos son true o false SIN comillas",
            "Los números van sin comillas"
          ],
          solution: `let lenguaje = "JavaScript";
let version = 2024;
let esGenial = true;`,
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
5 + 3    // 8 (suma)
5 - 3    // 2 (resta)
5 * 3    // 15 (multiplicación)
5 / 3    // 1.67 (división)
5 % 3    // 2 (módulo - resto)
5 ** 3   // 125 (potencia)
\`\`\`

## Comparación
\`\`\`javascript
5 == "5"   // true (igualdad débil)
5 === "5"  // false (igualdad estricta)
5 !== "5"  // true (desigualdad estricta)
3 > 2      // true (mayor que)
3 < 2      // false (menor que)
3 >= 3     // true (mayor o igual)
\`\`\`

## Lógicos
\`\`\`javascript
true && false  // false (AND - y)
true || false  // true (OR - o)
!true          // false (NOT - no)
\`\`\`

## Asignación
\`\`\`javascript
let x = 5;
x += 3;  // x = 8 (x = x + 3)
x -= 2;  // x = 6 (x = x - 2)
\`\`\`
        `,
        challenge: {
          title: "Calcula el área",
          description: "Crea 'base' = 10, 'altura' = 5, calcula 'area' = base * altura.",
          hints: [
            "Multiplicación usa el símbolo *",
            "El resultado se guarda en la variable 'area'"
          ],
          solution: `let base = 10;
let altura = 5;
let area = base * altura;`,
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

## Propiedades básicas
\`\`\`javascript
let texto = "Hola";
texto.length        // 4
texto[0]            // "H" (primer carácter)
texto[texto.length - 1] // "a" (último)
\`\`\`

## Métodos comunes
\`\`\`javascript
"Hola".toUpperCase()      // "HOLA"
"Hola".toLowerCase()      // "hola"
"Hola Mundo".includes("Mundo") // true
"Hola".slice(0, 2)        // "Ho"
"Hola".trim()             // "Hola" sin espacios
\`\`\`

## Template Literals (Plantillas)
\`\`\`javascript
let nombre = "Ana";
let edad = 25;

// Con backticks (comillas invertidas):
\`Hola, \${nombre}! Tengo \${edad} años.\`
// Resultado: "Hola, Ana! Tengo 25 años."
\`\`\`

## Concatenación tradicional
\`\`\`javascript
"Hola, " + nombre + "!"  // "Hola, Ana!"
\`\`\`
        `,
        challenge: {
          title: "Formatea un saludo",
          description: "Crea 'nombre' = \"Carlos\". Crea 'saludo' con template literal: \"Hola, Carlos!\"",
          hints: [
            "Usa backticks ( ` ) no comillas normales",
            "\\${variable} inserta el valor de la variable"
          ],
          solution: `let nombre = "Carlos";
let saludo = \`Hola, \${nombre}!\`;`,
          tests: [
            { code: "nombre === 'Carlos'", description: "nombre debe ser 'Carlos'" },
            { code: "saludo === 'Hola, Carlos!'", description: "saludo debe ser 'Hola, Carlos!'" }
          ]
        }
      }
    ]
  },

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
# Condicionales if/else

Los condicionales permiten ejecutar código basado en condiciones.

## if básico
\`\`\`javascript
let edad = 18;

if (edad >= 18) {
  console.log("Eres mayor de edad");
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

## else if (múltiples condiciones)
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
let edad = 20;
let tipo = edad >= 18 ? "adulto" : "menor";
// tipo = "adulto"
\`\`\`
        `,
        challenge: {
          title: "Clasificador de números",
          description: "'numero' = 15. 'resultado' = \"positivo\" si > 0, \"negativo\" si < 0, \"cero\" si === 0.",
          hints: [
            "Usa if para > 0, else if para < 0, else para 0",
            "Compara con === 0 para verificar si es exactamente cero"
          ],
          solution: `let numero = 15;
let resultado;

if (numero > 0) {
  resultado = "positivo";
} else if (numero < 0) {
  resultado = "negativo";
} else {
  resultado = "cero";
}`,
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

Switch es una alternativa a múltiples if/else.

## Estructura básica
\`\`\`javascript
let dia = "lunes";

switch (dia) {
  case "lunes":
    console.log("Inicio de semana");
    break;
  case "viernes":
    console.log("¡Por fin viernes!");
    break;
  case "sábado":
  case "domingo":
    console.log("¡Fin de semana!");
    break;
  default:
    console.log("Día no reconocido");
}
\`\`\`

## Puntos importantes
- **break** evita que el código "caiga" al siguiente case
- **default** se ejecuta si ningún case coincide
- Usa === para comparar (comparación estricta)
        `,
        challenge: {
          title: "Día de la semana",
          description: "'dia' = \"martes\". 'mensaje': \"lunes\"→\"Inicio\", \"martes\"→\"Segundo día\", otros→\"Otro día\".",
          hints: [
            "Usa switch(dia) con case \"valor\":",
            "No olvides el break en cada case"
          ],
          solution: `let dia = "martes";
let mensaje;

switch (dia) {
  case "lunes":
    mensaje = "Inicio";
    break;
  case "martes":
    mensaje = "Segundo día";
    break;
  default:
    mensaje = "Otro día";
}`,
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

El bucle for repite código un número específico de veces.

## Estructura
\`\`\`javascript
for (inicialización; condición; actualización) {
  // código a repetir
}
\`\`\`

## Ejemplos
\`\`\`javascript
// Contar de 1 a 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// Contar de 5 a 1
for (let i = 5; i >= 1; i--) {
  console.log(i);
}

// De 2 en 2
for (let i = 0; i <= 10; i += 2) {
  console.log(i); // 0, 2, 4, 6, 8, 10
}
\`\`\`

## Recorrer arrays
\`\`\`javascript
let frutas = ["manzana", "pera", "uva"];

for (let i = 0; i < frutas.length; i++) {
  console.log(frutas[i]);
}

// Versión moderna: for...of
for (let fruta of frutas) {
  console.log(fruta);
}
\`\`\`

## break y continue
\`\`\`javascript
for (let i = 1; i <= 10; i++) {
  if (i === 5) break;   // Sale del bucle
  if (i === 3) continue; // Salta esta iteración
  console.log(i);
}
\`\`\`
        `,
        challenge: {
          title: "Suma los primeros N",
          description: "Suma números del 1 al 10 con for. Guarda en 'suma'. Debe dar 55.",
          hints: [
            "Inicializa suma = 0 antes del bucle",
            "En cada iteración: suma += i",
            "El bucle va de 1 a 10: i = 1; i <= 10; i++"
          ],
          solution: `let suma = 0;

for (let i = 1; i <= 10; i++) {
  suma += i;
}
// suma = 55`,
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

while repite código mientras una condición sea verdadera.

## Estructura
\`\`\`javascript
while (condición) {
  // código a repetir
}
\`\`\`

## Ejemplo básico
\`\`\`javascript
let count = 1;

while (count <= 5) {
  console.log(count);
  count++;
}
// Imprime: 1, 2, 3, 4, 5
\`\`\`

## ⚠️ Cuidado con bucles infinitos
\`\`\`javascript
// ❌ NUNCA hagas esto:
// while (true) {
//   console.log("¡Infinity!");
// }

// Siempre incluye una forma de salir
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
        `,
        challenge: {
          title: "Primer múltiplo de 3",
          description: "Encuentra el primer múltiplo de 3 >= 100. Guarda en 'resultado'. (Debe ser 102)",
          hints: [
            "Inicializa resultado = 0",
            "Usa while (resultado < 100)",
            "Incrementa de 3 en 3: resultado += 3"
          ],
          solution: `let resultado = 0;

while (resultado < 100) {
  resultado += 3;
}
// resultado = 102`,
          tests: [
            { code: "resultado === 102", description: "resultado debe ser 102" }
          ]
        }
      }
    ]
  },

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

Las funciones son bloques de código reutilizables.

## Declaración
\`\`\`javascript
function saludar() {
  console.log("¡Hola!");
}

saludar(); // Llamar la función
\`\`\`

## Con parámetros
\`\`\`javascript
function saludarPersona(nombre) {
  return "¡Hola, " + nombre + "!";
}

saludarPersona("Ana"); // "¡Hola, Ana!"
saludarPersona("Carlos"); // "¡Hola, Carlos!"
\`\`\`

## Return (devolver valores)
\`\`\`javascript
function sumar(a, b) {
  return a + b;
}

let resultado = sumar(3, 5); // 8
\`\`\`

## Parámetros por defecto
\`\`\`javascript
function greet(nombre = "Mundo") {
  return "Hola, " + nombre;
}

greet();           // "Hola, Mundo"
greet("Ana");      // "Hola, Ana"
\`\`\`
        `,
        challenge: {
          title: "Función multiplicar",
          description: "Crea 'multiplicar(a, b)' que retorne a * b. Llama multiplicar(4, 5) y guarda en 'resultado'.",
          hints: [
            "Usa function multiplicar(a, b) { ... }",
            "Dentro usa return a * b;",
            "Llama la función: let resultado = multiplicar(4, 5);"
          ],
          solution: `function multiplicar(a, b) {
  return a * b;
}

let resultado = multiplicar(4, 5);`,
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
# Arrow Functions (Funciones Flecha)

Una sintaxis más corta para escribir funciones.

## Sintaxis básica
\`\`\`javascript
// Función tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;
\`\`\`

## Con un parámetro
\`\`\`javascript
// Con paréntesis
const duplicar = (x) => x * 2;

// Sin paréntesis (solo un parámetro)
const duplicar = x => x * 2;
\`\`\`

## Con cuerpo de función
\`\`\`javascript
const saludar = (nombre) => {
  const mensaje = "Hola, " + nombre;
  return mensaje;
};
\`\`\`

## Return implícito
\`\`\`javascript
//Llaves = return explícito
const getSquared = (n) => {
  return n * n;
};

// Sin llaves = return implícito
const getSquared = (n) => n * n;
\`\`\`
        `,
        challenge: {
          title: "Arrow: esPar",
          description: "Crea arrow function 'esPar(n)' que retorne true si n es par. Verifica esPar(4).",
          hints: [
            "Usa const esPar = (n) => ...",
            "El módulo: n % 2 === 0",
            "Guarda esPar(4) en resultado"
          ],
          solution: `const esPar = (n) => n % 2 === 0;

let resultado = esPar(4);`,
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
# Scope (Alcance)

El scope determina dónde las variables son accesibles.

## Variable Scope
\`\`\`javascript
// Variable global
let globalVar = "Estoy en todas partes";

function miFuncion() {
  // Variable local
  let localVar = "Solo existo aquí";
  console.log(globalVar); // ✅ Accesible
  console.log(localVar);  // ✅ Accesible
}

console.log(globalVar); // ✅ Accesible
console.log(localVar);  // ❌ Error
\`\`\`

# Closures

Una función "recuerda" las variables de su scope exterior.

\`\`\`javascript
function crearContador() {
  let count = 0; // Variable privada
  
  return function() {
    count++;
    return count;
  };
}

const contador = crearContador();
contador(); // 1
contador(); // 2
contador(); // 3
// count es privado, no se puede acceder directamente
\`\`\`
        `,
        challenge: {
          title: "Contador con closure",
          description: "Crea 'crearContador' que retorne función. Cada llamada incrementa contador interno.",
          hints: [
            "Usa let count = 0 dentro de crearContador",
            "Retorna una función: return function() { ... }",
            "La función interna debe hacer count++ y return count"
          ],
          solution: `function crearContador() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

let contador1 = crearContador();`,
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

Los arrays son listas ordenadas de elementos.

## Crear arrays
\`\`\`javascript
let frutas = ["manzana", "pera", "uva"];
let numeros = [1, 2, 3, 4, 5];
let mixto = [1, "hola", true, null];
\`\`\`

## Acceder elementos
\`\`\`javascript
let arr = ["a", "b", "c"];
arr[0]              // "a" (primer elemento)
arr[2]              // "c" (tercer elemento)
arr.length          // 3 (longitud del array)
arr[arr.length - 1] // "c" (último elemento)
\`\`\`

## Modificar arrays
\`\`\`javascript
let arr = [1, 2, 3];

arr.push(4);     // Añadir al final: [1,2,3,4]
arr.pop();        // Quitar del final: [1,2,3]
arr.unshift(0);   // Añadir al inicio: [0,1,2,3]
arr.shift();      // Quitar del inicio: [1,2,3]
\`\`\`

## Recorrer arrays
\`\`\`javascript
let nums = [1, 2, 3];

// for clásico
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}

// for...of (más moderno)
for (let num of nums) {
  console.log(num);
}
\`\`\`
        `,
        challenge: {
          title: "Manipula un array",
          description: "Crea 'numeros' = [1, 2, 3]. Añade 4 con push(). Guarda longitud en 'longitud'.",
          hints: [
            "Crea el array: let numeros = [1, 2, 3];",
            "Usa numeros.push(4) para añadir al final",
            "Guarda la longitud: let longitud = numeros.length;"
          ],
          solution: `let numeros = [1, 2, 3];
numeros.push(4);
let longitud = numeros.length;`,
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

## map - Transformar elementos
\`\`\`javascript
[1, 2, 3].map(n => n * 2); // [2, 4, 6]
\`\`\`

## filter - Filtrar elementos
\`\`\`javascript
[1, 2, 3, 4, 5].filter(n => n > 2); // [3, 4, 5]
\`\`\`

## reduce - Reducir a un valor
\`\`\`javascript
[1, 2, 3, 4].reduce((acumulador, n) => acumulador + n, 0); // 10
\`\`\`

## find - Encontrar primer elemento
\`\`\`javascript
[1, 2, 3, 4].find(n => n > 2); // 3
\`\`\`

## some y every
\`\`\`javascript
[2, 4, 6].some(n => n > 5);   // true (¿alguno?)
[2, 4, 6].every(n => n > 5);  // false (¿todos?)
\`\`\`

## Encadenar métodos
\`\`\`javascript
[1, 2, 3, 4, 5]
  .filter(n => n % 2 === 0)  // [2, 4]
  .map(n => n * 10)          // [20, 40]
\`\`\`
        `,
        challenge: {
          title: "Transforma y filtra",
          description: "Dado [1,2,3,4,5,6]: duplica con map(), filtra los > 6. Resultado: [8,10,12]",
          hints: [
            "Primero usa .map(n => n * 2)",
            "Luego encadena .filter(n => n > 6)",
            "El resultado debe guardarse en 'resultado'"
          ],
          solution: `let numeros = [1, 2, 3, 4, 5, 6];
let resultado = numeros
  .map(n => n * 2)
  .filter(n => n > 6);`,
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

Los objetos son colecciones de pares clave-valor.

## Crear objetos
\`\`\`javascript
let persona = {
  nombre: "Ana",
  edad: 28,
  ciudad: "Lima"
};
\`\`\`

## Acceder propiedades
\`\`\`javascript
// Notación de punto
persona.nombre    // "Ana"

// Notación de corchetes
persona["edad"]   // 28
\`\`\`

## Modificar objetos
\`\`\`javascript
persona.edad = 29;       // Modificar
persona.pais = "Chile";   // Añadir nueva
delete persona.ciudad;    // Eliminar
\`\`\`

## Métodos en objetos
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
let persona = { nombre: "Ana", edad: 28 };

// Extraer propiedades
const { nombre, edad } = persona;
\`\`\`
        `,
        challenge: {
          title: "Crea tu primer objeto",
          description: "Crea 'libro' con titulo=\"El Principito\", autor=\"Antoine de Saint-Exupéry\", año=1943. Añade método resumen().",
          hints: [
            "Crea el objeto con { clave: valor }",
            "this.titulo, this.autor, this.año para acceder",
            "resumen: function() { return \\`\\${this.titulo} de \\${this.autor} (\\${this.año})\\`; }"
          ],
          solution: `let libro = {
  titulo: "El Principito",
  autor: "Antoine de Saint-Exupéry",
  año: 1943,
  resumen: function() {
    return \`\${this.titulo} de \${this.autor} (\${this.año})\`;
  }
};`,
          tests: [
            { code: "typeof libro === 'object'", description: "libro debe ser objeto" },
            { code: "libro.titulo === 'El Principito'", description: "titulo debe ser correcto" },
            { code: "typeof libro.resumen === 'function'", description: "resumen debe ser función" },
            { code: "libro.resumen() === 'El Principito de Antoine de Saint-Exupéry (1943)'", description: "resumen debe retornar texto correcto" }
          ]
        }
      }
    ]
  }
};
