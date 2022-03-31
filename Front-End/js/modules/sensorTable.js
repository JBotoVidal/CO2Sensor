//importamos los módulos necesarios
import { errorMessage }  from './errorMessage.js';
import { measureLimits, spinner }  from './const.js';
import { createSensorObject } from './servicesList.js';
import { convertMillisToDate } from './convertMillisToDate.js';

//se llama al entrar en la página, crea la tabla con la información de los sensores asociados a la cuenta
export function sensorTable()
{
	//inyecto el html para el menú de navegación
	document.getElementById('navigation').innerHTML = 	
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><i class="bi bi-app"></i> Sensores </li>
				</ol>
			</nav>
		</div>
	</div>
	<div class="row">
		<div class="col-6">
			<a id="reloadTable" href="#" float-left style="color:#20B2AA;"><i class="bi bi-arrow-repeat"></i> Actualizar tabla</a>
		</div>
	</div>`;
	//añadimos funcionalidad al botón actualizar
	document.getElementById("reloadTable").onclick = function() {sensorTable()};
	//mientras recibimos respuesta de la base de datos, mostramos un spinner
	document.getElementById('info').innerHTML = `${spinner}`;

	//hacemos la petición a la parte de back
	$.ajax({
		type: "GET", //la petición será tipo get
		url: 'php/getSensorTable.php', //añadimos la url del script de php
		data: 'idusuario='+id, //y los parametros
		success: function(response) //en caso de obtener una respuesta
		{
			var table=
			`<div id="sensorTable">
				<table class="table table-striped table-sm table-responsive table-hover caption-top" id="dataTable"><caption class="h4">Lista de sensores:</caption>
					<thead class="table-light">
						<tr>
							<th class="text-center">Nombre</th>
							<th class="text-center">Estancia</th>
							<th class="text-center">Última medida <abbr title="(CO₂) Dióxido de Carbono" class="initialism">CO₂</abbr></th>
							<th class="text-center">Nivel</th>
							<th class="text-center">Temperatura</th>
							<th class="text-center">Humedad</th>
							<th class="text-center">Fecha última medida</th>
							<th class="text-center">Funcionamiento</th>
						</tr>
					</thead>`;
			//recorro cada elemento de la respuesta
			$.each(JSON.parse(response), function (i, item) {
			//para cada fila, asigno el valor correspondiente a cada variable
				var level = co2Level(item.co2); //mostrará el mensaje correspondiente al nivel de co2
				var colorco2 = co2Color(item.co2); //para colorear la casilla
				var state = obtainState(parseInt(item.date, 10)); //obtener si el sensor está conectado o por contra no está posteando datos
				var colorstate = stateColor(state); //si está inactico, coloreamos la casilla también
				var date = convertMillisToDate(item.date);
				//voy inyectando el html con cada fila de la tabla
				table +=
				`<tr>
					<td class="text-center clickable" id="${item.name+','+item.room}" ><a href="#" style="color:#20B2AA;"><i id="hola" class="bi bi-eye" id="${item.name+','+item.room}"  aria-hidden="true"></i> ${item.name} </td>
					<td class="text-center"> ${item.room} </td>
					<td class="text-center"> ${item.co2} <abbr title="Concentración de CO₂ en Partes Por Millón" class="initialism">(p.p.m.)</abbr></td>
					<td  ${colorco2}> ${level} </td>
					<td class="text-center"> ${item.temp} <abbr title="Temperatura ambiente en grados centigrados" class="initialism">°C</abbr></td>
					<td class="text-center"> ${item.humidity} <abbr title="Humedad relativa del aire en %" class="initialism">%</abbr></td>
					<td class="text-center"> ${date} </td>
					<td  ${colorstate}> ${state} </td>
				</tr>`;
        	});
			//finalmente cierro la tabla
			table +=`</table></div>`;
			//y la inyecto en el html
            document.getElementById('info').innerHTML = table;
			//ahora capturamos un evento, si en la tabla, clickamos alguna de las casillas del nombre del sensor (hemos añadido click a la clase para poder seleccionarla)
			//se disparará el evento, que llamará a la función split con el id de la casilla clicada
			document.getElementById('sensorTable').addEventListener('click', e => {
				let td = e.target.closest('td[class="text-center clickable"]');
				if (td) {
					createSensorObject(e.target.closest('td[class="text-center clickable"]').id);
				}
			});
        },
		//en caso de error en el servidor
	  	error: function(){
			//sacamos por pantalla un mensaje de error 
			document.getElementById('info').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
	  	},
		//la petición será asincrona para no quedarnos bloqueados esperando la respuesta
	  	async: true
    });

	//funciones que solo son usadas dentro de esta misma function, para la creación de la tabla
	//en función del nivel de co2, devolvemos su mensaje asociado
	function co2Level(co2)
	{
		if (co2 <= measureLimits.acceptable )
		{
			return "Aceptable";
		}
		if (co2 <= measureLimits.precaution )
		{
			return "Precaución";
		}
		else {
			return "Alto";
		}
	}

	//en función del nivel de co2, vamos a colorear la casilla de un color u otro
	function co2Color(co2)
	{
		if (co2 <= measureLimits.acceptable )
		{
			return "class='table-success text-center'";
		}
		if (co2 <= measureLimits.precaution )
		{
			return "class='table-warning text-center'";
		}
		else {
			return "class='table-danger text-center'";
		}
	}

	//si el sensor está inactivo, vamos a colorear la casilla de azul
	function stateColor(state)
	{
		if (state == 'Inactivo' )
		{
			return "class='table-primary text-center'";
		}
		else {
			return "class='text-center'";
		}
	}

	//comparamos el tiempo actual con el tiempo de la última medida recibida, si la diferencia es mayor a 10 minutos, el estado del sensor será inactivo
	function obtainState(date)
	{
		var currentDate = new Date();
		var currentMilliseconds = currentDate.getTime();
		//var f = fecha.split(/[- :]/);
		//var measureDate = new Date(Date.UTC(f[0], f[1]-1, f[2], f[3], f[4], f[5]));
		//var measureMilliseconds = measureDate.getTime();
		if (currentMilliseconds - date > 600000  )
		{
			return "Inactivo";
		}
		else {
			return "Correcto";
		}
	}
};