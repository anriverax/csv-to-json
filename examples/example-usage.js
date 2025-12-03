/**
 * Ejemplo de uso de la librería csv-to-json
 */

const { convertCsvToJson } = require('../index');
const path = require('path');

async function examples() {
  console.log('=== Ejemplos de uso de csv-to-json ===\n');

  // Ejemplo 1: Convertir CSV a JSON (en memoria)
  console.log('1. Convertir CSV a JSON (en memoria):');
  try {
    const data = await convertCsvToJson(
      path.join(__dirname, 'users.csv')
    );
    console.log(`✓ ${data.length} registros cargados`);
    console.log('Primer registro:', data[0]);
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Ejemplo 2: Guardar en archivo con formato bonito
  console.log('2. Guardar en archivo con formato bonito:');
  try {
    const outputPath = path.join(__dirname, 'output-pretty.json');
    const data = await convertCsvToJson(
      path.join(__dirname, 'products.csv'),
      { 
        outputPath,
        pretty: true 
      }
    );
    console.log(`✓ JSON guardado en: ${outputPath}`);
    console.log(`✓ ${data.length} productos convertidos`);
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '-'.repeat(50) + '\n');

  // Ejemplo 3: Usar delimitador personalizado
  console.log('3. Usar delimitador personalizado:');
  console.log('(Este ejemplo requiere un archivo CSV con punto y coma)');
  console.log('Ejemplo de código:');
  console.log(`
  const data = await convertCsvToJson('datos.csv', {
    delimiter: ';',
    outputPath: 'output.json'
  });
  `);
}

// Ejecutar ejemplos
examples().catch(error => {
  console.error('Error ejecutando ejemplos:', error);
  process.exit(1);
});
