# csv-to-json
Convertidor CSV → JSON (CLI y librería) en Node.js

## 📋 Descripción

Este proyecto permite convertir archivos CSV a formato JSON de manera sencilla. Puede usarse tanto como:
- **CLI (interfaz de línea de comandos)**: Para convertir archivos desde la terminal
- **Librería**: Para integrar en otros proyectos Node.js

## 🚀 Instalación

```bash
npm install
```

Para usar el CLI globalmente:
```bash
npm link
```

## 💻 Uso

### Como CLI (Línea de Comandos)

**Convertir CSV a JSON y guardar en archivo:**
```bash
node cli.js ejemplo.csv salida.json
```

**Convertir CSV a JSON y mostrar en consola:**
```bash
node cli.js ejemplo.csv
```

**Ver ayuda:**
```bash
node cli.js --help
```

### Como Librería

```javascript
const csvToJson = require('./index');

// Convertir y guardar en archivo
csvToJson('./datos.csv', './salida.json')
  .then(data => {
    console.log('Conversión exitosa:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Solo obtener los datos (sin guardar)
csvToJson('./datos.csv')
  .then(data => {
    console.log('Datos:', data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## 📝 Ejemplo

Se incluye un archivo `ejemplo.csv` con datos de muestra. Puedes probarlo:

```bash
node ejemplo.js
```

O usando el CLI:

```bash
node cli.js ejemplo.csv resultado.json
```

## 📄 Formato de Entrada

El archivo CSV debe tener la primera fila con los nombres de las columnas:

```csv
nombre,edad,ciudad,profesion
Juan,30,Madrid,Ingeniero
María,25,Barcelona,Diseñadora
```

## 📤 Formato de Salida

El resultado es un array de objetos JSON:

```json
[
  {
    "nombre": "Juan",
    "edad": "30",
    "ciudad": "Madrid",
    "profesion": "Ingeniero"
  },
  {
    "nombre": "María",
    "edad": "25",
    "ciudad": "Barcelona",
    "profesion": "Diseñadora"
  }
]
```

## 🛠️ Tecnologías

- Node.js
- csv-parser

## 📜 Licencia

ISC
