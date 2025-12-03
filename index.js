const fs = require('fs');
const csv = require('csv-parser');

/**
 * Convierte un archivo CSV a JSON
 * @param {string} inputPath - Ruta al archivo CSV de entrada
 * @param {string} outputPath - Ruta al archivo JSON de salida (opcional)
 * @returns {Promise<Array>} - Promise que resuelve con los datos en formato JSON
 */
function csvToJson(inputPath, outputPath = null) {
  return new Promise((resolve, reject) => {
    const results = [];

    // Verificar que el archivo de entrada existe
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`El archivo de entrada no existe: ${inputPath}`));
    }

    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Si se especifica un archivo de salida, escribir el JSON
        if (outputPath) {
          fs.writeFile(outputPath, JSON.stringify(results, null, 2), (error) => {
            if (error) {
              return reject(new Error(`Error al escribir el archivo de salida: ${error.message}`));
            }
            console.log(`✓ Archivo JSON creado: ${outputPath}`);
            resolve(results);
          });
        } else {
          resolve(results);
        }
      })
      .on('error', (error) => {
        reject(new Error(`Error al leer el archivo CSV: ${error.message}`));
      });
  });
}

module.exports = csvToJson;
