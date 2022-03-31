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
            <h4>¡Hola <strong style="color:#20B2AA;">${userName}</strong>! Desde MediaLab queremos darte la bienvenida a nuestra aplicación web.</h4><br>
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
        <div class="row text-center">
            <h6><br>¿Aún tienes dudas? Puedes ver un pequeño tutoríal sobre la aplicación pulsando <a href="#" data-bs-toggle="modal" data-bs-target="#tutorialModal" data-bs-whatever="@mdo" style="color:#20B2AA;">aquí<a>.</h6>
        </div>
        <div class="modal fade" id="tutorialModal" tabindex="-1" aria-labelledby="tutorialModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="tutorialModalLabel">Tutoríal</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
                        <div id="carouselDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
                            <div class="carousel-indicators">
                                <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="4" aria-label="Slide 5"></button>
                            </div>
                            <div class="carousel-inner">
                                <div class="carousel-item active" data-bs-interval="10000">
                                    <img src="image/tutorial1.PNG" class="d-block w-100" alt="sección sensores">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>Sección sensores</h5>
                                        <p>Desde aquí puedes visualizar los últimos valores tomados para cada sensor, y ver si están enviando datos. Si quieres ver más datos de un sensor determinado, puedes pulsar en su nombre.</p>
                                    </div>
                                </div>
                                <div class="carousel-item" data-bs-interval="2000">
                                    <img src="image/tutorial2.PNG" class="d-block w-100" alt="sección lista de servicios">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>Lista de servicios</h5>
                                        <p>Desde aquí solo debes seleccionar lo que quieras ver, el resumen semanal o entrar a la sección de gráficas.</p>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="image/tutorial3.PNG" class="d-block w-100" alt="sección resumen semanal">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>Sección resumén semanal</h5>
                                        <p>Desde aquí podrás ver la actividad del sensor durante la última semana. También podrás modificar la estancia en la que se encuentra tu sensor.</p>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="image/tutorial4.PNG" class="d-block w-100" alt="sección gráficos">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>Gráficos</h5>
                                        <p>Desde aquí podrás ver gráficas lineales. Además, podrás hacer comparaciones con el rendimiento de los demás sensores.</p>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="image/tutorial5.PNG" class="d-block w-100" alt="sección gráficos">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5>Sección alertas</h5>
                                        <p>Cada vez que un sensor supere los 1000p.p.m. quedará registrado aquí, y también podrás ver el momento en que desciende de ese valor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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