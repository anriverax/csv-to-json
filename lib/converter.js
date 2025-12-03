const fs = require('fs');
const csv = require('csv-parser');

/**
 * Converts a CSV file to JSON format
 * @param {string} inputPath - Path to the CSV file
 * @param {object} options - Conversion options
 * @param {string} options.outputPath - Optional path to write JSON output
 * @param {boolean} options.pretty - Pretty print JSON output
 * @param {string} options.delimiter - CSV delimiter (default: ',')
 * @returns {Promise<Array>} Promise that resolves with the JSON data
 */
function convertCsvToJson(inputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const results = [];
    const {
      outputPath = null,
      pretty = false,
      delimiter = ','
    } = options;

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input file not found: ${inputPath}`));
    }

    fs.createReadStream(inputPath)
      .pipe(csv({ separator: delimiter }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // If output path is provided, write to file
        if (outputPath) {
          const jsonString = pretty 
            ? JSON.stringify(results, null, 2)
            : JSON.stringify(results);
          
          fs.writeFileSync(outputPath, jsonString, 'utf8');
        }
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = {
  convertCsvToJson
};
