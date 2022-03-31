//importamos los módulos necesarios
import { errorMessage }  from './errorMessage.js';
import { spinner }  from './const.js';
import { sensorTable } from './sensorTable.js';
import { servicesList } from './servicesList.js';
import { convertMillisToDate } from './convertMillisToDate.js';

//si se elige el servicio de resumen, se ejecuta esta función, que recibe el objeto con el nombre y ubicación del sensor
export function summary(sensor)
{	//inyecto las migas de pan con los enlaces correspondientes para volver atrás
	document.getElementById('navigation').innerHTML =
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-app"></i> Sensores</a></li>
					<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> ${sensor.name} - ${sensor.room}</a></li>
					<li class="breadcrumb-item active" aria-current="page">Resumen</li>
				</ol>
			</nav>
		</div>
	</div>
	<div class="row" style="margin-top:30px;">
		<h4 class="text-xl-center">Estado del sensor durante la última semana</h4>
	</div>`;
	//doy funcionalidad a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {sensorTable()};

	//y mientras recibo una repuesta saco por pantalla un spinner
	document.getElementById('info').innerHTML =
	`${spinner}
	<div class="row">
		<div class="col-xl-6" id="summary" style="padding-top:20px;">
		</div>
		<div class="col-xl-6" id="pie" style="min-height:360px;max-width:500px;padding-top:15px; overflow: hidden;">
		</div>
	</div>`;
	//realizo la petición a la base de datos
	$.ajax({
		type: "GET",
		url: 'php/getSummary.php',
		data: {
			"name": sensor.name,
		},
		success: function(response)
		{
			//si recibo una respuesta nula, significa que no hay datos durante la última semana
			if (JSON.parse(response) == null)
			{
				document.getElementById('info').innerHTML = errorMessage("No te preocupes, realmente no es para tanto, pero no existen datos de la última semana. <br> ¡Comprueba que el sensor esté conectado!");
			}
			else
			{
				//si la respuesta no es nula, voy a insertar una lista con los datos obtenidos, y además, un gráfico de sectores
				var info="";
				$.each(JSON.parse(response), function (i, item) {

					var datemaxco2= convertMillisToDate(item.datemax);
					var dateminco2= convertMillisToDate(item.datemin);
					var datemaxtemp= convertMillisToDate(item.datetmax);
					var datemintemp= convertMillisToDate(item.datetmin);
					info =
					`<ul class="list-group list-group-flush" style="max-width:600px;">
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Nombre: </small><strong> ${item.name} </strong></p></li>
						<li class="list-group-item" id="room"><p class="h6 text-left"><small class="text-muted">Estancia: </small><strong> ${item.room} </strong><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" style="color:#20B2AA;"><i class="bi bi-pen"></i>(Modifica el emplazamiento)</a></p></li>
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">MAC del sensor: </small><strong> ${item.mac} </strong></p></li>
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Máximo valor CO₂ : </small><strong> ${item.co2max} p.p.m. | ${datemaxco2}</p></strong></li>
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Mínimo valor CO₂ : </small><strong> ${item.co2min} p.p.m. | ${dateminco2}</p></strong></li>
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Máximo valor temperatura : </small><strong> ${item.tempmax} °C | ${datemaxtemp}</p></strong></li>
						<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Mínimo valor temperatura : </small><strong> ${item.tempmin} °C | ${datemintemp}</p></strong></li>
					</ul>
					<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalLabel">Modificar emplazamiento</h5>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									<form id="form">
										<div class="mb-3">
											<label for="recipient-name" class="col-form-label">Si cambias de estancia tu sensor, escribe su nuevo emplazamiento aqui:</label>
											<input type="text" class="form-control" id="estancia" onkeypress="return tableInputKeyPressEnter(event)">
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
									<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="changeRoom" style="background-color:#20B2AA; border-color:#20B2AA;">Enviar petición</button>
								</div>
							</div>
						</div>
					</div>`;
					google.charts.load('42', {'packages':['corechart']});
					google.charts.setOnLoadCallback(drawChart);
					//
					function drawChart() {
						var data = google.visualization.arrayToDataTable([
								['Nivel', 'Tiempo'],
								['Aceptable (<700) p.p.m.', parseInt(item.acceptable)],
								['Precaución (700 - 1000) p.p.m.', parseInt(item.precaution)],
								['Alto (>1000) p.p.m.', parseInt(item.high)]
							]);
						//definimos las opciones del gráfico
						var options = {
							title:'Tiempo en cada nivel entre semana en horario laboral (de 8 a 20 horas)',
							titleTextStyle:{fontSize:13},
							'height':'100%',
							'width': '100%',
							pieSliceText:'percentage',//queremos mostrar los valores solamente en porcentages
							legend: {position: 'bottom', textStyle: {color: 'black', fontSize: 11}},
							tooltip: {showColorCode:true, text:'percentage', textStyle: {color: 'black'}, showColorCode: true},
							chartArea : {'width': '100%', 'height': '80%'},
							slices: {0: {color: '#2E8B57'}, 1:{color: '#FFD700'}, 2:{color: '#DC143C'}},
							is3D: true,
						};
						//borro el spinner
						document.getElementById('spinner').innerHTML ="";
						//introduzco el gráfico en la página
						var chart = new google.visualization.PieChart(document.getElementById('pie'));
						chart.draw(data, options);
					}
					//y finalmente inyecto la información en la parte izquierda de la página
					document.getElementById('spinner').innerHTML ="";
					document.getElementById('summary').innerHTML +=info;
					//finalmente añado funcionalidad al botón de cambiar ubicación del sensor, que ejecuta la función changeInfo
					var name = document.getElementById("estancia"); 
					document.getElementById("changeRoom").onclick = function() {changeInfo(sensor,name.value)};
				});		
			}
		},
		error: function(){//en caso de error en la petición, inyecto el mensaje informatico
			document.getElementById('info').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
		},
		async: true //como siempre, petición asíncrona para no bloquear la pagina esperando la respuesta
	});
	
	//función para bloquear el uso de la tecla intro al introducir una ubicación, ya que de otra manera,
	//si pulsamos intro la página se envía el formulario a si misma.
	function tableInputKeyPressEnter(e){
		e=e||window.event;
		var key = e.keyCode;
		if(key==13)
			return false;
	}

    //función que se ejecuta cuando pulsamos enviar en el formulario de ubicación
    function changeInfo(sensor,room)
    {	//si introducimos un valor vacío, mostramos un mensaje de alerta y salimos
        if (room == "") {
            alert("Debes escribir un nombre, no puedes dejar el campo vacío.");
            return false;
        }
        //en caso contrario, enviamos una petición ajax a la parte de back para modificar el contenido del campo "aula"
        else{
            $.ajax({
                type: "GET",//tipo de petición
                url: 'php/changeSensorInfo.php',//dirección del script
                data: {//datos añadidos
                    "name": sensor.name,
                    "aula": room
                },
                success: function(response) //en caso de que todo vaya bien
                {
                    alert(response); //mostramos la respuesta en un mensaje de alerta
                    //también tenemos que modificar el valor en la web, tanto en la información de la lista como en las migas de pan
                    sensor.room=room;
                    document.getElementById('room').innerHTML =
                    `<p class="h6 text-left"><small class="text-muted">Estancia: </small><strong> ${sensor.room} </strong><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" style="color:#20B2AA;"><i class="bi bi-pen"></i>(Modifica el emplazamiento)</a></p>`;
                    document.getElementById('services').innerHTML =
                    `${sensor.name} - ${sensor.room}`;
                },
                error: function(){//en caso de error mostramos una alerta informativa
                    alert("Ha habido algún error, inténtalo de nuevo :(");
            },
            async: true//como siempre, petición asíncrona
            });
        }
    }
};