const csvToJson = require('./index');
const fs = require('fs');
const path = require('path');

async function processAllCSVFiles() {
	try {
		// Leer todos los archivos de la carpeta csv
		const csvFolder = './csv';
		const jsonFolder = './json';

		// Asegurar que existe la carpeta json
		if (!fs.existsSync(jsonFolder)) {
			fs.mkdirSync(jsonFolder, { recursive: true });
		}

		// Obtener todos los archivos .csv
		const files = fs.readdirSync(csvFolder).filter((file) => file.endsWith('.csv'));

		console.log(`📁 Encontrados ${files.length} archivos CSV para procesar\n`);

		// Recorrer cada archivo CSV
		for (const file of files) {
			const csvPath = path.join(csvFolder, file);
			console.log(csvFolder);
			const jsonFileName = file.replace('.csv', '.json');
			const jsonPath = path.join(jsonFolder, jsonFileName);

			console.log(`⏳ Procesando: ${file}...`);

			try {
				const data = await csvToJson(csvPath, jsonPath,";");
				console.log(`✓ ${file} → ${jsonFileName} (${data.length} registros)\n`);
			} catch (error) {
				console.error(`✗ Error procesando ${file}:`, error.message, '\n');
			}
		}

		console.log('🎉 Proceso completado');
	} catch (error) {
		console.error('Error:', error.message);
	}
}

processAllCSVFiles();
