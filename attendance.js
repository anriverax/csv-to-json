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
					const { eventTypeId, ...otherProps } = event;
					results.push({
						...otherProps,
						eventInstanceId: matchingInstance.id,
					});
				} else {
					console.log(
						`  ❌ No se encontró una instancia para el responsable ${event.responsableId} con el id ${event.id}`
					);
				}
			});
		});

		console.log(`\n✅ Total de registros procesados: ${results.length}`);

		// Paso 3: Leer attendance.json y comparar con results
		console.log('\n🔄 Comparando con attendance.json...');
		const attendanceData = fs.readFileSync(attendanceFilePath, 'utf8');
		const attendanceRecords = JSON.parse(attendanceData);

		// Crear un mapa de results usando el id como clave para búsqueda rápida
		const resultsMap = new Map();
		results.forEach((result) => {
			resultsMap.set(Number(result.id), result);
		});

		const updatedAttendanceRecords = [];
		const duplicateAttendanceRecords = [];
		const uniqueKey = new Set(); // Aplicar regla @@unique([personRoleId, eventInstanceId])
		let matchedCount = 0;
		let duplicateCount = 0;

		// Recorrer cada registro de attendance.json
		attendanceRecords.forEach((attendanceRecord) => {
			// Comparar eventId contra el id de results
			const matchingResult = resultsMap.get(Number(attendanceRecord.eventId));

			if (matchingResult) {
				// Si hay coincidencia, devolver el objeto de attendance.json
				// reemplazando eventId por eventInstanceId
				const { eventId, ...otherAttendanceProps } = attendanceRecord;
				const record = {
					...otherAttendanceProps,
					eventInstanceId: matchingResult.eventInstanceId,
				};

				// Verificar unicidad de la combinación personRoleId + eventInstanceId
				const key = `${record.personRoleId}||${record.eventInstanceId}`;
				if (!uniqueKey.has(key)) {
					uniqueKey.add(key);
					updatedAttendanceRecords.push(record);
					matchedCount++;
				} else {
					// Registros duplicados por la restricción @@unique
					duplicateAttendanceRecords.push({
						...record,
						reason: `Duplicate: personRoleId=${record.personRoleId}, eventInstanceId=${record.eventInstanceId}`,
					});
					duplicateCount++;
				}
			}
		});

		console.log(`✓ ${matchedCount} registros únicos guardados`);
		console.log(`✓ ${duplicateCount} registros duplicados eliminados`);

		// Guardar en JSON
		console.log('\n💾 Guardando JSON...');
		fs.writeFileSync(
			updatedEventFilePath,
			JSON.stringify(updatedAttendanceRecords, null, 2),
			'utf8'
		);
		console.log(`✓ JSON guardado en: ${updatedEventFilePath}`);

		// Guardar registros duplicados en JSON
		const duplicateFilePath = path.join(__dirname, 'json', 'duplicate_attendance.json');
		fs.writeFileSync(
			duplicateFilePath,
			JSON.stringify(duplicateAttendanceRecords, null, 2),
			'utf8'
		);
		console.log(`✓ JSON de duplicados guardado en: ${duplicateFilePath}`);

		// Guardar en CSV (delimitador ; sin encabezado)
		console.log('\n💾 Guardando CSV...');
		const csvFilePath = path.join(__dirname, 'json', 'updated_attendance.csv');

		if (updatedAttendanceRecords.length > 0) {
			const csvLines = updatedAttendanceRecords.map((row) => {
				return `${row.personRoleId};${row.checkIn};${row.checkOut};${row.status};${row.comment};${row.justificationUrl};${row.coordenates};${row.modality};${row.createdAt};${row.updatedAt};${row.createdBy};${row.updatedBy};${row.eventInstanceId}`;
			});
			fs.writeFileSync(csvFilePath, csvLines.join('\n'), 'utf8');
			console.log(`✓ CSV guardado en: ${csvFilePath}`);
		}

		// Guardar registros duplicados en CSV
		const duplicateCsvFilePath = path.join(__dirname, 'json', 'duplicate_attendance.csv');
		if (duplicateAttendanceRecords.length > 0) {
			const csvLines = duplicateAttendanceRecords.map((row) => {
				return `${row.personRoleId};${row.checkIn};${row.checkOut};${row.status};${row.comment};${row.justificationUrl};${row.coordenates};${row.modality};${row.createdAt};${row.updatedAt};${row.createdBy};${row.updatedBy};${row.eventInstanceId};${row.reason}`;
			});
			fs.writeFileSync(duplicateCsvFilePath, csvLines.join('\n'), 'utf8');
			console.log(`✓ CSV de duplicados guardado en: ${duplicateCsvFilePath}`);
		}
	} catch (error) {
		console.error('Error al procesar eventos:', error);
	}
}

// Ejecutar el proceso
processEvents().catch(console.error);
