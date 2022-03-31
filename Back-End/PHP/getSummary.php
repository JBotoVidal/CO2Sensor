<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

//si recibo una petición vía get
if ($_SERVER["REQUEST_METHOD"] == "GET") {

    //guardo el nombre del sensor recibido en la url
    $name= test_input($_GET["name"]);
    //busco el nombre, el aula y la MAC asociados al sensor con el nombre introducido
    $sqlSensor = "SELECT nombre, estancia, MAC FROM `Sensores` WHERE nombre='$name'";
    //ejecuto la consulta
    $resultSensor=$link->query($sqlSensor);
    //va a devolver solo una fila, así que la extraigo
    $rowSensor = mysqli_fetch_array($resultSensor);
    //almaceno los valores en variables
    $mac = $rowSensor['MAC'];
    $name = $rowSensor['nombre'];
    $room = $rowSensor['estancia'];
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
    //selecciono fecha y valor de la medida de co2 más alta de la última semana
    $sqlData1 = "SELECT (UNIX_TIMESTAMP(`fecha`)*1000) as fecha, co2 FROM Medidas WHERE MAC_sensor='$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 166 HOUR) ORDER BY co2 DESC LIMIT 1";
    //ejecuto la consulta
    $resultData1=$link->query($sqlData1);
    //recorro el resultado
    $rowData1 = mysqli_fetch_assoc($resultData1);
    $co2max=$rowData1['co2'];
    $dateco2max=$rowData1['fecha'];
    //por último selecciono fecha y valor de la medida de co2 más alta de la última semana
    $sqlData2 = "SELECT (UNIX_TIMESTAMP(`fecha`)*1000) as fecha,co2 FROM Medidas WHERE MAC_sensor='$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 166 HOUR) ORDER BY co2 ASC LIMIT 1";
    //ejecuto la consulta
    $resultData2=$link->query($sqlData2);
    //recorro el resultado
    $rowData2 = mysqli_fetch_assoc($resultData2);
    $co2min=$rowData2['co2'];
    $dateco2min=$rowData2['fecha'];
    //por último selecciono fecha y valor de la medida de co2 más alta de la última semana
    $sqlData3 = "SELECT (UNIX_TIMESTAMP(`fecha`)*1000) as fecha,temp FROM Medidas WHERE MAC_sensor='$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 166 HOUR) ORDER BY temp DESC LIMIT 1";
    //ejecuto la consulta
    $resultData3=$link->query($sqlData3);
    //recorro el resultado
    $rowData3 = mysqli_fetch_assoc($resultData3);
    $tempmax=$rowData3['temp'];
    $datetempmax=$rowData3['fecha'];
    //por último selecciono fecha y valor de la medida de co2 más alta de la última semana
    $sqlData4 = "SELECT (UNIX_TIMESTAMP(`fecha`)*1000) as fecha,temp FROM Medidas WHERE MAC_sensor='$mac' AND fecha >= DATE_SUB(NOW(),INTERVAL 166 HOUR) ORDER BY temp ASC LIMIT 1";
    //ejecuto la consulta
    $resultData4=$link->query($sqlData4);
    //recorro el resultado
    $rowData4 = mysqli_fetch_assoc($resultData4);
    $tempmin=$rowData4['temp'];
    $datetempmin=$rowData4['fecha'];
    //y creo un array con todos los datos para el resumen de actividad del sensor
    $data = array(['acceptable' => $acceptable ,'precaution' => $precaution ,'high' => $high ,'mac' => $mac ,'name' => $name ,'room' => $room,"co2max" => $co2max, "datemax" => $dateco2max,"co2min" => $co2min, "datemin" => $dateco2min,"tempmax" => $tempmax, "datetmax" => $datetempmax,"tempmin" => $tempmin, "datetmin" => $datetempmin]);
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
