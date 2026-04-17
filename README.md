# ⚔️ JS Pixel Adventure

**Un juego educativo estilo pixelart para aprender JavaScript desde cero.**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

---

## 🎮 Descripción

JS Pixel Adventure es un juego educativo donde el jugador ayuda a un personaje pixelado a escapar de diferentes niveles (mazmorras, bosques, castillos) resolviendo desafíos de programación en JavaScript.

El juego enseña conceptos fundamentales de JavaScript de forma interactiva y divertida:

- `console.log()` - Mostrar mensajes
- Variables (`let`, `const`)
- Condicionales (`if`)
- Loops (`for`, `while`)
- Funciones

---

## 🚀 Cómo ejecutar

```bash
# Clonar o entrar al directorio del proyecto
cd js-pixel-adventure

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📖 Cómo jugar

1. **Lee la historia** del nivel actual
2. **Analiza el objetivo** - ¿qué necesitas lograr?
3. **Escribe código JavaScript** en el editor
4. **Presiona "Ejecutar Código"** o usa `Ctrl+Enter`
5. **Recibe feedback** - si es correcto, avanzas al siguiente nivel

### Funciones disponibles

| Función | Descripción | Ejemplo |
|---------|-------------|---------|
| `move(n)` | Mueve el personaje n pasos | `move(3);` |
| `say("texto")` | El personaje dice algo | `say("¡Hola!");` |
| `console.log()` | Muestra un mensaje | `console.log("Hola");` |

---

## 🏗️ Estructura del proyecto

```
js-pixel-adventure/
├── app/
│   ├── page.js          # Página principal del juego
│   ├── layout.js        # Layout de Next.js
│   └── globals.css     # Estilos pixelart
├── components/
│   ├── GameCanvas.js   # Renderizado del mapa/personaje
│   ├── CodeEditor.js   # Editor de código
│   └── LevelInfo.js    # Información del nivel
├── data/
│   └── levels.js       # Definición de niveles
├── utils/
│   └── evaluator.js   # Motor de ejecución seguro
├── public/
│   └── favicon.svg     # Icono del juego
└── package.json
```

---

## 📚 Conceptos enseñados por nivel

| Nivel | Nombre | Concepto |
|-------|--------|----------|
| 1 | El Primer Paso | Introducción a funciones |
| 2 | Variables al Rescate | Variables con `let` |
| 3 | Constantes Mágicas | Variables con `const` |
| 4 | Puente Levadizo | Condicionales `if` |
| 5 | Caminata en el Bosque | Bucle `for` |
| 6 | Mensaje Secreto | `console.log()` |
| 7 | Escalera del Castillo | Bucle `while` |
| 8 | Función Mágica | Funciones básicas |
| 9 | Parámetros Mágicos | Funciones con parámetros |
| 10 | Reto Final | Revisión general |

---

## 🔒 Seguridad

El código del usuario se ejecuta en un **entorno sandbox** que:

- ❌ No permite `eval()`, `Function()`, `setTimeout`, etc.
- ❌ No permite acceso a `document`, `window`, `fetch`
- ✅ Solo permite funciones seguras: `move()`, `say()`, `console.log()`
- ✅ Limita valores numéricos para prevenir loops infinitos

---

## 💾 Guardado automático

El progreso se guarda automáticamente en **localStorage**:

- Nivel actual
- Niveles completados
- Se puede reiniciar el juego desde cero

---

## 🎨 Diseño

El juego usa un estilo **pixelart retro** implementado completamente con CSS:

- Colores oscuros inspirados en juegos de NES/SNES
- Tipografía monoespaciada
- Bordes pixel-art
- Animaciones simples (caminata, pulso, etc.)

---

## 📝 Para扩展 (extender)

Ideas para agregar más niveles o características:

- [ ] Más niveles con arrays y objetos
- [ ] Sistema de logros
- [ ] Modo dos jugadores
- [ ] Tema claro/oscuro
- [ ] Más animaciones y efectos de sonido
- [ ] Sistema de puntuación con estrellas

---

## 📄 Licencia

MIT - Libre para uso educativo.

---

**¡Aprende JavaScript jugando! 🎮⚔️**
