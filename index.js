const fs = require('fs');
const { promisify } = require('util');
const csv = require('csv-parser');

const writeFileAsync = promisify(fs.writeFile);

/**
 * Convierte un archivo CSV a JSON
 * @param {string} inputPath - Ruta al archivo CSV de entrada
 * @param {string} outputPath - Ruta al archivo JSON de salida (opcional)
 * @returns {Promise<Array>} - Promise que resuelve con los datos en formato JSON
 */
function csvToJson(inputPath, outputPath = null) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    const stream = fs.createReadStream(inputPath);
    
    // Handle stream errors before piping
    stream.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(`El archivo de entrada no existe: ${inputPath}`));
      } else {
        reject(new Error(`Error al leer el archivo CSV: ${error.message}`));
      }
    });

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Si se especifica un archivo de salida, escribir el JSON
        if (outputPath) {
          try {
            await writeFileAsync(outputPath, JSON.stringify(results, null, 2));
            console.log(`✓ Archivo JSON creado: ${outputPath}`);
            resolve(results);
          } catch (error) {
            reject(new Error(`Error al escribir el archivo de salida: ${error.message}`));
          }
        } else {
          resolve(results);
        }
      })
      .on('error', (error) => {
        reject(new Error(`Error al procesar el archivo CSV: ${error.message}`));
      });
  });
}

module.exports = csvToJson;
