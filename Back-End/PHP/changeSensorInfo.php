<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $name= test_input($_GET["name"]);
    $room= test_input($_GET["estancia"]);
    //selecciono la lista de sensores de la escuela correspondiente y añado el valor y fecha de la última medida de cada sensor
    $sql = "UPDATE Sensores SET estancia ='$room' WHERE nombre ='$name'";
    //si la consulta se ejecuta correctamente
    if ($link->query($sql) === TRUE) 
    {
        echo "La estancia ha sido modificada con éxito.";
    }
    //en caso contrario
    else
    {
        echo "Algo no ha ido bien, inténtalo de nuevo.";
    }
    //cierro la conexión con la base de datos
    $link->close();
}
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
