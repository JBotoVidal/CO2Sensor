//importamos los módulos necesarios
import { errorMessage }  from './errorMessage.js';
import { sensorTable } from './sensorTable.js';
import { servicesList } from './servicesList.js';


export function downloadData (sensor)
{
    document.getElementById('navigation').innerHTML =
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item active" aria-current="page"><a id="table" href="#" style="color:#20B2AA;"><i class="bi bi-app"></i> Sensores </a></li>
					<li class="breadcrumb-item active" aria-current="page"><a id="services" href="#" style="color:#20B2AA;"> ${sensor.name} - ${sensor.room} </a></li>
					<li class="breadcrumb-item active" aria-current="page">Descargar</li>
				</ol>
			</nav>
		</div>
	</div>`;
    //doy funcionalidad a todos los radiobuttons, así como a los enlaces de las migas de pan
	document.getElementById("services").onclick = function() {servicesList(sensor)};
	document.getElementById("table").onclick = function() {sensorTable()};

    document.getElementById('info').innerHTML =
    `<div class="text-center">
        <div class="row" style="margin-top:30px; margin-bottom:30px;">
            <h4>Selecciona un lapso de tiempo y pulsa el botón descargar:</h4>
        </div>
        <div class="row" style="width:200px; margin:auto; margin-bottom:40px;">
            <select id="select" class="form-select" aria-label="Default select example">
                <option selected hidden>Menú</option>
                <option id="oneMonth" value="720">Un mes</option>
                <option id="twoMonth" value="1440">Dos meses</option>
                <option id="threeMonth" value="2160">Tres meses</option>
                <option id="fourMonth" value="2880">Cuatro meses</option>
            </select>
        </div>
        <div class="row" style="width:240px; margin:auto;" id="download">
        </div>
    </div>`;
    $('select').on('change', function (e) {
        document.getElementById('download').innerHTML =
        `<h5>Preparando fichero...
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </h5>`;
        var selectedTime = document.getElementById('select').options[document.getElementById('select').selectedIndex].value;
        getCSV(selectedTime);
    });

    function getCSV(selectedTime)
    {
        $.ajax({
            type: "GET", //tipo de petición
            url: 'php/getCSVData.php',//dirección del script
            data: {
                "name": sensor.name,
                "time": selectedTime,
            },
            success: function(response) //en caso de recibir respuesta
            {
                let csv = "data:text/csv;charset=utf-8,";
                csv += "Sensor: ;"+sensor.name+"\r\n";
                csv += "Ubicado en: ;"+sensor.room+"\r\n";
                csv += "fecha; co2 [p.p.m.] ; temperatura [°C]; humedad relativa [%]"+"\r\n";
                $.each(JSON.parse(response), function (i, item) {
                    let date = item.date;
                    let co2= item.co2;
                    let temperature= item.temperature;
                    let humidity = item.humidity;
                    csv += date +";"+ co2 +";"+ temperature +";"+ humidity + "\r\n";
                });
                //una vez descargados los datos y copiados en el array, creo un botón de descarga que llamará a la función de descarga una vez sea pulsado
                document.getElementById('download').innerHTML =
                `<button id="download" type="button" class="btn btn-secondary">Descargar <i class="bi bi-cloud-download"></i></button>`;
                document.getElementById("download").onclick = function() {downloadCSV(csv)};
            },
            error: function(){ //en caso de error en la petición, muestro mensaje informativo
                document.getElementById('download').innerHTML = errorMessage("Parece que hay un error. <br> Intentalo de nuevo más tarde");
            },
            async: true //de nuevo petición asíncrona para no bloquear la aplicación esperando por la respuesta
        });
        function downloadCSV(csv)
        {
            var encodedUri = encodeURI(csv);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Sensor-"+sensor.name+"("+ sensor.room +").csv");
            document.body.appendChild(link);
            link.click();
        }
    }
};
