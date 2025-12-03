const { convertCsvToJson } = require('../index');
const fs = require('fs');
const path = require('path');

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('🧪 Ejecutando pruebas...\n');

  // Test 1: Convertir CSV a JSON (sin archivo de salida)
  try {
    console.log('Test 1: Convertir CSV a JSON');
    const inputPath = path.join(__dirname, '../examples/users.csv');
    const data = await convertCsvToJson(inputPath);
    
    if (Array.isArray(data) && data.length === 4) {
      console.log('✓ Test 1 pasado');
      passed++;
    } else {
      console.log('✗ Test 1 fallado: datos incorrectos');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 1 fallado:', error.message);
    failed++;
  }

  // Test 2: Verificar estructura de datos
  try {
    console.log('\nTest 2: Verificar estructura de datos');
    const inputPath = path.join(__dirname, '../examples/users.csv');
    const data = await convertCsvToJson(inputPath);
    
    const firstRecord = data[0];
    if (firstRecord.id === '1' && 
        firstRecord.name === 'Juan Pérez' && 
        firstRecord.email === 'juan@example.com' &&
        firstRecord.age === '30') {
      console.log('✓ Test 2 pasado');
      passed++;
    } else {
      console.log('✗ Test 2 fallado: estructura incorrecta');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 2 fallado:', error.message);
    failed++;
  }

  // Test 3: Guardar JSON en archivo
  try {
    console.log('\nTest 3: Guardar JSON en archivo');
    const inputPath = path.join(__dirname, '../examples/products.csv');
    const outputPath = path.join(__dirname, '../examples/products.json');
    
    await convertCsvToJson(inputPath, { outputPath, pretty: true });
    
    if (fs.existsSync(outputPath)) {
      const content = fs.readFileSync(outputPath, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length === 4) {
        console.log('✓ Test 3 pasado');
        passed++;
        // Limpiar archivo de prueba
        fs.unlinkSync(outputPath);
      } else {
        console.log('✗ Test 3 fallado: contenido incorrecto');
        failed++;
      }
    } else {
      console.log('✗ Test 3 fallado: archivo no creado');
      failed++;
    }
  } catch (error) {
    console.log('✗ Test 3 fallado:', error.message);
    failed++;
  }

  // Test 4: Archivo no existe
  try {
    console.log('\nTest 4: Manejo de errores (archivo no existe)');
    const inputPath = path.join(__dirname, '../examples/noexiste.csv');
    await convertCsvToJson(inputPath);
    console.log('✗ Test 4 fallado: debería lanzar error');
    failed++;
  } catch (error) {
    if (error.message.includes('not found')) {
      console.log('✓ Test 4 pasado');
      passed++;
    } else {
      console.log('✗ Test 4 fallado: error incorrecto');
      failed++;
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(50));
  console.log(`Resultados: ${passed} pasados, ${failed} fallados`);
  console.log('='.repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('Error ejecutando pruebas:', error);
  process.exit(1);
});
