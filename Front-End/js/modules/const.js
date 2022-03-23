//defino el spinner de carga que aparecerá mientras se reciben respuestas del back-end
export const spinner = 
	`<div class="row" id="spinner">
		<div class="d-flex justify-content-center" style="padding-top: 150px;">
			<div class="spinner-border text-secondary" style="width: 3rem; height: 3rem;" role="status">
				<span class="visually-hidden">Cargando</span>
			</div>
		</div>
	</div>`;

//defino los tipos de datos recogidos por el sensor
export const measure  = {
    co2  : 'co2',
    temperature : 'temp',
    humidity : 'humedad'
};
Object.freeze(measure); //impedimos que se añadan nuevas propiedades y que se borren las existentes

//defino los límites de CO2 para los diferentes niveles
export const measureLimits  = {
    acceptable  : 700,
    precaution : 1000
};
Object.freeze(measureLimits); //impedimos que se añadan nuevas propiedades y que se borren las existentes

//defino el tiempo en horas para los 4 diferentes lapsos de tiempo que puedo elegir en los gráficos
export const printTime = {
	eightHours: 8,
	twentyFourHours: 24,
	twoWeeks: 336,
	fourMonths: 2880
};
Object.freeze(printTime); //impedimos que se añadan nuevas propiedades y que se borren las existentes