//defino el tiempo en horas para los 4 diferentes lapsos de tiempo que puedo elegir en los gráficos
const printTime = {
	eightHours: 8,
	twentyFourHours: 24,
	twoWeeks: 336,
	fourMonths: 2880
};
Object.freeze(printTime); //impedimos que se añadan nuevas propiedades y que se borren las existentes

//defino los tipos de datos recogidos por el sensor
const measure  = {
    co2  : 'co2',
    temperature : 'temp',
    humidity : 'humedad'
};
Object.freeze(measure); //impedimos que se añadan nuevas propiedades y que se borren las existentes

//defino los límites de CO2 para los diferentes niveles
const measureLimits  = {
    acceptable  : 700,
    precaution : 1000
};
Object.freeze(measureLimits); //impedimos que se añadan nuevas propiedades y que se borren las existentes

//defino las opciones de lenguaje para los gráficos de highcharts, por defecto estarían en inglés
Highcharts.setOptions({
	lang: {
		shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		months: [
			'Enero', 'Febrero', 'Marzo', 'Abril',
			'Mayo', 'Junio', 'Julio', 'Agosto',
			'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		],
		weekdays: [
			'Domingo', 'Lunes', 'Martes', 'Miércoles',
			'Jueves', 'Viernes', 'Sabado'
		],
		resetZoom: "Restablecer Zoom",
		resetZoomTitle: "Restablecer",
		}
});

//se llama al entrar en la página, crea la tabla con la información de los sensores asociados a la cuenta
function table()
{
	//inyecto el html para el menú de navegación
	document.getElementById('usuario').innerHTML = 	
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><i class="bi bi-house"></i> '+center+'</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
	'</div>'+
	'<div class="row">'+
		'<div class="col-6">'+
			'<a id="reloadTable" href="#" float-left style="color:#20B2AA;"><i class="bi bi-arrow-repeat"></i> Actualizar tabla</a>'+
		'</div>'+
	'</div>';
	//añadimos funcionalidad al botón actualizar
	document.getElementById("reloadTable").onclick = function() {table()};
	//mientras recibimos respuesta de la base de datos, mostramos un spinner
	document.getElementById('info').innerHTML =
	'<div class="d-flex justify-content-center" style="padding-top: 150px;">'+
		'<div class="spinner-grow" role="status">'+
			'<span class="visually-hidden"></span>'+
		'</div>'+
	'</div>';
	//hacemos la petición a la parte de back
	$.ajax({
		type: "GET", //la petición será tipo get
		url: 'getSensorTable.php', //añadimos la url del script de php
		data: 'idescuela='+id, //y los parametros
		success: function(response) //en caso de obtener una respuesta
		{
			/*document.getElementById('info').innerHTML =	
			'<table id="example" class="display" width="100%"></table>';
			var dataSet="";
			$.each(JSON.parse(response), function (i, item) {
				dataSet += "["+item.nombre+","+item.aula+","+item.co2+","+item.temp+","+item.humedad+","+item.fecha+"],";
			});
				
			$('#example').DataTable( {
				data: [dataSet],
				columns: [
					{ title: "Nombre" },
					{ title: "Estancia" },
					{ title: "Última medida <abbr title='(s) Dióxido de Carbono' class='initialism'>CO₂" },
					{ title: "Nivel" },
					{ title: "Temperatura" },
					{ title: "Humedad" },
					{ title: "Fecha última medida" }
				]
			} );*/
			//inyecto la cabecera de la tabla con sus respectivos campos
			var table=
			'<div id="sensorTable">'+
				'<table class="table table-striped table-sm table-responsive table-hover caption-top" id="dataTable"><caption class="h4">Lista de sensores:</caption>'+
					'<thead class="table-light">'+
						'<tr>'+
							'<th class="text-center">Nombre</th>'+
							'<th class="text-center">Estancia</th>'+
							'<th class="text-center">Última medida <abbr title="(CO₂) Dióxido de Carbono" class="initialism">CO₂</abbr></th>'+
							'<th class="text-center">Nivel</th>'+
							'<th class="text-center">Temperatura</th>'+
							'<th class="text-center">Humedad</th>'+
							'<th class="text-center">Fecha última medida</th>'+
							'<th class="text-center">Funcionamiento</th>'+
						'</tr>'+
					'</thead>';
			//recorro cada elemento de la respuesta
			$.each(JSON.parse(response), function (i, item) {
			//para cada fila, asigno el valor correspondiente a cada variable
				level = co2Level(item.co2); //mostrará el mensaje correspondiente al nivel de co2
				colorco2 = co2Color(item.co2); //para colorear la casilla
				state = obtainState(parseInt(item.date, 10)); //obtener si el sensor está conectado o por contra no está posteando datos
				colorstate = stateColor(state); //si está inactico, coloreamos la casilla también
				millisToDate =  new Date (parseInt(item.date, 10)); //obtenemos la en español fecha a partir de los millis devueltos en la consulta
				date = millisToDate.toLocaleString('es-ES', {
					//weekday: 'narrow', // long, short, narrow
					day: '2-digit', // numeric, 2-digit
					month: 'short', // numeric, 2-digit, long, short, narrow
					//year: 'short',
					hour: 'numeric', // numeric, 2-digit
					minute: 'numeric', // numeric, 2-digit
					second: 'numeric', // numeric, 2-digit
				});
				//voy inyectando el html con cada fila de la tabla
				table +=
				'<tr>'+
					'<td class="text-center"><a href="#" id="' + item.name + ',' + item.room + '" onclick="split(this.id);" style="color:#20B2AA;"><i class="bi bi-eye"  aria-hidden="true"></i> ' + item.name + '</td>'+
					'<td class="text-center">' + item.room + '</td>'+
					'<td class="text-center">' + item.co2 + ' <abbr title="Concentración de CO₂ en Partes Por Millón" class="initialism">(p.p.m.)</abbr></td>'+
					'<td  '+colorco2+'>' + level +'</td>'+
					'<td  class="text-center">' + item.temp +' <abbr title="Temperatura ambiente en grados centigrados" class="initialism">°C</abbr></td>'+
					'<td  class="text-center">' + item.humidity +' <abbr title="Humedad relativa del aire en %" class="initialism">%</abbr></td>'+
					'<td class="text-center">' + date + '</td>'+
					'<td  '+colorstate+'>' + state +'</td>'+
				'</tr>';
        	});
			//finalmente cierro la tabla
			table +='</table></div>';
			//y la inyecto en el html
            document.getElementById('info').innerHTML = table;
        },
		//en caso de error en el servidor
	  	error: function(){
			//sacamos por pantalla un mensaje de error 
			document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡Qué pena!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>Parece que hay un error. <br> Intentalo de nuevo más tarde</p>'+
				'</div>';
	  	},
		//la petición será asincrona para no quedarnos bloqueados esperando la respuesta
	  	async: true
    });
};

//se ejecuta al pulsar el enlace de alertas en el menú principal
function alerts()
{
	//inyecto migas de pan para saber que estamos en la sección de alertas
	document.getElementById('usuario').innerHTML = 	
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><i class="bi bi-exclamation-square"></i> Alertas</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
	'</div>';
	//mientras hago la petición y recibo los datos, saco por pantalla un spinner de carga
	document.getElementById('info').innerHTML =
	'<div class="d-flex justify-content-center" style="padding-top: 150px;">'+
		'<div class="spinner-grow" role="status">'+
			'<span class="visually-hidden"></span>'+
		'</div>'+
	'</div>';
	//realizo una petición ajax a la parte de back end para recibir la lista de alertas existentes
	$.ajax({
		type: "GET", //tipo de petición
		url: 'getAlerts.php',//el script está en el mismo directorio
		data: 'idescuela='+id,//parámetro de entrada
		success: function(response)//en caso de recibir respuesta
		{
			if (response == "noresult")//si recibo este mensaje es que no hay alertas, por lo que inyecto un mensaje informativo
			{
				document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡¡Oh oh!!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>Parece que no hay alertas, pero... ¡Anímate! Eso significa que la calidad del aire es buena y no tienes de que preocuparte.</p>'+
				'</div>';
			}
			else //en caso contrario, si hay alarmas
			{
				//inyecto la cabecera de la lista
				var list=
				'<ul class="list-group list-group-flush">';
				
				//recorro cada fila de la respuesta
				$.each(JSON.parse(response), function (i, item) {
				//para cada fila, asigno el valor correspondiente a cada variable
					arrow = setArrow(item.alert);
					list +=
					'<li class="list-group-item fst-italic">'+arrow+'<em> '+item.name+'</em> ubicado en <em>'+item.room+'</em> : <small class="text-muted">'+item.alert+'</small> - '+item.date+'</i></li>';
				});
				list +='</ul>';
				document.getElementById('info').innerHTML = list;
			}
        },
		//en caso de error, vamos a mostrar un mensaje informativo
	  	error: function(){
			document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡Qué pena!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>Parece que hay un error. <br> Intentalo de nuevo más tarde</p>'+
				'</div>';
	  	},
	  	async: true //petición asincrona para no bloquear la aplicación esperando por la respuesta
    });
}

//en función del tipo de alerta imprimiremos un icono u otro
function setArrow(alert)
{
	if ( alert == 'co2 ha subido por encima de 1000 p.p.m.' )
		return ' <i class="bi bi-arrow-up" style="color:red; font-size:20px;"></i>'
	else
		return ' <i class="bi bi-arrow-down" style="color:green; font-size:20px;"></i>'
}	

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

//separo el nombre y el aula del sensor que he introducido en el id de la fila, y creo un objeto con los datos del sensor
function split(nameAndRoom)
{
	var split = nameAndRoom.split(',');
	var sensor = {
		name: split[0],
		room: split[1]
	}
	servicesList(sensor);
}

//cuando entro en alguno de los sensores, se ejecuta esta función, nos da una lista de los servicios disponibles
function servicesList(sensor)
{	//genero las migas de pan
	document.getElementById('usuario').innerHTML =
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><a onclick="table()" href="#" style="color:#20B2AA;"><i class="bi bi-house"></i> '+center+'</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page"> '+sensor.name+' ('+sensor.room+')</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
	'</div>';
	//y ahora imprimo una lista de servicios
	document.getElementById('info').innerHTML =
	'<p class="h4">Lista de servicios:</p>'+
	'<div class="list-group">'+
		'<a href="#" id="sensorInfo" class="list-group-item list-group-item-action border-start border-3 border-warning rounded-3 shadow p-4 mb-4 bg-light" aria-current="true">'+
			'<div class="d-flex w-100 justify-content-between">'+
				'<h5 class="mb-1">Resumen</h5>'+
				'<small class="text-muted">Pulse para entrar</small>'+
			'</div>'+
			'<p class="mb-1">Visualiza la actividad del sensor durante la última semana.</p>'+
			'<small class="text-muted">Modifica el emplazamiento del sensor.</small>'+
		'</a>'+
		'<a href="#" id="measureChart" class="list-group-item list-group-item-action border-start border-3 border-primary rounded-3 shadow p-4 mb-4 bg-light" aria-current="true">'+
			'<div class="d-flex w-100 justify-content-between">'+
				'<h5 class="mb-1">Gráficas</h5>'+
				'<small class="text-muted">Pulse para Entrar</small>'+
			'</div>'+
			'<p class="mb-1">Visualiza gráficas lineales con los datos de CO₂, temperatura y humedad tomados por el sensor.</p>'+
			'<small class="text-muted">Selecciona diferentes lapsos de tiempo.</small>'+
		'</a>'+
		/*'<a href="#" onclick="compareChart()" class="list-group-item list-group-item-action border border-2 border-warning rounded-3 shadow p-4 mb-4 bg-light">'+
			'<div class="d-flex w-100 justify-content-between">'+
				'<h5 class="mb-1">Comparación de gráficas</h5>'+
				'<small class="text-muted"></small>'+
			'</div>'+
			'<p class="mb-1">Compara las mediciones de dos sensores.</p>'+
			'<small class="text-muted">Crea un gráfico lineal con dos sensores.</small>'+
		'</a>'+*/
	'</div>';
	//añadimos funcionalidad a los servicios, al hacer click en cada uno de ellos se ejecuta la función correspondiente
	document.getElementById("sensorInfo").onclick = function() {summary(sensor)};
	document.getElementById("measureChart").onclick = function() {chart(sensor)};
}
//si se elige el servicio de resumen, se ejecuta esta función, que recibe el objeto con el nombre y ubicación del sensor
function summary(sensor)
{	//inyecto las migas de pan con los enlaces correspondientes para volver atrás
	document.getElementById('usuario').innerHTML =
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-house"></i> '+center+'</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> '+sensor.name+' ('+sensor.room+')</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page">Resumen</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
	'</div>'+
	'<div class="row">'+
		'<h4 class="text-xl-center"><br>Estado del sensor durante la última semana</h4>'+
	'</div>';
	//doy funcionalidad a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {table()};

	//y mientras recibo una repuesta saco por pantalla un spinner
	document.getElementById('info').innerHTML =
	'<div class="row" id="spinner">'+
		'<div class="d-flex justify-content-center" style="padding-top: 135px;">'+
			'<div class="spinner-grow text-success" role="status">'+
				'<span class="visually-hidden"></span>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="row">'+
		'<div class="col-xl-6" id="summary" style="padding-top:20px;">'+
		'</div>'+
		'<div class="col-xl-6" id="pie" style="min-height:360px;max-width:500px;padding-top:15px; overflow: hidden;">'+
		'</div>'+
	'</div>';
	//realizo la petición a la base de datos
	$.ajax({
		type: "GET",
		url: 'getSummary.php',
		data: {
			"name": sensor.name,
		},
		success: function(response)
		{
			//si recibo una respuesta nula, significa que no hay datos durante la última semana
			if (JSON.parse(response) == null)
			{
				document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡¡Oh noooo!!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>No te preocupes, realmente no es para tanto, pero no existen datos de la última semana. <br> ¡Comprueba que el sensor esté conectado!</p>'+
				'</div>';
			}
			else
			{
				//si la respuesta no es nula, voy a insertar una lista con los datos obtenidos, y además, un gráfico de sectores
				var info="";
				$.each(JSON.parse(response), function (i, item) {
					info =
					'<ul class="list-group list-group-flush" style="max-width:600px;">'+
						'<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Nombre: </small><strong>'+ item.name +'</strong></p></li>'+
						'<li class="list-group-item" id="room"><p class="h6 text-left"><small class="text-muted">Estancia: </small><strong>'+item.room+' </strong><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" style="color:#20B2AA;"><i class="bi bi-pen"></i>(Modifica el emplazamiento)</a></p></li>'+
						'<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">MAC del sensor: </small><strong>'+item.mac+'</strong></p></li>'+
						'<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Máximo valor: </small><strong>'+item.co2+' p.p.m.</p></strong></li>'+
						'<li class="list-group-item"><p class="h6 text-left"><small class="text-muted">Fecha máximo valor: </small><strong>'+item.date+'</strong></p></li>'+
					'</ul>'+
					'<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'+
						'<div class="modal-dialog">'+
							'<div class="modal-content">'+
								'<div class="modal-header">'+
									'<h5 class="modal-title" id="exampleModalLabel">Modificar emplazamiento</h5>'+
									'<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
								'</div>'+
								'<div class="modal-body">'+
									'<form id="form">'+
										'<div class="mb-3">'+
											'<label for="recipient-name" class="col-form-label">Si cambias de estancia tu sensor, escribe su nuevo emplazamiento aqui:</label>'+
											'<input type="text" class="form-control" id="estancia" onkeypress="return tableInputKeyPressEnter(event)">'+
										'</div>'+
									'</form>'+
								'</div>'+
								'<div class="modal-footer">'+
									'<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>'+
									'<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="changeRoom" style="background-color:#20B2AA; border-color:#20B2AA;">Enviar petición</button>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
					google.charts.load('42', {'packages':['corechart']});
					google.charts.setOnLoadCallback(drawChart);
					//
					function drawChart() {
						var data = google.visualization.arrayToDataTable([
								['Nivel', 'Tiempo'],
								['Aceptable (menos de 700 p.p.m.)', parseInt(item.acceptable)],
								['Precaución (entre 700 y 1000 p.p.m.)', parseInt(item.precaution)],
								['Alto (más de 1000 p.p.m.)', parseInt(item.high)]
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
			document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡Qué pena!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>Parece que hay un error. <br> Intentalo de nuevo más tarde</p>'+
				'</div>';
		},
		async: true //como siempre, petición asíncrona para no bloquear la pagina esperando la respuesta
	});
};

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
			url: 'changeSensorInfo.php',//dirección del script
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
				'<p class="h6 text-left"><small class="text-muted">Estancia: </small><strong>'+sensor.room+' </strong><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" style="color:#20B2AA;"><i class="bi bi-pen"></i>(Modifica el emplazamiento)</a></p>';
				document.getElementById('services').innerHTML =
				''+sensor.name+'('+sensor.room+')';
			},
			error: function(){//en caso de error mostramos una alerta informativa
				alert("Ha habido algún error, inténtalo de nuevo :(");
		},
		async: true//como siempre, petición asíncrona
		});
	}
}

//función que se ejecuta cuando pulsamos en el servicio de gráficos
function chart(sensor)
{
	//limpio el contenido de la sección de información
	document.getElementById('info').innerHTML ="";
	//en la sección de usuario inyecto las migas de pan, así como dos radio button menus para seleccionar el tipo de medida y el lapso de tiempo a mostrar
	document.getElementById('usuario').innerHTML =
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-house"></i> '+center+'</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> '+sensor.name+' ('+sensor.room+')</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page">Gráficas</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
	'</div>'+
	'<div class="col">'+
		'<div class="row"><p class="h6">Seleccione la medida:</p></div>'+
		'<div class="btn-group btn-group-toggle btn-group-sm custom-radio-button" data-toggle="buttons">'+
			'<label class="btn btn-outline-secondary btn-toggle">'+
				'<input type="radio" name="measure" id="drawCo2" autocomplete="off" value="'+measure.co2+'" checked> CO₂'+
			'</label>'+
			'<label class="btn btn-outline-secondary btn-toggle">'+
				'<input type="radio" name="measure" id="drawTemperature" autocomplete="off" value="'+measure.temperature+'"> Temperatura'+
			'</label>'+
			'<label class="btn btn-outline-secondary btn-toggle">'+
				'<input type="radio" name="measure" id="drawHumidity" autocomplete="off" value="'+measure.humidity+'"> Humedad'+
			'</label>'+
		'</div>'+
		'<div id="selectLapse">'+
			'<div class="row"><p class="h6"><br>Seleccione el tiempo:</p></div>'+
			'<div class="btn-group btn-group-toggle btn-group-sm" data-toggle="buttons">'+
				'<label class="btn btn-outline-secondary btn-toggle">'+
					'<input type="radio" name="time" id="draw8hours" autocomplete="off" value="'+printTime.eightHours+'" checked> 8 horas'+
				'</label>'+
				'<label class="btn btn-outline-secondary btn-toggle">'+
					'<input type="radio" name="time" id="draw24hours" autocomplete="off" value="'+printTime.twentyFourHours+'"> 24 horas'+
				'</label>'+
				'<label class="btn btn-outline-secondary btn-toggle">'+
					'<input type="radio" name="time" id="draw2weeks" autocomplete="off" value="'+printTime.twoWeeks+'"> 2 semanas'+
				'</label>'+
				'<label class="btn btn-outline-secondary btn-toggle">'+
					'<input type="radio" name="time" id="draw4months" autocomplete="off" value="'+printTime.fourMonths+'"> 4 meses'+
				'</label>'+
			'</div>'+
		'</div>'+
	'</div>'+
	'<div class="col" id="list">'+

	'</div>';
	//var wrapper = document.getElementById("list");
	//doy funcionalidad a todos los radiobuttons, así como a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {table()};
	document.getElementById("drawCo2").onchange = function() {drawChart(sensor)};
	document.getElementById("drawTemperature").onchange = function() {drawChart(sensor)};
	document.getElementById("drawHumidity").onchange = function() {drawChart(sensor)};
	document.getElementById("draw8hours").onchange = function() {drawChart(sensor)};
	document.getElementById("draw24hours").onchange = function() {drawChart(sensor)};
	document.getElementById("draw2weeks").onchange = function() {drawChart(sensor)};
	document.getElementById("draw4months").onchange = function() {drawChart(sensor)};
	drawChart(sensor);
}

//al entrar en la sección de gráficos, se ejecuta esta función por defecto, al igual que se ejecuta cada vez que modificamos alguno de los radiobuttons
function drawChart(sensor)
{
	//defino variables para almacenar el tipo de medida y el lapso de tiempo (en horas)
	var measureType="";
	var hours="";
	//var sensorToCompare="";
	//compruebo que radiobutton de tipo de medida está seleccionado y almaceno su valor (por defecto: co2)
	var measureLi = document.getElementsByName('measure');
    for(i = 0; i < measureLi.length; i++) {
        if(measureLi[i].checked)
			measureType=measureLi[i].value;
    }
	//compruebo que radiobutton de lapso de tiempo está seleccionado y almaceno su valor (por defecto: 8 horas)
	var timeLi = document.getElementsByName('time');
    for(i = 0; i < timeLi.length; i++) {
        if(timeLi[i].checked)
			hours=timeLi[i].value;
    }
	//inyecto un spinner de carga
	document.getElementById('info').innerHTML =
	'<div class="d-flex justify-content-center" style="padding-top: 150px;">'+
		'<div class="spinner-grow text-warning" role="status">'+
			'<span class="visually-hidden"></span>'+
		'</div>'+
	'</div>';
	//realizo la petición a la parte de back
	$.ajax({
		type: "GET", //tipo de petición
		url: 'getNewChartData.php',//dirección del script
		data: {//parámetros de entrada
        "name": sensor.name,
		"measure": measureType,
        "hours": hours
    },
	success: function(response) //en caso de recibir respuesta
	{
		//genero una variable que contendrá las opciones del gráfico para cada tipo de medida mostrada (magnitud, texto en las leyendas y color para las gráficas)
		var chartInfo = {
			format: '',
			text: '',
			color: ''
		}
		if(response.length === 0) //si la respuesta está vacía, no existen datos del sensor en el lapso de tiempo seleccionado
        {
			//muestro un mensaje informativo
        	document.getElementById('info').innerHTML =
			'<div class="container-sm align-top text-center">'+
				'<p class="h3"><br>¡¡Upps!!</p>'+
				'<picture>'+
					'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
		  		'</picture>'+
				'<p class="h5"><br>No es nada grave, pero no existen datos de este sensor en el tiempo elegido. <br> ¡Asegurate de que esté conectado!</p>'+
			'</div>';
        }
      	else//en caso de que si se reciban datos 
      	{	
			//compruebo si el tipo de medida que he pedido es co2, y en ese caso configuro las opciones del gráfico para co2
			if (measureType == measure.co2)
			{
				chartInfo.format='{value} p.p.m.';
				chartInfo.text= 'CO₂';
				chartInfo.color='#FF7F50';
				draw(response,sensor, chartInfo);
			}
			//en caso de que sea temperatura, configuro las opciones para ese tipo de medida
			else if (measureType == measure.temperature)
			{
				chartInfo.format='{value} °C';
				chartInfo.text= 'Temperatura';
				chartInfo.color='#8B0000';
				draw(response,sensor,chartInfo);
			}
			//y lo mismo si es humedad
			else
			{
				chartInfo.format='{value} %';
				chartInfo.text= 'Humedad relativa';
				chartInfo.color='#6495ED';
				draw(response,sensor,chartInfo);
			}
	}},
	error: function(){ //en caso de error en la petición, muestro mensaje informativo
		document.getElementById('info').innerHTML =
				'<div class="container-sm align-top text-center">'+
					'<p class="h3"><br>¡Qué pena!</p>'+
					'<picture>'+
						'<img src="image/error.png" class="rounded img-fluid" alt="error"">'+
					'</picture>'+
					'<p class="h5"><br>Parece que hay un error. <br> Intentalo de nuevo más tarde</p>'+
				'</div>';
	},
		async: true //de nuevo petición asíncrona para no bloquear la aplicación esperando por la respuesta
	});
};

//cada vez que se ejecuta la función drawChart, se termina ejecutando esta función, que define las opciones del gráfico y lo imprime en la página
function draw(data, sensor, chartInfo)
{
	//asigno a una variable todas las opciones de configuración del gráfico
	var options = {
		chart: {
			renderTo: 'info',//div de la página donde se va a dibujar
			type: 'line',
			zoomType: 'x'
		},
		credits: {
			enabled: false
		},
		title: {
			text: 'Estancia: '+sensor.room
		},
		subtitle: {
			text: 'Para hacer zoom, puede hacer click y arrastrar en una zona concreta'
		},
		tooltip: {
			valueDecimals: 0
		},
		xAxis: {
			type: "datetime",
			title: {
				text: 'Tiempo',
			}
		},
		yAxis: {
			labels: {
				format: chartInfo.format,
			},
			title: {
				text: chartInfo.text,
			}
		},
		series: [{
			data: JSON.parse("[" + data + "]"),
			lineWidth: 0.1,
			boostThreshold: 1,//esta opción debe estar a uno, si no el gráfico hace cosas raras al mostrar pocos puntos 
			opacity:1,
			name: sensor.room,
			color: chartInfo.color,
			style: {
				color: Highcharts.getOptions().colors[8]
			}
		}]
	};
	//imprimo el gráfico asignándole las opciones que hemos generado
	var chart = new Highcharts.Chart(options);	
}

function compareChart()
{
	var list="";
	$.each(JSON.parse(sensorList), function (i, item) {
		//para cada fila, asigno el valor correspondiente a cada variable
			//voy inyectando el html con cada nombre del sensor
		list +=
		'<li><a id="' + item.name + '" onclick="drawCompareChart(this.id)" class="dropdown-item">' + item.name + '</a></li>';
	});	

	document.getElementById('info').innerHTML ="";
	document.getElementById('usuario').innerHTML =
	'<div class="row">'+
		'<div class="col">'+
			'<nav aria-label="breadcrumb">'+
				'<ol class="breadcrumb">'+
					'<li class="breadcrumb-item active" aria-current="page"><a onclick="table()" href="#" style="color:#20B2AA;"><i class="bi bi-house"></i> '+center+'</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page"><a onclick="servicesList(sensorName)" href="#" style="color:#20B2AA;"> '+sensorName+' ('+sensorRoom+')</a></li>'+
					'<li class="breadcrumb-item active" aria-current="page">Comparación de sensores</li>'+
				'</ol>'+
			'</nav>'+
		'</div>'+
		'<div class="col">'+
			'<a href="https://www.medialab-uniovi.es/api.php" class="btn btn-danger btn-sm float-end" data-mdb-color="dark">Cerrar sesión</a>'+
		'</div>'+
	'</div>'+
	'<div class="btn-group" style="max-width: 400px;">'+
		'<button class="btn btn-outline-secondary btn-sm dropdown-toggle float left" type="button" data-bs-toggle="dropdown" aria-expanded="false">Compara con:</button>'+
		'<ul class="dropdown-menu">'+
			''+list+''+
		'</ul>'+
	'</div>';
}

function seriesPush(sensorToCompare)
{
	document.getElementById('info').innerHTML =
	'<div class="d-flex justify-content-center" style="padding-top: 150px;">'+
		'<div class="spinner-grow text-warning" role="status">'+
			'<span class="visually-hidden"></span>'+
		'</div>'+
	'</div>';

	$.ajax({
		type: "GET",
		url: 'getNewChartData.php',
		data: {
        "name1": "sensor_05",
        "hours": '48'
    	},
		success: function(response)
		{
			if(response.length === 0)
            {
                document.getElementById('info').innerHTML = "No existen datos del sensor elegido en el tiempo indicado";
            }
      		else
      	{
			var splittedResponse = response.split(',;,');
			console.time('line');
			Highcharts.chart('info', {
				
				chart: {
					zoomType: 'x'
				},
				credits: {
					enabled: false
				},
				title: {
					text: '<?php echo $name;?>'
				},
				subtitle: {
					text: 'Medidas de las últimas 48 horas de los sensores: '+sensorName+' y ' +sensorToCompare
				},
				tooltip: {
					valueDecimals: 0
				},
				xAxis: {
					type: "datetime",
					title: {
						text: 'Fecha',
					}
				},
				yAxis: {
					labels: {
						format: '{value}p.p.m.',
					},
					title: {
						text: 'CO₂',
					}
				},
				series: [{
					data: JSON.parse("[" + splittedResponse[0] + "]"),
					/*zones: [{
						value: 700,
						color: '#239B56'
					}, {
						value: 1000,
						color: '#F39C12'
					}, {
						color: '#B03A2E'
					}],*/
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensorName,
					color: 'orange',
					style: {
						color: Highcharts.getOptions().colors[8]
					}},{
					data: JSON.parse("[" + splittedResponse[1] + "]"),
					/*zones: [{
						value: 700,
						color: '#239B56'
					}, {
						value: 1000,
						color: '#F39C12'
					}, {
						color: '#B03A2E'
					}],*/
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensorToCompare,
					color: 'blue',
					style: {
						color: Highcharts.getOptions().colors[8]
					}
				}]
			});
			console.timeEnd('line');
		}},
		error: function(){
			document.getElementById('info').innerHTML = "error";
		},
		async: true
	});
};

function seriesPop()
{
	Highcharts.chart.series[sensorName].remove();
}

function drawCompareChart(sensorToCompare)
{
	document.getElementById('info').innerHTML =
	'<div class="d-flex justify-content-center" style="padding-top: 150px;">'+
		'<div class="spinner-grow text-warning" role="status">'+
			'<span class="visually-hidden"></span>'+
		'</div>'+
	'</div>';

	$.ajax({
		type: "GET",
		url: 'getNewChartComparision.php',
		data: {
        "name1": sensorName,
		"name2": sensorToCompare,
        "hours": '48'
    	},
		success: function(response)
		{
			if(response.length === 0)
            {
                document.getElementById('info').innerHTML = "No existen datos del sensor elegido en el tiempo indicado";
            }
      		else
      	{
			var splittedResponse = response.split(',;,');
			console.time('line');
			Highcharts.chart('info', {
				
				chart: {
					zoomType: 'x'
				},
				credits: {
					enabled: false
				},
				title: {
					text: '<?php echo $name;?>'
				},
				subtitle: {
					text: 'Medidas de las últimas 48 horas de los sensores: '+sensorName+' y ' +sensorToCompare
				},
				tooltip: {
					valueDecimals: 0
				},
				xAxis: {
					type: "datetime",
					title: {
						text: 'Fecha',
					}
				},
				yAxis: {
					labels: {
						format: '{value}p.p.m.',
					},
					title: {
						text: 'CO₂',
					}
				},
				series: [{
					data: JSON.parse("[" + splittedResponse[0] + "]"),
					/*zones: [{
						value: 700,
						color: '#239B56'
					}, {
						value: 1000,
						color: '#F39C12'
					}, {
						color: '#B03A2E'
					}],*/
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensorName,
					color: 'orange',
					style: {
						color: Highcharts.getOptions().colors[8]
					}},{
					data: JSON.parse("[" + splittedResponse[1] + "]"),
					/*zones: [{
						value: 700,
						color: '#239B56'
					}, {
						value: 1000,
						color: '#F39C12'
					}, {
						color: '#B03A2E'
					}],*/
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensorToCompare,
					color: 'blue',
					style: {
						color: Highcharts.getOptions().colors[8]
					}
				}]
			});
			console.timeEnd('line');
		}},
		error: function(){
			document.getElementById('info').innerHTML = "error";
		},
		async: true
	});
};
