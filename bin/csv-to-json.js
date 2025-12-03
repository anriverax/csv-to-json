#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const { convertCsvToJson } = require('../lib/converter');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('csv-to-json')
  .description('Convierte archivos CSV a formato JSON')
  .version(packageJson.version)
  .argument('<input>', 'Archivo CSV de entrada')
  .option('-o, --output <file>', 'Archivo JSON de salida')
  .option('-p, --pretty', 'Formato JSON con indentación', false)
  .option('-d, --delimiter <char>', 'Delimitador CSV', ',')
  .action(async (input, options) => {
    try {
      const inputPath = path.resolve(input);
      const outputPath = options.output ? path.resolve(options.output) : null;

      console.log(`Convirtiendo ${input}...`);

      const data = await convertCsvToJson(inputPath, {
        outputPath,
        pretty: options.pretty,
        delimiter: options.delimiter
      });

      if (outputPath) {
        console.log(`✓ JSON guardado en: ${outputPath}`);
        console.log(`✓ ${data.length} registros convertidos`);
      } else {
        // Si no se especifica archivo de salida, imprimir en consola
        const jsonString = options.pretty 
          ? JSON.stringify(data, null, 2)
          : JSON.stringify(data);
        console.log(jsonString);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
