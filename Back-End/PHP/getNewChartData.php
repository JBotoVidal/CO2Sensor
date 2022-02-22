<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

//si recibo una petición tipo get
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //almaceno los parámetros de entrada, nombre del sensor, tipo de medida y lapso de tiempo
    $name= test_input($_GET["name"]);
    $measure= test_input($_GET["measure"]);
    $hours= test_input($_GET["hours"]);
    //busco una coincidencia con el nombre del sensor
    $sqlSensor = "SELECT * FROM `Sensores` WHERE nombre='$name'";
    //ejecuto la consulta
    $resultSensor=$link->query($sqlSensor);
    //almaceno la fila obtenida
    $rowSensor = mysqli_fetch_array($resultSensor);
    //necesito la MAC asociada al sensor para buscar en la tabla de medidas, ya que es el identificador único del sensor introducido
    $mac = $rowSensor['MAC'];
    //ahora vamos a usarlo para seleccionar los datos pertinentes, también filtramos por el tipo de medida y el lapso de tiempo, ¡ojo! la fecha está almacenada
    //en formato datetime, pero necesitamos su valor en millis, además hay que sumar una hora pues nos encontramos en la zona horaria +1
    $sqlData = "SELECT (unix_timestamp(fecha)+3600)*1000 AS fecha, $measure FROM `Medidas` WHERE MAC_sensor= '$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL '$hours' HOUR) ORDER BY id_medida ASC";
    //ejecutamos la consulta
    $resultMeasures=$link->query($sqlData);
    //extraemos cada fila contenida en la respuesta
    while($row = mysqli_fetch_array($resultMeasures))
    {
        //highcharts necesita la información en un formato concreto: [millis,valor],[millis,valor],... por tanto no podemos simplemente devolver el resultado en el formato JSON habitual
        extract ($row);
        //generamos el formato deseado en un array
        $data[] = "[$fecha, $row[$measure]]";
    }
    //devuelvo el contenido del array, añadiendo una coma entre cada elemento
    echo join($data, ',');
    //cierro la conexión
    $link->close();

    //primer acercamiento a la solución, funciona igualmente, pero tarda bastante más
    /*$data = '';
    while($rowMeasure = mysqli_fetch_array($resultMeasures))
    {
        $data = $data . '['. $rowMeasure['fecha'] .','. $rowMeasure['co2'] .'],';
    }
    $data = trim($data,",");
    echo $data;*/ 
}
//en caso contrario
else
{
    echo "No data posted with HTTP GET.";
}

//elimino espacios y caracteres especiales de los parametros de entrada
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
