const fs = require('fs');
const path = require('path');

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

const eventFilePath = path.join(__dirname, 'json', 'event.json');
const eventInstanceFilePath = path.join(__dirname, 'json', 'eventInstance.json');
const attendanceFilePath = path.join(__dirname, 'json', 'attendance.json');
const updatedEventFilePath = path.join(__dirname, 'json', 'updated_attendance.json');

async function processEvents() {
	try {
		console.log('🔄 Procesando eventos...\n');

		// Leer el archivo event.json
		const eventData = fs.readFileSync(eventFilePath, 'utf8');
		const events = JSON.parse(eventData);

		// Leer el archivo eventInstance.json
		const eventInstanceData = fs.readFileSync(eventInstanceFilePath, 'utf8');
		const eventInstances = JSON.parse(eventInstanceData);

		const results = [];

		// Paso 1: Recorrer cada evento en newEvents y buscar coincidencias por nombre
		newEvents.forEach((newEvent) => {
			console.log(`Procesando: ${newEvent.name} (ID: ${newEvent.id})`);

			// Buscar todos los eventos que coincidan con el nombre en event.json
			const matchingEvents = events.filter(
				(event) => event.name && event.name.toLowerCase() === newEvent.name.toLowerCase()
			);

			console.log(`  ✓ ${matchingEvents.length} coincidencias en event.json`);

			// Buscar las instancias usando el ID de newEvent en eventInstance.json
			const matchingInstances = eventInstances.filter(
				(instance) => Number(instance.eventId) === Number(newEvent.id)
			);

			console.log(`  ✓ ${matchingInstances.length} instancias en eventInstance.json`);

			// Paso 2: Agregar la propiedad newEventId con el id de eventInstance
			matchingEvents.forEach((event) => {
				// Buscar solo la primera instancia que coincida con el responsable
				const matchingInstance = matchingInstances.find(
					(instance) => Number(event.responsableId) === Number(instance.responsibleId)
				);

				// Solo agregar si encontramos una instancia
				if (matchingInstance) {
					results.push({
						...event,
						eventInstanceId: matchingInstance.id,
					});
				} else {
					console.log(
						`  ❌ No se encontró una instancia para el responsable ${event.responsableId} con el id ${event.id}`
					);
				}
			});
		});

		console.log(`\n✅ Total de registros: ${results.length}`); // Guardar en JSON
		console.log('💾 Guardando JSON...');
		fs.writeFileSync(updatedEventFilePath, JSON.stringify(results, null, 2), 'utf8');
		console.log(`✓ JSON guardado en: ${updatedEventFilePath}`);

		// Guardar en CSV (delimitador ; sin encabezado)
		console.log('💾 Guardando CSV...');
		const csvFilePath = path.join(__dirname, 'json', 'updated_attendance.csv');

		if (results.length > 0) {
			const csvLines = results.map((row) => {
				return `${row.id};${row.name};${row.responsableId};${row.createdAt};${row.updatedAt};${row.createdBy};${row.updatedBy};${row.newEventId}`;
			});
			fs.writeFileSync(csvFilePath, csvLines.join('\n'), 'utf8');
			console.log(`✓ CSV guardado en: ${csvFilePath}`);
		}
	} catch (error) {
		console.error('Error al procesar eventos:', error);
	}
}

// Ejecutar el proceso
processEvents().catch(console.error);
