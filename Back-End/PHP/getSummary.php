<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

//si recibo una petición vía get
if ($_SERVER["REQUEST_METHOD"] == "GET") {

    //guardo el nombre del sensor recibido en la url
    $name= test_input($_GET["name"]);
    //busco el nombre, el aula y la MAC asociados al sensor con el nombre introducido
    $sqlSensor = "SELECT nombre,aula, MAC FROM `Sensores` WHERE nombre='$name'";
    //ejecuto la consulta
    $resultSensor=$link->query($sqlSensor);
    //va a devolver solo una fila, así que la extraigo
    $rowSensor = mysqli_fetch_array($resultSensor);
    //almaceno los valores en variables
    $mac = $rowSensor['MAC'];
    $name = $rowSensor['nombre'];
    $room = $rowSensor['aula'];
    //1st approach
    //$sqlData = "SELECT FORMAT((SUM(CASE WHEN co2 < 700 THEN 1 ELSE 0 END)/COUNT(co2))*100,1) aceptable, FORMAT((SUM(CASE WHEN co2 > 700 AND co2 <1000 THEN 1 ELSE 0 END)/COUNT(co2))*100,1) precaucion, FORMAT((SUM(CASE WHEN co2 > 1000 THEN 1 ELSE 0 END)/COUNT(co2))*100,1) alto FROM Medidas WHERE MAC_sensor= '$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 168 hour)";
    //consulta definitiva, hago un sumatorio de las veces que ha estado en cada nivel durante la última semana, en días laborables de 8 a 20 horas (coalesce devuelve un 0 en caso de obtener un valor nulo)
    $sqlPie = "SELECT COALESCE(SUM(CASE WHEN co2 < 700 THEN 1 ELSE 0 END),0) acceptable, COALESCE(SUM(CASE WHEN co2 > 700 AND co2 <1000 THEN 1 ELSE 0 END),0) precaution, COALESCE(SUM(CASE WHEN co2 > 1000 THEN 1 ELSE 0 END),0) high FROM Medidas WHERE MAC_sensor= '$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 168 hour) AND TIME(fecha) BETWEEN '08:00:00' AND '20:00:00' AND WEEKDAY(DATE(fecha)) !=6 AND WEEKDAY(DATE(fecha)) !=5 ";
    //ejecuto consulta
    $resultPie=$link->query($sqlPie);
    //y de nuevo extraigo la fila resultante
    $pie = mysqli_fetch_array($resultPie);
    //almaceno las variables con los sumatorios
    $acceptable = $pie['acceptable'];
    $precaution = $pie['precaution'];
    $high = $pie['high'];
    //por último selecciono fecha y valor de la medida de co2 más alta de la última semana
    $sqlData = "SELECT fecha,co2 FROM Medidas WHERE MAC_sensor='$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 166 HOUR) ORDER BY co2 DESC LIMIT 1";
    //ejecuto la consulta
    $resultData=$link->query($sqlData);
    //recorro el resultado
    while($rowData = mysqli_fetch_assoc($resultData))
    //y creo un array con todos los datos para el resumen de actividad del sensor
    $data = array(['acceptable' => $acceptable ,'precaution' => $precaution ,'high' => $high ,'mac' => $mac ,'name' => $name ,'room' => $room,"co2" => $rowData['co2'], "date" => $rowData['fecha']  ]);
    //devuelvo el contenido del array en formato JSON
    echo json_encode($data);
    //por último, cierro la conexión con la base de datos
    $link->close();
}
//en caso contrario
else
{
    echo "No data posted with HTTP POST.";
}

//elimino espacios y caracteres especiales de las variables de entrada
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
