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
  strings: {
    title: "Strings (Texto)",
    description: "Domina el manejo de texto en Python",
    icon: "📝",
    lessons: [
      {
        id: "py-strings-basics",
        title: "Métodos de Strings",
        type: "lesson",
        theory: `
# Métodos de Strings

## Métodos básicos
\`\`\`python
texto = "Hola Mundo"

texto.upper()        # "HOLA MUNDO"
texto.lower()        # "hola mundo"
texto.capitalize()   # "Hola mundo"
texto.title()        # "Hola Mundo"
\`\`\`

## Buscar y reemplazar
\`\`\`python
texto = "Hola Mundo"
texto.find("Mundo")   # 5 (índice)
texto.replace("Mundo", "Python")  # "Hola Python"
texto.count("o")      # 2
\`\`\`

## Dividir y unir
\`\`\`python
frase = "Hola,Mundo,Python"
frase.split(",")      # ["Hola", "Mundo", "Python"]

separadores = ["Hola", "Mundo"]
"-".join(separadores) # "Hola-Mundo"
\`\`\`

## strip() - Eliminar espacios
\`\`\`python
texto = "  Hola  "
texto.strip()   # "Hola"
texto.lstrip()  # "Hola  "
texto.rstrip() # "  Hola"
\`\`\`

## f-strings (format strings)
\`\`\`python
nombre = "Ana"
edad = 25
mensaje = f"Hola, {nombre}. Tienes {edad} años."
# "Hola, Ana. Tienes 25 años."
\`\`\`
        `,
        challenge: {
          title: "Manipula strings",
          description: "Crea 'nombre' = \"juan perez\", luego crea 'resultado' con el nombre capitalizado (title)",
          hints: [
            "Usa el método .title() para capitalizar",
            "nombre.title() devuelve \"Juan Perez\""
          ],
          solution: `nombre = "juan perez"
resultado = nombre.title()`,
          tests: [
            { code: "resultado == 'Juan Perez'", description: "resultado debe ser 'Juan Perez'" }
          ]
        }
      },
      {
        id: "py-strings-slicing",
        title: "Slicing de Strings",
        type: "lesson",
        theory: `
# Slicing (Rebanado)

## Sintaxis básica
\`\`\`python
texto = "Hola Mundo"
texto[0]     # "H" (primer carácter)
texto[-1]    # "o" (último carácter)
texto[0:4]   # "Hola" (posición 0 a 3)
\`\`\`

## omitir índices
\`\`\`python
texto = "Hola Mundo"
texto[:4]    # "Hola" (desde el inicio)
texto[5:]    # "Mundo" (hasta el final)
texto[:]     # "Hola Mundo" (copia completa)
\`\`\`

## Con pasos
\`\`\`python
texto = "Hola Mundo"
texto[::2]   # "Hl ud" (cada 2 caracteres)
texto[::-1]  # "odnuM aloH" (al revés)
texto[2:7:2] # "aMo" (con paso 2)
\`\`\`

## Ejemplos prácticos
\`\`\`python
extension = "documento.pdf"
extension[-4:]    # ".pdf"

ip = "192.168.1.1"
partes = ip.split(".")
partes[-1]        # "1"
\`\`\`
        `,
        challenge: {
          title: "Extrae las letras",
          description: "Crea 'texto' = \"Python\". Crea 'primera' con la primera letra y 'ultima' con la última.",
          hints: [
            "texto[0] para la primera letra",
            "texto[-1] para la última"
          ],
          solution: `texto = "Python"
primera = texto[0]
ultima = texto[-1]`,
          tests: [
            { code: "primera == 'P'", description: "primera debe ser 'P'" },
            { code: "ultima == 'n'", description: "ultima debe ser 'n'" }
          ]
        }
      }
    ]
  },
  advanced: {
    title: "Estructuras Avanzadas",
    description: "Sets, tuples y comprehensions",
    icon: "🔧",
    lessons: [
      {
        id: "py-sets-tuples",
        title: "Sets y Tuples",
        type: "lesson",
        theory: `
# Sets y Tuples

## Sets (Conjuntos)
\`\`\`python
colores = {"rojo", "verde", "azul"}
colores.add("amarillo")    # Añadir
colores.remove("verde")    # Eliminar
colores | {"negro"}        # Unión
colores & {"rojo", "azul"} # Intersección
\`\`\`

## Tuples (Tuplas)
\`\`\`python
coordenadas = (10, 20)
coordenadas[0]     # 10
x, y = coordenadas  # Desempaquetado
\`\`\`

## Cuándo usar cada uno
- **Listas**: Cuando necesitas orden y duplicados
- **Sets**: Para eliminar duplicados y membership testing
- **Tuples**: Para datos inmutables (como coordenadas)
\`\`\`python
lista = [1, 2, 2, 3]     # [1, 2, 2, 3]
conjunto = {1, 2, 2, 3}  # {1, 2, 3}
tupla = (1, 2, 2, 3)    # (1, 2, 2, 3)
\`\`\`
        `,
        challenge: {
          title: "Trabaja con sets",
          description: "Crea un set 'frutas' con \"manzana\", \"pera\", \"uva\". Añade \"kiwi\" y elimina \"pera\".",
          hints: [
            "Usa .add() para añadir",
            "Usa .remove() para eliminar"
          ],
          solution: `frutas = {"manzana", "pera", "uva"}
frutas.add("kiwi")
frutas.remove("pera")`,
          tests: [
            { code: "'kiwi' in frutas", description: "kiwi debe estar en el set" },
            { code: "'pera' not in frutas", description: "pera no debe estar en el set" },
            { code: "len(frutas) == 3", description: "frutas debe tener 3 elementos" }
          ]
        }
      },
      {
        id: "py-comprehensions",
        title: "List Comprehensions",
        type: "lesson",
        theory: `
# List Comprehensions

## Sintaxis básica
\`\`\`python
# Traditional loop
cuadrados = []
for i in range(5):
    cuadrados.append(i ** 2)

# List comprehension
cuadrados = [i ** 2 for i in range(5)]
# [0, 1, 4, 9, 16]
\`\`\`

## Con filtros
\`\`\`python
numeros = [1, 2, 3, 4, 5, 6]
pares = [n for n in numeros if n % 2 == 0]
# [2, 4, 6]
\`\`\`

## Comprehensions anidados
\`\`\`python
matriz = [[1, 2], [3, 4], [5, 6]]
plano = [n for fila in matriz for n in fila]
# [1, 2, 3, 4, 5, 6]
\`\`\`

## Dictionary comprehension
\`\`\`python
nombres = ["Ana", "Bob", "Carlos"]
longitudes = {nombre: len(nombre) for nombre in nombres}
# {"Ana": 3, "Bob": 3, "Carlos": 6}
\`\`\`
        `,
        challenge: {
          title: "Dobla los números",
          description: "Crea 'numeros' = [1, 2, 3, 4, 5]. Crea 'dobles' con cada número multiplicado por 2.",
          hints: [
            "Usa list comprehension: [n * 2 for n in numeros]"
          ],
          solution: `numeros = [1, 2, 3, 4, 5]
dobles = [n * 2 for n in numeros]`,
          tests: [
            { code: "dobles == [2, 4, 6, 8, 10]", description: "dobles debe ser [2, 4, 6, 8, 10]" }
          ]
        }
      }
    ]
  },
  errors: {
    title: "Manejo de Errores",
    description: "try/except para manejar excepciones",
    icon: "⚠️",
    lessons: [
      {
        id: "py-try-except",
        title: "Try/Except",
        type: "lesson",
        theory: `
# Manejo de Errores

## try/except básico
\`\`\`python
try:
    resultado = 10 / 0
except ZeroDivisionError:
    print("No se puede dividir entre cero")
\`\`\`

## Con múltiples except
\`\`\`python
try:
    num = int("hola")
    resultado = 10 / 0
except ValueError:
    print("No es un número válido")
except ZeroDivisionError:
    print("División entre cero")
\`\`\`

## else y finally
\`\`\`python
try:
    numero = int(input("Dame un número: "))
except ValueError:
    print("Error: no es un número")
else:
    print(f"El número es {numero}")
finally:
    print("Gracias por participar")
\`\`\`

## Capturar la excepción
\`\`\`python
try:
    archivo = open("datos.txt", "r")
except FileNotFoundError as e:
    print(f"Archivo no encontrado: {e}")
\`\`\`
        `,
        challenge: {
          title: "Maneja el error",
          description: "Envuelve en try/except: divide 10 entre 0, guarda el resultado o \"error\" si falla",
          hints: [
            "Usa try:/except ZeroDivisionError:/",
            "En el except guarda resultado = \"error\""
          ],
          solution: `try:
    resultado = 10 / 0
except ZeroDivisionError:
    resultado = "error"`,
          tests: [
            { code: "resultado == 'error'", description: "resultado debe ser 'error'" }
          ]
        }
      }
    ]
  },
  modules: {
    title: "Módulos e Imports",
    description: "Importa y usa módulos de Python",
    icon: "📦",
    lessons: [
      {
        id: "py-imports",
        title: "Importar módulos",
        type: "lesson",
        theory: `
# Módulos e Imports

## Import básico
\`\`\`python
import math

math.pi           # 3.14159...
math.sqrt(16)     # 4.0
math.floor(3.7)  # 3
math.ceil(3.2)    # 4
\`\`\`

## from import
\`\`\`python
from math import sqrt, pi

sqrt(16)   # 4.0
pi         # 3.14159...
\`\`\`

## Alias
\`\`\`python
import numpy as np
from datetime import datetime as dt
\`\`\`

## Módulos útiles
\`\`\`python
import random
random.choice([1, 2, 3])     # elemento aleatorio
random.randint(1, 10)         # número aleatorio 1-10

import datetime
datetime.datetime.now()      # fecha y hora actual
\`\`\`
        `,
        challenge: {
          title: "Usa el módulo math",
          description: "Importa math y calcula: 'raiz' = sqrt(144), 'redondeo' = floor(9.7)",
          hints: [
            "from math import sqrt, floor",
            "sqrt(144) = 12, floor(9.7) = 9"
          ],
          solution: `from math import sqrt, floor
raiz = sqrt(144)
redondeo = floor(9.7)`,
          tests: [
            { code: "raiz == 12", description: "raiz debe ser 12" },
            { code: "redondeo == 9", description: "redondeo debe ser 9" }
          ]
        }
      }
    ]
  },
  files: {
    title: "Archivos",
    description: "Lee y escribe archivos",
    icon: "📁",
    lessons: [
      {
        id: "py-file-io",
        title: "Lectura y Escritura",
        type: "lesson",
        theory: `
# Manipulación de Archivos

## Leer archivo
\`\`\`python
with open("archivo.txt", "r") as f:
    contenido = f.read()

# Leer línea por línea
with open("archivo.txt", "r") as f:
    lineas = f.readlines()
\`\`\`

## Escribir archivo
\`\`\`python
with open("salida.txt", "w") as f:
    f.write("Hola mundo\\n")
    f.write("Segunda línea")
\`\`\`

## Añadir a archivo
\`\`\`python
with open("log.txt", "a") as f:
    f.write("Nueva entrada\\n")
\`\`\`

## Ejemplo práctico
\`\`\`python
# Contar palabras en archivo
with open("texto.txt", "r") as f:
    contenido = f.read()
    palabras = contenido.split()
    print(f"Palabras: {len(palabras)}")
\`\`\`
        `,
        challenge: {
          title: "Escribe y cuenta",
          description: "El código usa un archivo simulado. Crea 'texto' = \"Hola Python\" y 'longitud' = len(texto)",
          hints: [
            "len() cuenta los caracteres",
            "len(\"Hola Python\") = 11"
          ],
          solution: `texto = "Hola Python"
longitud = len(texto)`,
          tests: [
            { code: "texto == 'Hola Python'", description: "texto debe ser 'Hola Python'" },
            { code: "longitud == 11", description: "longitud debe ser 11" }
          ]
        }
      }
    ]
  },
  oop: {
    title: "POO Básico",
    description: "Clases y objetos en Python",
    icon: "🏗️",
    lessons: [
      {
        id: "py-classes",
        title: "Clases y Objetos",
        type: "lesson",
        theory: `
# Programación Orientada a Objetos

## Definir una clase
\`\`\`python
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad
    
    def saludar(self):
        return f"Hola, soy {self.nombre}"

# Crear objeto
ana = Persona("Ana", 25)
print(ana.saludar())  # "Hola, soy Ana"
\`\`\`

## self
\`\`\`python
class Persona:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def mostrar_nombre(self):
        return self.nombre
\`\`\`

## Métodos y atributos
\`\`\`python
class Contador:
    def __init__(self):
        self.valor = 0
    
    def incrementar(self):
        self.valor += 1
    
    def obtener(self):
        return self.valor

contador = Contador()
contador.incrementar()
contador.incrementar()
contador.obtener()  # 2
\`\`\`
        `,
        challenge: {
          title: "Crea una clase",
          description: "Crea una clase 'Calculadora' con método 'sumar(a, b)' que retorne a + b",
          hints: [
            "def sumar(self, a, b): return a + b",
            "No necesitas __init__ para este ejercicio"
          ],
          solution: `class Calculadora:
    def sumar(self, a, b):
        return a + b

calc = Calculadora()
resultado = calc.sumar(3, 5)`,
          tests: [
            { code: "resultado == 8", description: "resultado debe ser 8" }
          ]
        }
      }
    ]
  },
  functional: {
    title: "Lambda y Funcional",
    description: "Lambda, map, filter y más",
    icon: "⚡",
    lessons: [
      {
        id: "py-lambda",
        title: "Lambda y Map/Filter",
        type: "lesson",
        theory: `
# Lambda y Programación Funcional

## Lambda (funciones anónimas)
\`\`\`python
doble = lambda x: x * 2
doble(5)  # 10

suma = lambda a, b: a + b
suma(3, 4)  # 7
\`\`\`

## map()
\`\`\`python
numeros = [1, 2, 3, 4]
dobles = list(map(lambda x: x * 2, numeros))
# [2, 4, 6, 8]
\`\`\`

## filter()
\`\`\`python
numeros = [1, 2, 3, 4, 5, 6]
pares = list(filter(lambda x: x % 2 == 0, numeros))
# [2, 4, 6]
\`\`\`

## sorted() con key
\`\`\`python
palabras = ["bcd", "a", "abc"]
ordenadas = sorted(palabras, key=lambda x: len(x))
# ["a", "bcd", "abc"]
\`\`\`
        `,
        challenge: {
          title: "Filtra los pares",
          description: "Crea 'numeros' = [1, 2, 3, 4, 5, 6]. Filtra solo los pares en 'pares' usando filter()",
          hints: [
            "filter(lambda x: x % 2 == 0, numeros)",
            "Convierte a list: list(filter(...))"
          ],
          solution: `numeros = [1, 2, 3, 4, 5, 6]
pares = list(filter(lambda x: x % 2 == 0, numeros))`,
          tests: [
            { code: "pares == [2, 4, 6]", description: "pares debe ser [2, 4, 6]" }
          ]
        }
      }
    ]
  }
};
