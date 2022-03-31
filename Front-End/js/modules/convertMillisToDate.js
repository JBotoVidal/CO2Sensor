//función para convertir el tiempo en millis en un formato de fecha fácilmente legible
export function convertMillisToDate(millis)
{	
	var dateFromMillis =  new Date (parseInt(millis, 10)); //obtenemos la fevha a partir de los millis devueltos en la consulta
	var date = dateFromMillis.toLocaleString('es-ES', { //escribimos la fecha en español y con el formato deseado
		//weekday: 'narrow', // long, short, narrow
		day: '2-digit', // numeric, 2-digit
		month: 'long', // numeric, 2-digit, long, short, narrow
		//year: 'short',
		hour: 'numeric', // numeric, 2-digit
		minute: 'numeric', // numeric, 2-digit
		second: 'numeric', // numeric, 2-digit
	});
	return date;
}