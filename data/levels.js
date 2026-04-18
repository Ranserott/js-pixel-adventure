/**
 * Niveles 2D del juego - Maze + Recolectar estrellas
 */

export const levels = [
  {
    id: 1,
    name: "Primer Paso",
    story: "🧙‍♂️ ¡El mago debe moverse a la derecha para encontrar el camino! Mueve 3 pasos hacia la derecha para llegar a la puerta mágica.",
    objective: "Usa move(\"right\", 3) para moverte 3 pasos a la derecha",
    hint: '💡 move("right", 3) mueve el mago 3 espacios a la derecha',
    solution: 'move("right", 3);',
    targetPosition: { x: 3, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "forest",
    concept: "Movimiento right"
  },
  {
    id: 2,
    name: "Variables Mágicas",
    story: "✨ El mago encontró un mapa del tesoro. Usa una variable para recordar cuántos pasos debe dar.",
    objective: "Crea una variable 'pasos' con valor 3 y muévete esa cantidad",
    hint: '💡 let pasos = 3; luego move("right", pasos);',
    solution: 'let pasos = 3;\nmove("right", pasos);',
    targetPosition: { x: 3, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "magic",
    concept: "Variables let"
  },
  {
    id: 3,
    name: "Constantes del Tesoro",
    story: "🏰 El tesoro está a 4 pasos. Usa una constante para no perderlo de vista.",
    objective: "Usa const para definir los pasos y llegar al cofre",
    hint: '💡 const pasos = 4; move("right", pasos);',
    solution: 'const pasos = 4;\nmove("right", pasos);',
    targetPosition: { x: 4, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "castle",
    concept: "Variables const"
  },
  {
    id: 4,
    name: "Camino con Condición",
    story: "🌉 Hay un puente levadizo. Solo cruza si tienes más de 3 puntos de poder.",
    objective: "Usa if para verificar si puedes cruzar (poder > 3)",
    hint: '💡 let poder = 4; if (poder > 3) { move("right", 2); }',
    solution: 'let poder = 4;\nif (poder > 3) {\n  move("right", 2);\n}',
    targetPosition: { x: 2, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "bridge",
    concept: "Condicional if"
  },
  {
    id: 5,
    name: "Loop del Bosque",
    story: "🌲🌲 El bosque tiene un camino largo. Usa un bucle for para avanzar más rápido.",
    objective: "Usa un for para dar 4 pasos a la derecha",
    hint: '💡 for (let i = 0; i < 4; i++) { move("right", 1); }',
    solution: 'for (let i = 0; i < 4; i++) {\n  move("right", 1);\n}',
    targetPosition: { x: 4, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "forest",
    concept: "Bucle for"
  },
  {
    id: 6,
    name: "Mensaje Secreto",
    story: "📜 El escriba necesita enviar un mensaje al rey. ¡Usa console.log!",
    objective: "Imprime '¡Hola, rey!' usando console.log()",
    hint: '💡 console.log("¡Hola, rey!");',
    solution: 'console.log("¡Hola, rey!");',
    targetPosition: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [],
    gridSize: { width: 10, height: 6 },
    theme: "castle",
    concept: "console.log"
  },
  {
    id: 7,
    name: "Escalera Mágica",
    story: "🏰 La escalera del castillo. Sube usando while hasta tener 4 escalones.",
    objective: "Usa while para subir exactamente 4 escalones (arriba)",
    hint: '💡 let escalones = 0; while (escalones < 4) { move("up", 1); escalones++; }',
    solution: 'let escalones = 0;\nwhile (escalones < 4) {\n  move("up", 1);\n  escalones++;\n}',
    targetPosition: { x: 0, y: 4 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    gridSize: { width: 10, height: 6 },
    theme: "castle",
    concept: "Bucle while"
  },
  {
    id: 8,
    name: "Función Hechizo",
    story: "✨ Crea un hechizo (función) que mueva al mago 2 pasos.",
    objective: "Crea una función 'avanzar' que mueva 2 pasos y llámala",
    hint: '💡 function avanzar() { move("right", 2); } avanzar();',
    solution: 'function avanzar() {\n  move("right", 2);\n}\navanzar();',
    targetPosition: { x: 2, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "magic",
    concept: "Funciones"
  },
  {
    id: 9,
    name: "Parámetro Mágico",
    story: "⚡ El hechizo puede recibir energía (parámetro). Úsalo para moverte.",
    objective: "Crea una función con parámetro 'pasos' y llámala con valor 3",
    hint: '💡 function moverMagia(pasos) { move("right", pasos); } moverMagia(3);',
    solution: 'function moverMagia(pasos) {\n  move("right", pasos);\n}\nmoverMagia(3);',
    targetPosition: { x: 3, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "magic",
    concept: "Parámetros"
  },
  {
    id: 10,
    name: "Reto Final",
    story: "🐉 ¡El dragón espera al final del laberinto! Combina todo: variable, función y bucle.",
    objective: "Usa variable, función y bucle para llegar al dragón",
    hint: '💡 let pasos = 2; function atacar(){ move("right", 1); } for(let i=0; i<pasos; i++){ atacar(); }',
    solution: 'let pasos = 2;\n\nfunction atacar() {\n  move("right", 1);\n}\n\nfor (let i = 0; i < pasos; i++) {\n  atacar();\n}',
    targetPosition: { x: 2, y: 0 },
    startPosition: { x: 0, y: 0 },
    stars: [{ x: 1, y: 0 }],
    gridSize: { width: 10, height: 6 },
    theme: "boss",
    concept: "Combina todo"
  }
];

// Temas visuales
export const themes = {
  forest: {
    name: "Bosque",
    background: "#0d1f0d",
    ground: "#1a3d1a",
    accent: "#4ade80",
    decoration: "🌲"
  },
  magic: {
    name: "Magia",
    background: "#0f0a1a",
    ground: "#1a0f2e",
    accent: "#a855f7",
    decoration: "✨"
  },
  castle: {
    name: "Castillo",
    background: "#0a0f1a",
    ground: "#1a1f2e",
    accent: "#60a5fa",
    decoration: "🏰"
  },
  bridge: {
    name: "Puente",
    background: "#1a1a0a",
    ground: "#2e2e1a",
    accent: "#fbbf24",
    decoration: "🌉"
  },
  boss: {
    name: "Boss",
    background: "#1a0a0a",
    ground: "#2e1a1a",
    accent: "#ef4444",
    decoration: "🐉"
  }
};

export function getLevelById(id) {
  return levels.find(level => level.id === id);
}

export function getNextLevel(currentId) {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null;
}

export function getPrevLevel(currentId) {
  const currentIndex = levels.findIndex(level => level.id === currentId);
  if (currentIndex > 0) {
    return levels[currentIndex - 1];
  }
  return null;
}
