//importamos los módulos necesarios
import { sensorTable } from './modules/sensorTable.js';
import { alerts } from './modules/alerts.js';

//defino la función que quiero que se ejecute al entrar en la app
window.onload = index();

//añado funcionalidad al menú de la página
document.getElementById("index").onclick = function() {index()};
document.getElementById("menuSensors").onclick = function() {sensorTable()};
document.getElementById("menuAlerts").onclick = function() {alerts()};

function index()
{
    //inyecto migas de pan para saber que estamos en la sección de alertas
	document.getElementById('navigation').innerHTML = 	
	`<div class="row">
		<div class="col">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page"><i class="bi bi-house"></i> Inicio </li>
				</ol>
			</nav>
		</div>
	</div>`;
    //inyecto contenido de la página de inicio
    document.getElementById('info').innerHTML = 
    `<div class="container">
        <div class="text-center">
            <h4>¡Hola <strong style="color:#20B2AA;">${center}</strong>! Desde MediaLab queremos darte la bienvenida a nuestra aplicación web.</h4><br>
        </div>
        <div class="row text-center">
            <h6>Chulísimo ¿Verdad? Pero seguro que estás pensando... ¿Y para qué sirve? Pues ahí va un resumen, desde este sitio podrás:</h6>
        </div>
        <div class="row">
            <div class="card-group" style="cursor: pointer;">
                <div class="card border-0"  id="opt1">
                    <img src="image/sens1.png" class="card-img-top" alt="sensor mostrando sus niveles de co2" style="max-width:250px; max-height:250px; display: block; margin-left: auto; margin-right: auto;">
                    <div class="card-body">
                        <h5 class="card-title text-center" style="color:#20B2AA;">VISUALIZAR</h5>
                        <p class="card-text text-center"> Tendrás acceso a los últimos datos tomados por tus sensores.</p>
                        <p class="card-text text-center"><small class="text-muted"></small></p>
                    </div>
                </div>
                <div class="card border-0" id="opt2">
                    <img src="image/sens2.png" class="card-img-top" alt="sensor enviando datos a través de wifi" style="max-width:250px; max-height:250px; display: block; margin-left: auto; margin-right: auto;">
                    <div class="card-body">
                        <h5 class="card-title text-center" style="color:#20B2AA;">ANALIZAR</h5>
                        <p class="card-text text-center"> Obtendrás resúmenes de actividad y gráficas con los datos registrados.</p>
                        <p class="card-text text-center"><small class="text-muted"></small></p>
                    </div>
                </div>
                <div class="card border-0" id="opt3">
                    <img src="image/sens3.png" class="card-img-top" alt="sensor desconectado" style="max-width:250px; max-height:250px; display: block; margin-left: auto; margin-right: auto;">
                    <div class="card-body">
                        <h5 class="card-title text-center" style="color:#20B2AA;">MONITORIZAR</h5>
                        <p class="card-text text-center"> Serás capaz de comprobar si tus sensores están enviando datos correctamente.</p>
                        <p class="card-text text-center"><small class="text-muted"></small></p>
                    </div>
                </div>
                <div class="card border-0" id="opt4">
                    <img src="image/sens4.png" class="card-img-top" alt="sensor enviando una alerta" style="max-width:250px; max-height:250px; display: block; margin-left: auto; margin-right: auto;">
                    <div class="card-body">
                        <h5 class="card-title text-center" style="color:#20B2AA;">ACTUAR</h5>
                        <p class="card-text text-center"> Recibirás alertas y sabrás en que estancias y en que momentos debes mejorar la ventilación.</p>
                        <p class="card-text text-center"><small class="text-muted"></small></p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    //capturamos que ocurre cuando pulsamos cada una de las tarjetas explicativas
    document.getElementById("opt1").onclick = function() {sensorTable()};
	document.getElementById("opt2").onclick = function() {sensorTable()};
    document.getElementById("opt3").onclick = function() {sensorTable()};
    document.getElementById("opt4").onclick = function() {alerts()};
};