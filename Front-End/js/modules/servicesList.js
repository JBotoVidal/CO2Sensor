//importamos los módulos necesarios
import { summary }  from './summary.js';
import { chart } from './chart.js'
import { sensorTable } from './sensorTable.js';
import { downloadData } from './downloadData.js';

//separo el nombre y el aula del sensor que he introducido en el id de la fila, y creo un objeto con los datos del sensor
export function createSensorObject(nameAndRoom)
{
	var split = nameAndRoom.split(',');
	var sensor = {
		name: split[0],
		room: split[1]
	}
	servicesList(sensor);
}

//cuando entro en alguno de los sensores, se ejecuta esta función, nos da una lista de los servicios disponibles
export function servicesList(sensor)
{

	//ahora busco en el array de sensores el sensor que llega como parámetro, así podré saber también en que aula está
	//var currentSensor = $(sensorList).filter(function (item){return item.nombre === sensorName; });
	//var currentSensor = JSON.parse(sensorList).find(element => element[0].nombre === sensorName);
	//genero las migas de pan
	document.getElementById('navigation').innerHTML =
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" id="goToTable" aria-current="page"><a href="#" style="color:#20B2AA;"><i class="bi bi-app"></i> Sensores </a></li>
					<li class="breadcrumb-item active" aria-current="page"> ${sensor.name} - ${sensor.room}</li>
				</ol>
			</nav>
		</div>
	</div><br>`;
	document.getElementById("goToTable").onclick = function() {sensorTable()};
	//y ahora imprimo una lista de servicios
	document.getElementById('info').innerHTML =
	`<p class="h4">Lista de servicios:</p>
	 <div class="list-group">
		<a href="#" id="sensorInfo" class="list-group-item list-group-item-action border-start border-3 border-warning rounded-3 shadow p-4 mb-4 bg-light" aria-current="true">
			<div class="d-flex w-100 justify-content-between">
				<h5 class="mb-1">Resumen</h5>
				<small class="text-muted">Pulse para entrar</small>
			</div>
			<p class="mb-1">Visualiza la actividad del sensor durante la última semana.</p>
			<small class="text-muted">Modifica el emplazamiento del sensor.</small>
		</a>
		<a href="#" id="measureChart" class="list-group-item list-group-item-action border-start border-3 border-primary rounded-3 shadow p-4 mb-4 bg-light" aria-current="true">
			<div class="d-flex w-100 justify-content-between">
				<h5 class="mb-1">Gráficas</h5>
				<small class="text-muted">Pulse para Entrar</small>
			</div>
			<p class="mb-1">Visualiza gráficas lineales con los datos de CO₂, temperatura y humedad tomados por el sensor.</p>
			<small class="text-muted">Compara los datos con el resto de sensores.</small>
		</a>
		<a href="#" id="downloadMeasures" class="list-group-item list-group-item-action border-start border-3 border-danger rounded-3 shadow p-4 mb-4 bg-light" aria-current="true">
			<div class="d-flex w-100 justify-content-between">
				<h5 class="mb-1">Descarga</h5>
				<small class="text-muted">Pulse para Entrar</small>
			</div>
			<p class="mb-1">Descárgate las medidas tomadas por los sensores en formato 'CSV'.</p>
			<small class="text-muted">Elige un intervalo de tiempo.</small>
		</a>
	</div>`;
	
	//añadimos funcionalidad a los servicios, al hacer click en cada uno de ellos se ejecuta la función correspondiente
	document.getElementById("sensorInfo").onclick = function() {summary(sensor)};
	document.getElementById("measureChart").onclick = function() {chart(sensor)};
	document.getElementById("downloadMeasures").onclick = function() {downloadData(sensor)};
}