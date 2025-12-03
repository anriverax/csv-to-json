# csv-to-json

Convertidor CSV → JSON (CLI y librería) en Node.js

## 📋 Descripción

Herramienta simple y eficiente para convertir archivos CSV a formato JSON. Incluye tanto una interfaz de línea de comandos (CLI) como una librería que puede ser integrada en proyectos Node.js.

## 🚀 Características

- ✅ Conversión rápida de CSV a JSON
- ✅ CLI fácil de usar
- ✅ API programática para integración en proyectos
- ✅ Soporte para delimitadores personalizados
- ✅ Opción de formato JSON con indentación
- ✅ Salida a archivo o consola

## 📦 Instalación

### Instalación Global (CLI)

```bash
npm install -g @anriverax/csv-to-json
```

### Instalación Local (Librería)

```bash
npm install @anriverax/csv-to-json
```

## 💻 Uso

### CLI (Línea de Comandos)

#### Sintaxis Básica

```bash
csv-to-json <archivo-entrada.csv> [opciones]
```

#### Opciones

- `-o, --output <archivo>` - Archivo JSON de salida (opcional, si no se especifica imprime en consola)
- `-p, --pretty` - Formato JSON con indentación
- `-d, --delimiter <char>` - Delimitador CSV personalizado (por defecto: `,`)
- `-V, --version` - Muestra la versión
- `-h, --help` - Muestra ayuda

#### Ejemplos

**Convertir CSV a JSON y mostrar en consola:**

```bash
csv-to-json datos.csv
```

**Convertir CSV a JSON con formato bonito:**

```bash
csv-to-json datos.csv --pretty
```

**Guardar resultado en un archivo:**

```bash
csv-to-json datos.csv -o salida.json
```

**Guardar con formato bonito:**

```bash
csv-to-json datos.csv -o salida.json --pretty
```

**Usar delimitador personalizado (punto y coma):**

```bash
csv-to-json datos.csv -o salida.json -d ";"
```

### Librería (API Programática)

#### Importar la Librería

```javascript
const { convertCsvToJson } = require('@anriverax/csv-to-json');
```

#### Uso Básico

```javascript
const { convertCsvToJson } = require('@anriverax/csv-to-json');

async function convertir() {
  try {
    // Convertir y obtener datos en memoria
    const data = await convertCsvToJson('datos.csv');
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

convertir();
```

#### Con Opciones

```javascript
const { convertCsvToJson } = require('@anriverax/csv-to-json');

async function convertir() {
  try {
    const data = await convertCsvToJson('datos.csv', {
      outputPath: 'salida.json',  // Guardar en archivo
      pretty: true,                // Formato con indentación
      delimiter: ','               // Delimitador personalizado
    });
    
    console.log(`${data.length} registros convertidos`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

convertir();
```

## 📄 Formato de Archivos

### Ejemplo de CSV (entrada)

```csv
id,name,email,age
1,Juan Pérez,juan@example.com,30
2,María García,maria@example.com,25
3,Carlos López,carlos@example.com,35
```

### Ejemplo de JSON (salida)

```json
[
  {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "age": "30"
  },
  {
    "id": "2",
    "name": "María García",
    "email": "maria@example.com",
    "age": "25"
  },
  {
    "id": "3",
    "name": "Carlos López",
    "email": "carlos@example.com",
    "age": "35"
  }
]
```

## 🧪 Desarrollo

### Clonar el Repositorio

```bash
git clone https://github.com/anriverax/csv-to-json.git
cd csv-to-json
```

### Instalar Dependencias

```bash
npm install
```

### Ejecutar Pruebas

```bash
npm test
```

### Probar CLI Localmente

```bash
node bin/csv-to-json.js examples/users.csv --pretty
```

## 📝 API Reference

### `convertCsvToJson(inputPath, options)`

Convierte un archivo CSV a formato JSON.

**Parámetros:**

- `inputPath` (string) - Ruta al archivo CSV de entrada
- `options` (object, opcional) - Opciones de configuración
  - `outputPath` (string) - Ruta al archivo JSON de salida (opcional)
  - `pretty` (boolean) - Si es `true`, formatea el JSON con indentación (default: `false`)
  - `delimiter` (string) - Delimitador del CSV (default: `','`)

**Retorna:**

- `Promise<Array>` - Promesa que se resuelve con los datos en formato JSON

**Errores:**

- Lanza error si el archivo de entrada no existe
- Lanza error si hay problemas al leer o escribir archivos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**Anibal Rivera**

- GitHub: [@anriverax](https://github.com/anriverax)

## ⭐ Agradecimientos

Si te resulta útil este proyecto, ¡considera darle una estrella! ⭐
