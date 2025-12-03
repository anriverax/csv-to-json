const csvToJson = require('./index');

// Ejemplo 1: Convertir CSV a JSON y guardar en archivo
console.log('Ejemplo 1: Convertir y guardar en archivo');
csvToJson('./ejemplo.csv', './salida.json')
  .then(data => {
    console.log(`✓ Conversión exitosa: ${data.length} registros`);
    console.log('Primer registro:', data[0]);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Ejemplo 2: Convertir CSV a JSON sin guardar (solo obtener los datos)
setTimeout(() => {
  console.log('\nEjemplo 2: Obtener datos sin guardar');
  csvToJson('./ejemplo.csv')
    .then(data => {
      console.log('Datos obtenidos:');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}, 100);
