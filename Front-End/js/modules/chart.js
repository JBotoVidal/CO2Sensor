import { errorMessage }  from './errorMessage.js';
import { measure, printTime, spinner }  from './const.js';
import { servicesList } from '../inicio.js';
import { sensorTable } from './sensorTable.js';


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


//función que se ejecuta cuando pulsamos en el servicio de gráficos
export function chart(sensor)
{
	//limpio el contenido de la sección de información
	document.getElementById('info').innerHTML ="";
	//en la sección de navigation inyecto las migas de pan, así como dos radio button menus para seleccionar el tipo de medida y el lapso de tiempo a mostrar
	document.getElementById('navigation').innerHTML =
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-house"></i> ${center} </a></li>
					<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> ${sensor.name}: ${sensor.room} </a></li>
					<li class="breadcrumb-item active" aria-current="page">Gráficas</li>
				</ol>
			</nav>
		</div>
	</div>
	<div class="col">
		<div class="row"><p class="h6">Seleccione la medida:</p></div>
		<div class="btn-group btn-group-toggle btn-group-sm custom-radio-button" data-toggle="buttons">
			<label class="btn btn-outline-secondary btn-toggle">
				<input type="radio" name="measure" id="drawCo2" autocomplete="off" value="${measure.co2}" checked> CO₂ 
			</label>
			<label class="btn btn-outline-secondary btn-toggle">
				<input type="radio" name="measure" id="drawTemperature" autocomplete="off" value="${measure.temperature}"> Temperatura 
			</label>
			<label class="btn btn-outline-secondary btn-toggle">
				<input type="radio" name="measure" id="drawHumidity" autocomplete="off" value="${measure.humidity}"> Humedad
			</label>
		</div>
		<div id="selectLapse">
			<div class="row"><p class="h6"><br>Seleccione el tiempo:</p></div>
			<div class="btn-group btn-group-toggle btn-group-sm" data-toggle="buttons">
				<label class="btn btn-outline-secondary btn-toggle">
					<input type="radio" name="time" id="draw8hours" autocomplete="off" value="${printTime.eightHours}" checked> 8 horas
				</label>
				<label class="btn btn-outline-secondary btn-toggle">
					<input type="radio" name="time" id="draw24hours" autocomplete="off" value="${printTime.twentyFourHours}"> 24 horas
				</label>
				<label class="btn btn-outline-secondary btn-toggle">
					<input type="radio" name="time" id="draw2weeks" autocomplete="off" value="${printTime.twoWeeks}"> 2 semanas
				</label>
				<label class="btn btn-outline-secondary btn-toggle">
					<input type="radio" name="time" id="draw4months" autocomplete="off" value="${printTime.fourMonths}"> 4 meses
				</label>
			</div>
		</div>
	</div>
	<div class="col" id="list">
	</div>`;
	//var wrapper = document.getElementById("list");
	//doy funcionalidad a todos los radiobuttons, así como a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {sensorTable()};
	document.getElementById("drawCo2").onchange = function() {drawChart(sensor)};
	document.getElementById("drawTemperature").onchange = function() {drawChart(sensor)};
	document.getElementById("drawHumidity").onchange = function() {drawChart(sensor)};
	document.getElementById("draw8hours").onchange = function() {drawChart(sensor)};
	document.getElementById("draw24hours").onchange = function() {drawChart(sensor)};
	document.getElementById("draw2weeks").onchange = function() {drawChart(sensor)};
	document.getElementById("draw4months").onchange = function() {drawChart(sensor)};
	drawChart(sensor);

    //al entrar en la sección de gráficos, se ejecuta esta función por defecto, al igual que se ejecuta cada vez que modificamos alguno de los radiobuttons
    function drawChart(sensor)
    {
        //defino variables para almacenar el tipo de medida y el lapso de tiempo (en horas)
        var measureType="";
        var hours="";
        //var sensorToCompare="";
        //compruebo que radiobutton de tipo de medida está seleccionado y almaceno su valor (por defecto: co2)
        var measureLi = document.getElementsByName('measure');
        for(let i = 0; i < measureLi.length; i++) {
            if(measureLi[i].checked)
                measureType=measureLi[i].value;
        }
        //compruebo que radiobutton de lapso de tiempo está seleccionado y almaceno su valor (por defecto: 8 horas)
        var timeLi = document.getElementsByName('time');
        for(let i = 0; i < timeLi.length; i++) {
            if(timeLi[i].checked)
                hours=timeLi[i].value;
        }
        //inyecto un spinner de carga
        document.getElementById('info').innerHTML = `${spinner}`;
        //realizo la petición a la parte de back
        $.ajax({
            type: "GET", //tipo de petición
            url: 'php/getNewChartData.php',//dirección del script
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
                document.getElementById('info').innerHTML = errorMessage("No es nada grave, pero no existen datos de este sensor en el tiempo elegido. <br> ¡Asegurate de que esté conectado!");
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
            document.getElementById('info').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
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
};