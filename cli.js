#!/usr/bin/env node

const csvToJson = require('./index');
const path = require('path');

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);

// Función para mostrar ayuda
function showHelp() {
  console.log(`
Uso: csv-to-json <archivo-entrada.csv> [archivo-salida.json]

Convierte un archivo CSV a formato JSON.

Argumentos:
  archivo-entrada.csv    Archivo CSV de entrada (requerido)
  archivo-salida.json    Archivo JSON de salida (opcional)
                         Si no se especifica, solo muestra el resultado en consola

Ejemplos:
  csv-to-json datos.csv datos.json
  csv-to-json datos.csv
  `);
}

// Verificar argumentos
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  showHelp();
  process.exit(0);
}

if (args.length > 2) {
  console.error('Error: Demasiados argumentos');
  showHelp();
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = args[1] ? path.resolve(args[1]) : null;

// Ejecutar conversión
csvToJson(inputPath, outputPath)
  .then((data) => {
    if (!outputPath) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log(`✓ Conversión completada. ${data.length} registro(s) procesado(s).`);
  })
  .catch((error) => {
    console.error('✗ Error:', error.message);
    process.exit(1);
  });
