<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();
//si recibo petición GET
if ($_SERVER["REQUEST_METHOD"] == "GET") {
        //almaceno los valores recibidos para cada medida
        $MAC_sensor= test_input($_GET["MAC_sensor"]);
        $co2= test_input($_GET["co2"]);
        $humedad= test_input($_GET["humedad"]);
        $temp= test_input($_GET["temp"]);
        //consulta para insertar en la tabla dichos valores
        $sql = "INSERT INTO Medidas (fecha, co2, MAC_sensor,humedad,temp) VALUES (NOW()," . $co2 . ", ". $MAC_sensor. "," . $humedad . "," . $temp . ")";
        //ejecuto la consulta
        $result = $link->query($sql);
        //devuelvo el sql generado
    	echo $sql;
        //si la consulta da resultado, devuelvo mensaje de confirmación
        if ($result) 
        {
            echo "Registro añadido en tabla medidas. Valores: id: ".$MAC_sensor." ppm: ".$co2;
        }
        //en caso contrario, devuelvo mensaje de error
        else 
        {
            echo "Error";
        }
        //cierro la conexión a la base de datos
        $link->close();
}
//en caso contrario
else
{
    echo "No data posted with HTTP GET.";
}
//elimino caracteres especiales y espacios de los parámetros de entrada
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
