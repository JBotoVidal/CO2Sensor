//importamos los módulos necesarios
import { spinner }  from './const.js';
import { errorMessage }  from './errorMessage.js';
import { convertMillisToDate } from './convertMillisToDate.js';

//se ejecuta al pulsar el enlace de alertas en el menú principal, la exportamos para poder ser usada como módulo
export function alerts()
{
	//inyecto migas de pan para saber que estamos en la sección de alertas
	document.getElementById('navigation').innerHTML = 	
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><i class="bi bi-exclamation-square"></i> Alertas</li>
				</ol>
			</nav>
		</div>
	</div>`;
	//mientras hago la petición y recibo los datos, saco por pantalla un spinner de carga
	document.getElementById('info').innerHTML = `${spinner}`;
	//realizo una petición ajax a la parte de back end para recibir la lista de alertas existentes
	$.ajax({
		type: "GET", //tipo de petición
		url: 'php/getAlerts.php',//el script está en el mismo directorio
		data: 'idusuario='+id,//parámetro de entrada
		success: function(response)//en caso de recibir respuesta
		{
			if (response == "noresult")//si recibo este mensaje es que no hay alertas, por lo que inyecto un mensaje informativo
			{
				document.getElementById('info').innerHTML = errorMessage("Parece que no hay alertas, pero... ¡Anímate! Eso significa que la calidad del aire es buena y no tienes de que preocuparte.");
			}
			else //en caso contrario, si hay alarmas
			{
				//inyecto la cabecera de la lista
				var list=
				`<ul class="list-group list-group-flush">`;
				
				//recorro cada fila de la respuesta
				$.each(JSON.parse(response), function (i, item) {
					//para cada fila, asigno el valor correspondiente a cada variable
					var date= convertMillisToDate(item.date);
					var arrow = setArrow(item.alert);
					list +=
					`<li class="list-group-item fst-italic"> ${arrow} <em> ${item.name} </em> ubicado en <em> ${item.room} </em> : <small class="text-muted"> ${item.alert} </small> - ${date} </i></li>`;
				});
				list +=`</ul>`;
				document.getElementById('info').innerHTML = list;
			}
        },
		//en caso de error, vamos a mostrar un mensaje informativo
	  	error: function(){
			document.getElementById('info').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
	  	},
	  	async: true //petición asincrona para no bloquear la aplicación esperando por la respuesta
    });

	//en función del tipo de alerta imprimiremos un icono u otro
	function setArrow(alert)
	{
		if ( alert == 'co2 ha subido por encima de 1000 p.p.m.' )
			return ' <i class="bi bi-arrow-up" style="color:red; font-size:20px;"></i>'
		else
			return ' <i class="bi bi-arrow-down" style="color:green; font-size:20px;"></i>'
	};
};