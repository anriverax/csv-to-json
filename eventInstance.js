const fs = require('fs');
const path = require('path');
const readline = require('readline');

const newEvents = [
	{ id: 1, name: 'Comunidad de práctica' },
	{ id: 2, name: 'Mentoría en pareja' },
	{ id: 3, name: 'Mentoría individual' },
	{ id: 4, name: 'Mentoría situacional' },
	{ id: 5, name: 'Seminario de apertura' },
	{ id: 6, name: 'Seminario de clausura' },
	{ id: 7, name: 'Seminario intermodular 1' },
	{ id: 8, name: 'Seminario intermodular 2' },
	{ id: 9, name: 'Sesión sincrónica' },
	{ id: 10, name: 'Taller 1' },
	{ id: 11, name: 'Taller 2' },
	{ id: 12, name: 'Taller 3' },
];

// Configurar readline para leer desde la consola
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const eventFilePath = path.join(__dirname, 'json', 'event.json');
const eventModuleFilePath = path.join(__dirname, 'json', 'eventModule.json');
const updatedEventFilePath = path.join(__dirname, 'json', 'updated_event.json');

function searchEvents(searchTerm) {
	try {
		// Leer el archivo event.json
		const data = fs.readFileSync(eventFilePath, 'utf8');
		const events = JSON.parse(data);

		// Buscar eventos que contengan el texto buscado (case insensitive)
		const searchLower = searchTerm.toLowerCase();
		const matchingEvents = events.filter(
			(event) => event.name && event.name.toLowerCase().includes(searchLower)
		);

		if (matchingEvents.length === 0) {
			console.log(`\nNo se encontraron eventos que contengan: "${searchTerm}"`);
		} else {
			console.log(
				`\n✓ Se encontraron ${matchingEvents.length} eventos que contienen: "${searchTerm}"\n`
			);

			// Buscar el evento en newEvents para obtener su id
			const newEvent = newEvents.find(
				(ne) => ne.name && ne.name.toLowerCase().includes(searchLower)
			);

			if (!newEvent) {
				console.log(`\n⚠ No se encontró "${searchTerm}" en newEvents. No se puede continuar.`);
				return;
			}

			console.log(`✓ Evento encontrado en newEvents: ID ${newEvent.id} - ${newEvent.name}`);

			// Leer el archivo eventModule.json
			const eventModuleData = fs.readFileSync(eventModuleFilePath, 'utf8');
			const eventModules = JSON.parse(eventModuleData);

			// Buscar coincidencias en eventModule.json
			const results = [];
			const now = new Date();
			const timestamp = now.toISOString().replace('T', ' ').replace('Z', '').substring(0, 23);

			matchingEvents.forEach((event) => {
				const matchingModules = eventModules.filter((module) => module.eventId === event.id);

				if (matchingModules.length === 0) {
					// Si no hay módulos asociados, crear un registro con trainingModuleId null
					results.push({
						eventId: newEvent.id,
						trainingModuleId: null,
						responsableId: event.responsableId,
						createdAt: timestamp,
						updatedAt: timestamp,
						createdBy: 2619,
						updatedBy: 2619,
					});
				} else {
					// Si hay módulos asociados, crear un registro por cada módulo
					matchingModules.forEach((module) => {
						results.push({
							eventId: newEvent.id,
							trainingModuleId: module.trainingModuleId,
							responsableId: event.responsableId,
							createdAt: timestamp,
							updatedAt: timestamp,
							createdBy: 2619,
							updatedBy: 2619,
						});
					});
				}
			});

			console.log(`✓ Se encontraron ${results.length} registros antes de eliminar duplicados`);

			// Eliminar duplicados basándose en eventId + trainingModuleId + responsableId
			const uniqueResults = [];
			const seen = new Set();

			results.forEach((result) => {
				const key = `${result.eventId}-${result.trainingModuleId}-${result.responsableId}`;
				if (!seen.has(key)) {
					seen.add(key);
					uniqueResults.push(result);
				}
			});

			console.log(`✓ ${uniqueResults.length} registros únicos después de eliminar duplicados`);

			// Guardar en JSON
			fs.writeFileSync(updatedEventFilePath, JSON.stringify(uniqueResults, null, 2), 'utf8');
			console.log(`✓ JSON guardado en: ${updatedEventFilePath}`);

			// Guardar en CSV (delimitador ; sin encabezado)
			const csvFilePath = path.join(__dirname, 'json', 'updated_event.csv');
			const csvRows = uniqueResults
				.map(
					(row) =>
						`${row.eventId};${row.trainingModuleId};${row.responsableId};${row.createdAt};${row.createdBy};${row.updatedAt};${row.updatedBy}`
				)
				.join('\n');
			fs.writeFileSync(csvFilePath, csvRows, 'utf8');
			console.log(`✓ CSV guardado en: ${csvFilePath}`);

			console.log(`\nPrimeros resultados:`);
			uniqueResults.slice(0, 5).forEach((result, index) => {
				console.log(
					`  ${index + 1}. EventId: ${result.eventId}, TrainingModuleId: ${
						result.trainingModuleId
					}, ResponsableId: ${result.responsableId}`
				);
			});

			if (uniqueResults.length > 5) {
				console.log(`  ... y ${uniqueResults.length - 5} más`);
			}
		}
	} catch (error) {
		console.error('Error al buscar eventos:', error);
	}
}

// Preguntar al usuario qué evento buscar
rl.question('Ingrese el nombre del evento a buscar: ', (searchTerm) => {
	if (searchTerm.trim() === '') {
		console.log('Debe ingresar un texto para buscar.');
		rl.close();
		return;
	}

	searchEvents(searchTerm.trim());
	rl.close();
});
