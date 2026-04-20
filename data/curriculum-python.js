/**
 * Currículo de Python - Lecciones y Desafíos con Soluciones
 */

export const curriculumPython = {
  fundamentals: {
    title: "Fundamentos de Python",
    description: "Aprende los conceptos básicos de Python",
    icon: "🐍",
    lessons: [
      {
        id: "py-variables",
        title: "Variables en Python",
        type: "lesson",
        theory: `
# Variables en Python

Las variables son contenedores para almacenar datos.

## Crear variables
\`\`\`python
nombre = "Ana"
edad = 25
altura = 1.65
es_estudiante = True
\`\`\`

## const (constantes)
En Python las constantes se escriben en MAYÚSCULAS por convención:
\`\`\`python
PI = 3.1416
NOMBRE_APP = "AprendePython"
\`\`\`

## Reglas para nombres
- No pueden empezar con números
- Pueden tener letras, números y _
- Son sensibles a mayúsculas
- Usamos snake_case (guiones bajos)
        `,
        challenge: {
          title: "Declara tus primeras variables",
          description: "Crea una variable 'nombre' con tu nombre, una variable 'edad' con tu edad (número), y una constante 'PAIS' con tu país.",
          hints: [
            "En Python no usamos let o const, simplemente asignamos",
            "Los strings van entre comillas: \"valor\"",
            "Las constantes se escriben en MAYÚSCULAS"
          ],
          solution: `nombre = "María"
edad = 25
PAIS = "Chile"`,
          tests: [
            { code: "isinstance(nombre, str)", description: "nombre debe ser un string" },
            { code: "isinstance(edad, int)", description: "edad debe ser un número entero" },
            { code: "isinstance(PAIS, str)", description: "PAIS debe ser un string" },
            { code: "'PAIS' in dir()", description: "PAIS debe estar definido" }
          ]
        }
      },
      {
        id: "py-types",
        title: "Tipos de Datos",
        type: "lesson",
        theory: `
# Tipos de Datos en Python

## String (Texto)
\`\`\`python
nombre = "Hola mundo"
template = f"Hola, {nombre}"
\`\`\`

## Integer (Enteros)
\`\`\`python
edad = 25
cantidad = 100
\`\`\`

## Float (Decimales)
\`\`\`python
altura = 1.75
precio = 19.99
\`\`\`

## Boolean
\`\`\`python
esMayor = True
tienePermiso = False
\`\`\`

## None (nulo)
\`\`\`python
sin_definir = None
\`\`\`

## type()
\`\`\`python
type("hola")    # <class 'str'>
type(42)        # <class 'int'>
type(3.14)      # <class 'float'>
type(True)      # <class 'bool'>
\`\`\`
        `,
        challenge: {
          title: "Identifica los tipos",
          description: "Crea: texto = \"Hola\", numero = 42, decimal = 3.14, booleano = True",
          hints: [
            "Los strings van entre comillas",
            "Los enteros son números sin decimal",
            "True y False van con mayúscula inicial"
          ],
          solution: `texto = "Hola"
numero = 42
decimal = 3.14
booleano = True`,
          tests: [
            { code: "isinstance(texto, str)", description: "texto debe ser string" },
            { code: "isinstance(numero, int)", description: "numero debe ser entero" },
            { code: "isinstance(decimal, float)", description: "decimal debe ser float" },
            { code: "isinstance(booleano, bool)", description: "booleano debe ser bool" }
          ]
        }
      },
      {
        id: "py-operators",
        title: "Operadores",
        type: "lesson",
        theory: `
# Operadores en Python

## Aritméticos
\`\`\`python
suma = 5 + 3      # 8
resta = 5 - 3     # 2
multi = 5 * 3     # 15
division = 15 / 3 # 5.0
division_entera = 15 // 3  # 5
modulo = 15 % 3   # 0
potencia = 2 ** 3 # 8
\`\`\`

## Comparación
\`\`\`python
5 > 3       # True
5 < 3       # False
5 >= 5      # True
5 == 3      # False
5 != 3      # True
\`\`\`

## Lógicos
\`\`\`python
True and False  # False
True or False   # True
not True        # False
\`\`\`
        `,
        challenge: {
          title: "Calcula con operadores",
          description: "Crea: a = 10, b = 3, resultado = a + b * 2",
          hints: [
            "Python respeta la precedencia de operadores",
            "La multiplicación se hace antes que la suma",
            "a + b * 2 = 10 + 6 = 16"
          ],
          solution: `a = 10
b = 3
resultado = a + b * 2`,
          tests: [
            { code: "a == 10", description: "a debe ser 10" },
            { code: "b == 3", description: "b debe ser 3" },
            { code: "resultado == 16", description: "resultado debe ser 16" }
          ]
        }
      },
      {
        id: "py-conditionals",
        title: "Condicionales if/else",
        type: "lesson",
        theory: `
# Condicionales en Python

## if básico
\`\`\`python
edad = 18
if edad >= 18:
    print("Eres mayor de edad")
\`\`\`

## if/else
\`\`\`python
edad = 15
if edad >= 18:
    print("Eres mayor")
else:
    print("Eres menor")
\`\`\`

## elif (else if)
\`\`\`python
nota = 85
if nota >= 90:
    print("Excelente")
elif nota >= 70:
    print("Aprobado")
else:
    print("Reprobado")
\`\`\`

## Operador ternario
\`\`\`python
edad = 20
tipo = "adulto" if edad >= 18 else "menor"
\`\`\`
        `,
        challenge: {
          title: "Clasificador de edad",
          description: "Crea 'edad' = 20, 'clasificacion' = \"adulto\" si >= 18, sino \"menor\"",
          hints: [
            "Usa if/else para comparar la edad",
            "La condición va después del if con dos puntos",
            "En Python la identación es muy importante"
          ],
          solution: `edad = 20
if edad >= 18:
    clasificacion = "adulto"
else:
    clasificacion = "menor"`,
          tests: [
            { code: "edad == 20", description: "edad debe ser 20" },
            { code: "clasificacion == 'adulto'", description: "clasificacion debe ser adulto" }
          ]
        }
      },
      {
        id: "py-loops",
        title: "Bucles",
        type: "lesson",
        theory: `
# Bucles en Python

## for循环
\`\`\`python
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

frutas = ["manzana", "pera", "uva"]
for fruta in frutas:
    print(fruta)
\`\`\`

## while循环
\`\`\`python
contador = 0
while contador < 5:
    print(contador)
    contador += 1
\`\`\`

## break y continue
\`\`\`python
for i in range(10):
    if i == 3:
        break    # Sale del bucle
    if i == 1:
        continue  # Salta a la siguiente iteración
    print(i)
\`\`\`

## range()
\`\`\`python
range(5)       # 0, 1, 2, 3, 4
range(2, 5)     # 2, 3, 4
range(0, 10, 2) # 0, 2, 4, 6, 8
\`\`\`
        `,
        challenge: {
          title: "Suma con bucle",
          description: "Usa un bucle for para calcular la suma de los números del 1 al 5 en 'resultado'",
          hints: [
            "Usa range(1, 6) para los números 1, 2, 3, 4, 5",
            "Inicializa resultado = 0",
            "En cada iteración: resultado = resultado + i"
          ],
          solution: `resultado = 0
for i in range(1, 6):
    resultado = resultado + i`,
          tests: [
            { code: "resultado == 15", description: "resultado debe ser 15 (1+2+3+4+5)" }
          ]
        }
      },
      {
        id: "py-functions",
        title: "Funciones",
        type: "lesson",
        theory: `
# Funciones en Python

## Definir funciones
\`\`\`python
def saludar():
    print("¡Hola!")

saludar()
\`\`\`

## Con parámetros
\`\`\`python
def saludar(nombre):
    print(f"¡Hola, {nombre}!")

saludar("Ana")
\`\`\`

## Con valor de retorno
\`\`\`python
def sumar(a, b):
    return a + b

resultado = sumar(3, 5)  # 8
\`\`\`

## Parámetros por defecto
\`\`\`python
def saludar(nombre="Mundo"):
    print(f"¡Hola, {nombre}!")

saludar()          # ¡Hola, Mundo!
saludar("Ana")     # ¡Hola, Ana!
\`\`\`

## *args y **kwargs
\`\`\`python
def sumar(*numeros):
    return sum(numeros)

sumar(1, 2, 3, 4, 5)  # 15
\`\`\`
        `,
        challenge: {
          title: "Función multiplicadora",
          description: "Crea una función 'multiplicar(a, b)' que retorne a * b. Luego llama multiplicar(4, 5) y guarda en 'resultado'",
          hints: [
            "Usa 'def' para definir la función",
            "El return devuelve el resultado",
            "Luego llama la función y guarda el resultado"
          ],
          solution: `def multiplicar(a, b):
    return a * b

resultado = multiplicar(4, 5)`,
          tests: [
            { code: "callable(multiplicar)", description: "multiplicar debe ser una función" },
            { code: "multiplicar(4, 5) == 20", description: "multiplicar(4, 5) debe ser 20" },
            { code: "resultado == 20", description: "resultado debe ser 20" }
          ]
        }
      },
      {
        id: "py-lists",
        title: "Listas",
        type: "lesson",
        theory: `
# Listas en Python

## Crear listas
\`\`\`python
numeros = [1, 2, 3, 4, 5]
frutas = ["manzana", "pera", "uva"]
mixta = [1, "hola", True, 3.14]
\`\`\`

## Acceder elementos
\`\`\`python
frutas = ["manzana", "pera", "uva"]
frutas[0]    # "manzana"
frutas[-1]   # "uva" (último)
\`\`\`

## Modificar listas
\`\`\`python
frutas = ["manzana", "pera"]
frutas.append("uva")      # Añadir
frutas.insert(1, "kiwi")  # Insertar en posición
frutas.remove("pera")      # Eliminar por valor
\`\`\`

## Métodos útiles
\`\`\`python
numeros = [3, 1, 4, 1, 5]
len(numeros)     # 5 (longitud)
sum(numeros)     # 14 (suma)
max(numeros)     # 5 (máximo)
min(numeros)     # 1 (mínimo)
numeros.sort()   # Ordenar
\`\`\`

## Slicing (rebanado)
\`\`\`python
numeros = [0, 1, 2, 3, 4, 5]
numeros[1:4]    # [1, 2, 3]
numeros[:3]     # [0, 1, 2]
numeros[3:]     # [3, 4, 5]
\`\`\`
        `,
        challenge: {
          title: "Lista de frutas",
          description: "Crea una lista 'frutas' con \"manzana\", \"pera\", \"uva\". Añade \"kiwi\" al final.",
          hints: [
            "Usa corchetes [] para crear la lista",
            "append() añade al final",
            "['manzana', 'pera', 'uva'] + ['kiwi']"
          ],
          solution: `frutas = ["manzana", "pera", "uva"]
frutas.append("kiwi")`,
          tests: [
            { code: "len(frutas) == 4", description: "frutas debe tener 4 elementos" },
            { code: "frutas[-1] == 'kiwi'", description: "kiwi debe estar al final" }
          ]
        }
      },
      {
        id: "py-dicts",
        title: "Diccionarios",
        type: "lesson",
        theory: `
# Diccionarios en Python

## Crear diccionarios
\`\`\`python
persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Santiago"
}
\`\`\`

## Acceder valores
\`\`\`python
persona["nombre"]    # "Ana"
persona.get("edad")  # 25
\`\`\`

## Modificar
\`\`\`python
persona["edad"] = 26       # Modificar
persona["profesion"] = "Dev"  # Añadir
del persona["ciudad"]       # Eliminar
\`\`\`

## Métodos útiles
\`\`\`python
persona.keys()    # todas las claves
persona.values()  # todos los valores
persona.items()   # pares clave-valor
persona.update({"edad": 27})  # actualizar
\`\`\`

## Recorrer diccionarios
\`\`\`python
for clave in persona:
    print(clave, persona[clave])

for clave, valor in persona.items():
    print(f"{clave}: {valor}")
\`\`\`
        `,
        challenge: {
          title: "Diccionario de usuario",
          description: "Crea un diccionario 'usuario' con clave 'nombre' = \"Carlos\", clave 'edad' = 30",
          hints: [
            "Usa llaves {} para el diccionario",
            "Las claves van entre comillas",
            "{'nombre': 'Carlos', 'edad': 30}"
          ],
          solution: `usuario = {
    "nombre": "Carlos",
    "edad": 30
}`,
          tests: [
            { code: "isinstance(usuario, dict)", description: "usuario debe ser un diccionario" },
            { code: "usuario['nombre'] == 'Carlos'", description: "nombre debe ser Carlos" },
            { code: "usuario['edad'] == 30", description: "edad debe ser 30" }
          ]
        }
      }
    ]
  },
  controlFlow: {
    title: "Control de Flujo",
    description: "Aprende a controlar el flujo de tu programa",
    icon: "🔀",
    lessons: [
      {
        id: "py-match",
        title: "Match (Switch)",
        type: "lesson",
        theory: `
# Match en Python

Match es como switch/case en otros lenguajes (Python 3.10+).

## Estructura básica
\`\`\`python
dia = "lunes"

match dia:
    case "lunes":
        print("Inicio de semana")
    case "viernes":
        print("¡Por fin viernes!")
    case "sábado" | "domingo":
        print("¡Fin de semana!")
    case _:
        print("Día no reconocido")
\`\`\`

## Con múltiples valores
\`\`\`python
match dia:
    case "sábado" | "domingo":
        print("¡Fin de semana!")
\`\`\`

## Usando if
\`\`\`python
match dia:
    case "lunes" if es_feriado:
        print("¡Feriado!")
    case "lunes":
        print("Lunes normal")
\`\`\`
        `,
        challenge: {
          title: "Día de la semana",
          description: "Crea dia = \"martes\". Si es \"lunes\" → \"Inicio\", si es \"viernes\" → \"¡Viernes!\", otros → \"Otro día\"",
          hints: [
            "Usa match dia:",
            "case _ es el caso por defecto",
            "match es nuevo en Python 3.10+"
          ],
          solution: `dia = "martes"
match dia:
    case "lunes":
        mensaje = "Inicio"
    case "viernes":
        mensaje = "¡Viernes!"
    case _:
        mensaje = "Otro día"`,
          tests: [
            { code: "dia == 'martes'", description: "dia debe ser martes" },
            { code: "mensaje == 'Otro día'", description: "mensaje debe ser 'Otro día'" }
          ]
        }
      }
    ]
  }
};
