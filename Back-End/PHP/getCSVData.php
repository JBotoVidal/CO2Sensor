<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

//si recibo una petición tipo get
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //almaceno parámetros de entrada, el nombre del sensor y el lapso de tiempo
    $name= test_input($_GET["name"]);
    $time= test_input($_GET["time"]);
    //creo la consulta, seleccionando el sensor por su nombre
    $sql = "SELECT * FROM `Sensores` WHERE nombre='$name'";
    //ejecuto la consulta
    $result=$link->query($sql);
    //recorro la fila obtenida
    while($row = mysqli_fetch_array($result))
    {
        //almaceno la mac del sensor (su primary key)
        $MAC = $row['MAC'];
        //buscamos las medidas existentes para el sensor deseado en el lapso de tiempo recibido
        $sqlData = "SELECT co2,temp,humedad,fecha FROM Medidas WHERE MAC_Sensor='$MAC' AND fecha >= DATE_SUB(NOW(),INTERVAL $time HOUR) ORDER BY id_medida ASC";
        //ejecuto la consulta
        $resultData=$link->query($sqlData);
        //recorro cada fila de la respuesta
        while($rowData = mysqli_fetch_assoc($resultData))
        {
            //genero un array con toda la información deseada para cada sensor
            $data[] = array('co2' => $rowData['co2'], "date" => $rowData['fecha'], "temperature" => $rowData['temp'], "humidity" => $rowData['humedad']);
        }
    }
    //y ya solo queda devolver el contenido del array en formato JSON
    echo json_encode($data);
    
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
