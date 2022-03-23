<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

//si recibo una petición tipo get
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //almaceno los parámetros de entrada, nombre del sensor, tipo de medida y lapso de tiempo
    $nameMain= test_input($_GET["nameMain"]);
    $nameCompared= test_input($_GET["nameCompared"]);
    $measure= test_input($_GET["measure"]);
    $hours= test_input($_GET["hours"]);
    //busco una coincidencia con el nombre del sensor
    $sqlMainSensor = "SELECT * FROM `Sensores` WHERE nombre='$nameMain'";
    //ejecuto la consulta
    $resultMainSensor=$link->query($sqlMainSensor);
    //almaceno la fila obtenida
    $rowMainSensor = mysqli_fetch_array($resultMainSensor);
    //necesito la MAC asociada al sensor para buscar en la tabla de medidas, ya que es el identificador único del sensor introducido
    $mac = $rowMainSensor['MAC'];
    //ahora vamos a usarlo para seleccionar los datos pertinentes, también filtramos por el tipo de medida y el lapso de tiempo, ¡ojo! la fecha está almacenada
    //en formato datetime, pero necesitamos su valor en millis, además hay que sumar una hora pues nos encontramos en la zona horaria +1
    $sqlData = "SELECT (unix_timestamp(fecha)+3600)*1000 AS fecha, $measure FROM `Medidas` WHERE MAC_sensor= '$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL '$hours' HOUR) ORDER BY id_medida ASC";
    //ejecutamos la consulta
    $resultMeasures=$link->query($sqlData);
    //extraemos cada fila contenida en la respuesta
    while($rowMain = mysqli_fetch_array($resultMeasures))
    {
        //highcharts necesita la información en un formato concreto: [millis,valor],[millis,valor],... por tanto no podemos simplemente devolver el resultado en el formato JSON habitual
        extract ($rowMain);
        //generamos el formato deseado en un array
        $data[] = "[$fecha, $rowMain[$measure]]";
    }
    //ahora la idea es, que si se ha recibido el parámetro para un segundo sensor, se vuelva a hacer el mismo proceso, para ese segundo sensor
    if (isset($_GET['nameCompared']) === true)
    {
        $sqlSensorCompared = "SELECT * FROM `Sensores` WHERE nombre='$nameCompared'";
        $resultSensorCompared=$link->query($sqlSensorCompared);
        $rowSensorCompared = mysqli_fetch_array($resultSensorCompared);
        $macCompared = $rowSensorCompared['MAC'];
        $sqlDataCompared = "SELECT (unix_timestamp(fecha)+3600)*1000 AS fecha, $measure FROM `Medidas` WHERE MAC_sensor= '$macCompared' AND fecha >= DATE_SUB(NOW(),INTERVAL '$hours' HOUR) ORDER BY id_medida ASC";
        $resultMeasuresCompared=$link->query($sqlDataCompared);
        while($rowCompared = mysqli_fetch_array($resultMeasuresCompared))
        {
          extract ($rowCompared);
          $data2[] = "[$fecha, $rowCompared[$measure]]";
        }
        //y devolvemos los dos arrays separados por un ; para poder reconocer el fin en la parte de front
        echo (join($data, ',') . ';' . join($data2, ','));
    }
    else //en caso de haber recibido parámetro solo para uno, devolvemos el array separando cada elemento con comas
    {
        //devuelvo el contenido del array, añadiendo una coma entre cada elemento
        echo join($data, ',');
    }
    //cierro la conexión
    $link->close();
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
