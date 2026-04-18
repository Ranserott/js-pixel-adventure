/**
 * Niveles del juego - Definición completa de desafíos
 * Cada nivel enseña un concepto de JavaScript con historia y objetivos claros
 */

export const levels = [
  {
    id: 1,
    name: "El Primer Paso",
    story: "⚔️ ¡Bienvenido, joven programador! El caballero Pixel está atrapado en la mazmorra del Castillo Código. Debe dar exactamente 3 pasos para alcanzar la puerta de salida. ¡Ayúdalo con tu primer código!",
    objective: "Usa la función move() para avanzar exactamente 3 pasos",
    hint: "💡 La función move(número) mueve al personaje. Por ejemplo: move(1) avanza 1 paso",
    solution: "move(3);",
    expectedState: { position: 3 },
    concept: "Función move()",
    description: "Aprende a usar la función move() para mover al personaje",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 3,
    theme: "forest",
    obstacles: []
  },
  {
    id: 2,
    name: "Variables al Rescate",
    story: "🌲 El caballero Pixel llegó al Bosque de las Variables. Un hada le dijo que guarde su posición en una variable llamada 'pasos' para no olvidarla. ¡Las variables son como cajas donde guardamos valores!",
    objective: "Crea una variable 'pasos' con valor 5 usando let, luego muévete esa cantidad",
    hint: "💡 Primero declara: let pasos = 5; (esto guarda el número 5 en una caja llamada 'pasos')",
    solution: "let pasos = 5;\nmove(pasos);",
    expectedState: { position: 5 },
    concept: "Variables con let",
    description: "Aprende a crear y usar variables con let",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 5,
    theme: "forest"
  },
  {
    id: 3,
    name: "Constantes Mágicas",
    story: "🏰 El tesoro del castillo está protegido por un hechizo. El número de pasos está escrito en un pergamino mágico: ¡4! Este valor NUNCA cambia, es una constante. Las constantes son como cajas selladas.",
    objective: "Usa const para definir el número de pasos (= 4) y avanza",
    hint: "💡 Las constantes se declaran con const: const pasos = 4;",
    solution: "const pasos = 4;\nmove(pasos);",
    expectedState: { position: 4 },
    concept: "Variables con const",
    description: "Aprende la diferencia entre let y const",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 4,
    theme: "castle"
  },
  {
    id: 4,
    name: "Puente Levadizo",
    story: "🌉 El puente levadizo está cerrado con una trampa. Solo se abre si el valor es MAYOR que 5. Si la posición es mayor a 5, ¡el puente se levanta! El caballero necesita 6 puntos de poder para cruzar.",
    objective: "Usa un condicional if para verificar si 6 > 5, y si es true, avanza 3 pasos",
    hint: "💡 if (condición) { código a ejecutar si es verdadero }",
    solution: "let poder = 6;\nif (poder > 5) {\n  move(3);\n}",
    expectedState: { position: 3, conditionMet: true },
    concept: "Condicional if",
    description: "Aprende a usar condicionales if",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 3,
    theme: "bridge"
  },
  {
    id: 5,
    name: "Caminata en el Bosque",
    story: "🌲🌲 El bosque es muy extenso. El caballero debe avanzar 5 pasos, pero cuenta mejor: ¡1, 2, 3, 4, 5! Un bucle for es como un contador automático que repite acciones.",
    objective: "Usa un bucle for para avanzar 1 paso 5 veces (total: 5 pasos)",
    hint: "💡 for (let i = 0; i < 5; i++) { move(1); } - Esto repite move(1) exactamente 5 veces",
    solution: "for (let i = 0; i < 5; i++) {\n  move(1);\n}",
    expectedState: { position: 5 },
    concept: "Bucle for",
    description: "Aprende a usar el bucle for para repetir acciones",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 5,
    theme: "forest"
  },
  {
    id: 6,
    name: "Mensaje Secreto",
    story: "📜 El escriba necesita enviar un mensaje al rey. ¡El caballero puede usar console.log() para mostrar mensajes! Es como gritar algo que todos pueden escuchar.",
    objective: "Usa console.log() para imprimir exactamente: '¡Hola, rey!'",
    hint: "💡 console.log('tu mensaje aquí'); - El mensaje debe ir entre comillas",
    solution: "console.log('¡Hola, rey!');",
    expectedState: { messageLogged: true, loggedText: "¡Hola, rey!" },
    concept: "console.log()",
    description: "Aprende a mostrar mensajes con console.log",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 0,
    theme: "castle",
    requiresOutput: true
  },
  {
    id: 7,
    name: "Escalera del Castillo",
    story: "🏰 La escalera del castillo tiene escalones infinitos. El caballero sube mientras tenga energía (escalones < 4). Cuando llega a 4, está tan cansado que se detiene. ¡El bucle while hace esto posible!",
    objective: "Usa un bucle while para subir exactamente 4 escalones",
    hint: "💡 while (condicion) { hacer algo; aumentar contador; }",
    solution: "let escalones = 0;\nwhile (escalones < 4) {\n  move(1);\n  escalones = escalones + 1;\n}",
    expectedState: { position: 4 },
    concept: "Bucle while",
    description: "Aprende el bucle while que se repite mientras la condición sea verdadera",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 4,
    theme: "castle"
  },
  {
    id: 8,
    name: "Función Mágica",
    story: "✨ El mago del reino creó una función llamada 'avanzar' que mueve 2 pasos. Las funciones son como hechizos mágicos: los creas una vez y los usas cuando quieras. ¡Sin repetir código!",
    objective: "Crea una función 'avanzar' que mueva 2 pasos, luego llámala",
    hint: "💡 function nombre() { código } - Para llamarla: nombre();",
    solution: "function avanzar() {\n  move(2);\n}\navanzar();",
    expectedState: { position: 2 },
    concept: "Funciones",
    description: "Aprende a crear y usar funciones",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 2,
    theme: "magic"
  },
  {
    id: 9,
    name: "Parámetros Mágicos",
    story: "⚡ El mago supremo descubrió que las funciones pueden recibir 'parámetros': valores que les pasas desde afuera. Así la misma función puede hacer cosas diferentes según el valor.",
    objective: "Crea una función 'moverMagia' que acepte un parámetro 'pasos' y mueva esa cantidad",
    hint: "💡 function nombre(parametro) { usar parametro } - nombre(3) usa el 3",
    solution: "function moverMagia(pasos) {\n  move(pasos);\n}\nmoverMagia(3);",
    expectedState: { position: 3 },
    concept: "Parámetros de función",
    description: "Aprende a usar parámetros en funciones",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 3,
    theme: "magic"
  },
  {
    id: 10,
    name: "El Reto Final",
    story: "🐉 ¡El dragón final espera! Para derrotarlo, el caballero debe combinar todo lo aprendido: variables, condicionales, bucles y funciones. ¡Demuestra que eres un verdadero programador!",
    objective: "Crea una variable 'pasos' = 4, una función 'atacar' que mueva 1 paso, y usa un loop para llamar atacar() 4 veces",
    hint: "💡 Combina todo: let para variable, function para nombrar código, for para repetir",
    solution: "let pasos = 4;\n\nfunction atacar() {\n  move(1);\n}\n\nfor (let i = 0; i < pasos; i++) {\n  atacar();\n}",
    expectedState: { position: 4 },
    concept: "Reto final - ¡Combina todo!",
    description: "Pon a prueba todo lo aprendido en un desafío final",
    gridSize: 10,
    startPosition: 0,
    character: "wizard",
    goalPosition: 4,
    theme: "boss"
  }
];

// Tema visual para cada nivel
export const themes = {
  dungeon: {
    name: "Mazmorra",
    background: "#1a1a2e",
    ground: "#2d2d44",
    accent: "#e94560",
    decoration: "🧱"
  },
  forest: {
    name: "Bosque",
    background: "#1a2e1a",
    ground: "#2d442d",
    accent: "#27ae60",
    decoration: "🌲"
  },
  castle: {
    name: "Castillo",
    background: "#2e1a2e",
    ground: "#442d44",
    accent: "#9b59b6",
    decoration: "🏰"
  },
  bridge: {
    name: "Puente",
    background: "#2e2e1a",
    ground: "#44442d",
    accent: "#f39c12",
    decoration: "🌉"
  },
  magic: {
    name: "Magia",
    background: "#1a1a2e",
    ground: "#2d2d44",
    accent: "#3498db",
    decoration: "✨"
  },
  boss: {
    name: "Boss Final",
    background: "#2e1a1a",
    ground: "#442d2d",
    accent: "#e74c3c",
    decoration: "🐉"
  }
};

// Función helper para obtener nivel por ID
export function getLevelById(id) {
  return levels.find(level => level.id === id);
}

// Función helper para obtener el siguiente nivel
export function getNextLevel(currentId) {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null;
}

// Función helper para obtener nivel anterior
export function getPrevLevel(currentId) {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex > 0) {
    return levels[currentIndex - 1];
  }
  return null;
}
