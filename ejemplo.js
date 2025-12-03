const csvToJson = require('./index');

async function runExamples() {
  try {
    // Ejemplo 1: Convertir CSV a JSON y guardar en archivo
    console.log('Ejemplo 1: Convertir y guardar en archivo');
    const data1 = await csvToJson('./ejemplo.csv', './salida.json');
    console.log(`✓ Conversión exitosa: ${data1.length} registros`);
    console.log('Primer registro:', data1[0]);

    // Ejemplo 2: Convertir CSV a JSON sin guardar (solo obtener los datos)
    console.log('\nEjemplo 2: Obtener datos sin guardar');
    const data2 = await csvToJson('./ejemplo.csv');
    console.log('Datos obtenidos:');
    console.log(JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runExamples();
