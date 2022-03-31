<?php
  //Comprobación user y pwd
  include ("./seguridad.php");
  $link=connectCO2();

//si recibo una petición GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {

  //almaceno el identificador de la cuenta 
  $idusuario= test_input($_GET["idusuario"]);
  //busco todos los sensores asociados a esa cuenta
  $sqlSensor = "SELECT nombre, estancia, MAC FROM Sensores WHERE id_usuario='$idusuario' ORDER BY nombre ASC";
  //ejecuto la consulta
  $resultSensors=$link->query($sqlSensor);
  //extraigo los valores de cada fila obtenida en la consulta
  while($rowSensor = mysqli_fetch_assoc($resultSensors))
  {
    //almaceno los valores que serán mostrados en la tabla
    $MAC = $rowSensor['MAC'];
    $name = $rowSensor['nombre'];
    $room = $rowSensor['estancia'];
    //para cada fila, voy a buscar los datos deseados, busco el último valor de co2, temperatura y humedad, y añado la fecha de medida convertida a millis (esta vez no será necesario sumar una hora)
    $sqlData = "SELECT co2,temp,humedad, (UNIX_TIMESTAMP(`fecha`)*1000) AS fecha FROM Medidas WHERE MAC_Sensor='$MAC' GROUP BY id_medida DESC LIMIT 1";
    //ejecuto la consulta
    $resultData=$link->query($sqlData);
    //extraigo los valores de la fila
    while($rowData = mysqli_fetch_assoc($resultData))
    {
      //no quiero la temperatura con más de 1 decimal, por lo tanto redondeo
      $temp= number_format((float)round($rowData['temp'],1, PHP_ROUND_HALF_DOWN),1,'.',',');
      //genero un array con toda la información deseada para cada sensor
      $data[] = array('name' => $name ,'room' => $room, 'co2' => $rowData['co2'], "date" => $rowData['fecha'], "temp" => $temp, "humidity" => $rowData['humedad']);
    }
  }
  //y ya solo queda devolver el contenido del array en formato JSON
  echo json_encode($data);
  //cierro la conexión con la base de datos
  $link->close();
}
//en caso contrario
else 
{
  echo "No data posted with HTTP POST.";
}
//elimino espacios y caracteres especiales de los parámetros de entrada
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
