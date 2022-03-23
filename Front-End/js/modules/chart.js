//importamos los módulos necesarios
import { errorMessage }  from './errorMessage.js';
import { measure, printTime, spinner }  from './const.js';
import { sensorTable } from './sensorTable.js';
import { servicesList } from './servicesList.js';


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
    //ahora necesito convertir el array devuelto en php a un array de javascript, y como será para hacer un menú radial donde elgir los sensores para comparar sus medidas
    //el sensor elegido para entrar en la sección del gráfico no puede aparecer, por lo que lo obviamos esa entrada
    var radioButtonSensor = "";
    $.each(JSON.parse(sensorList), function (i, item)
    {
        if(item.nombre !== sensor.name)
        {
            radioButtonSensor += 
            `<div class="form-check" style="direction: ltr;">
                <input class="form-check-input" type="radio" name="sensors" value="${item.nombre}"  id="${item.nombre}">
                <label for="${item.nombre}" class="form-check-label" style="cursor: pointer;">
                    ${item.nombre} - ${item.aula}
                </label>
            </div>`;
        }
    });
	//limpio el contenido de la sección de información
	document.getElementById('info').innerHTML ="";
	//en la sección de navigation inyecto las migas de pan, así como dos radio button menus para seleccionar el tipo de medida y el lapso de tiempo a mostrar
	document.getElementById('navigation').innerHTML =
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-app"></i> Sensores </a></li>
					<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> ${sensor.name} - ${sensor.room} </a></li>
					<li class="breadcrumb-item active" aria-current="page">Gráficas</li>
				</ol>
			</nav>
		</div>
	</div>
    <div class="row">
        <div class="col-md-7">
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
            <div id="selectLapse" style="margin-bottom:20px;">
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
        <div class="col-md-5" id="list">
            <div class="row"><p class="h6">Si quieres, selecciona otro sensor para comparar:</p></div>
            <div class="overflow-auto" id="list" style="height:100px; padding-left:10px; direction: rtl; scrollbar-width: thin; scrollbar-color: black #20B2AA;">${radioButtonSensor}</div>
            <div id="errorMessage" style="margin-bottom:20px;"></div>
            <style>
                #list::-webkit-scrollbar {
                    width: 1em;
                }
                
                #list::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
                    background-color: #20B2AA;
                }
                
                #list::-webkit-scrollbar-thumb {
                    border-radius: 1px;
                    background-color: black;
                    outline: 1px solid #333333;
                }
            </style>
        </div>
    </div>`;
	//var wrapper = document.getElementById("list");
	//doy funcionalidad a todos los radiobuttons, así como a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {sensorTable()};
    $("input").change(function() {drawChart(sensor)});

	drawChart(sensor);

    //al entrar en la sección de gráficos, se ejecuta esta función por defecto, al igual que se ejecuta cada vez que seleccionamos alguno de los radiobuttons
    function drawChart(sensor)
    {
        //defino variables para almacenar el tipo de medida y el lapso de tiempo (en horas), así como el sensor a comparar, si es elegido
        var measureType="";
        var hours="";
        var sensorToCompare="";
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
        //compruebo que radiobutton de sensor a comparar, si está seleccionado y almaceno su valor (por defecto: ninguno seleccionado)
        var sensorLi = document.getElementsByName('sensors');
        for(let i = 0; i < sensorLi.length; i++) {
            if(sensorLi[i].checked)
                sensorToCompare=sensorLi[i].value;
        }
        //inyecto un spinner de carga mientras espero la respuesta del back
        document.getElementById('info').innerHTML = `${spinner}`;

        //compruebo si se ha elegido un sensor para comparar (en caso contrario el valor estaría vacío), y en caso afirmativo haremos una petición añadiendo el parámetro del sensor a comparar
        if(sensorToCompare != "")
        {
            //realizo la petición a la parte de back
            $.ajax({
                type: "GET", //tipo de petición
                url: 'php/getNewChartData.php',//dirección del script
                data: {
                    "nameMain": sensor.name,
                    "nameCompared": sensorToCompare,
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
                        drawCompare(response,sensor, chartInfo, sensorToCompare);
                    }
                    //en caso de que sea temperatura, configuro las opciones para ese tipo de medida
                    else if (measureType == measure.temperature)
                    {
                        chartInfo.format='{value} °C';
                        chartInfo.text= 'Temperatura';
                        chartInfo.color='#8B0000';
                        drawCompare(response,sensor,chartInfo, sensorToCompare);
                    }
                    //y lo mismo si es humedad
                    else
                    {
                        chartInfo.format='{value} %';
                        chartInfo.text= 'Humedad relativa';
                        chartInfo.color='#6495ED';
                        drawCompare(response,sensor,chartInfo, sensorToCompare);
                    }
                }},
            error: function(){ //en caso de error en la petición, muestro mensaje informativo
                document.getElementById('info').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
            },
                 async: true //de nuevo petición asíncrona para no bloquear la aplicación esperando por la respuesta
            });    
        }
        else //no se ha elegido un sensor para comparar, por lo tanto solo queremos los datos del primer sensor
        {
            //realizo la petición a la parte de back
            $.ajax({
                type: "GET", //tipo de petición
                url: 'php/getNewChartData.php',//dirección del script
                data: {
                    "nameMain": sensor.name,
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
        }
    };

    //cada vez que se ejecuta la función drawChart, si no hemos elegido un sensor para comparar, se ejecuta esta función, que define las opciones del gráfico y lo imprime en la página
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
    };

    //esta función es la que se ejecuta cuando hemos seleccionado un gráfico a comparar
    function drawCompare(data, sensor, chartInfo, sensorToCompare)
    {
        //la respuesta traerá todos los datos de los dos sensores en un mismo array, separados solo por un ";" por tanto... dividimos el array en dos porciones
        var splittedResponse = data.split(';');
        //puede pasar que durante el lapso de tiempo elegido, el sensor que se quiere comparar no estuviese enviando datos, por tanto no tengamos datos, así que comprobamos si está vacío
        if (splittedResponse[1]==="")
        {
            //en caso afirmativo sacamos un mensaje avisando de tal suceso
            document.getElementById('errorMessage').innerHTML =
            `<h6 class="text-danger">
                No existen datos en el lapso elegido.
            </h6>`;
        }
        else
        {
            //en caso contrario no queremos mensaje, pues todo va a funcionar correctamente
            document.getElementById('errorMessage').innerHTML ="";
        }
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
                text: sensor.name+', '+sensorToCompare
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
            },//ahora voy a definir dos series, la primera es el sensor originaly la segunda el que queremos comparar
            series: [{
					data: JSON.parse("[" + splittedResponse[0] + "]"),
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensor.name,
					color:  chartInfo.color,
					style: {
						color: Highcharts.getOptions().colors[8]
					}},{
					data: JSON.parse("[" + splittedResponse[1] + "]"),
					lineWidth: 0.1,
					boostThreshold: 1,
					opacity:1,
					name: sensorToCompare,
					color: 'black',
					style: {
						color: Highcharts.getOptions().colors[8]
					}
				}]
        };
        //imprimo el gráfico asignándole las opciones que hemos generado
        var chart = new Highcharts.Chart(options);	
    }
};