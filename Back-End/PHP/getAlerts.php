<?php
  //Comprobación user y pwd
  include ("./seguridad.php");
  $link=connectCO2();

//si recibo una petición tipo GET
if ($_SERVER["REQUEST_METHOD"] == "GET"){
  //almaceno en una variable el parametro recibido en la url (petición GET)
  $id= test_input($_GET["idusuario"]);
  //genero una consulta, comprobando si hay alertas asociadas a la cuenta recibida
  $sqlAlerts = "SELECT alerta, (UNIX_TIMESTAMP(`fecha`)*1000) AS fecha, sensor FROM Alertas WHERE id_usuario = '$id' ORDER BY id_alerta DESC LIMIT 16";
  //y la ejecuto almacenando el resultado en una variable
  $resultAlerts=$link->query($sqlAlerts);
  //compruebo si efectivamente hay alertas
  $cont=mysqli_num_rows($resultAlerts);
  if ($cont > 0)
  {
    //si las hay, vamos a recorrer cada una de ellas
    while($rowAlerts = mysqli_fetch_assoc($resultAlerts))
    {
      //extraigo los datos deseados
      $alert = $rowAlerts['alerta'];
      $date = $rowAlerts['fecha'];
      $MAC = $rowAlerts['sensor'];
      //ahora necesito añadir el nombre y el aula, que están en otra tabla, en lugar de usar un join, he visto que es más rápido hacer una consulta para cada respuesta de la primera consulta
      $sqlData = "SELECT nombre, estancia FROM Sensores WHERE MAC ='$MAC'";
      //ejecuto la consulta y almaceno el resultado
      $resultData=$link->query($sqlData);
      //recorro cada elemento de la respuesta, en este caso será uno
      while($rowData = mysqli_fetch_assoc($resultData))
      {
        //genero el array deseado con la información de esa alerta en concreto
        $data[] = array('name' =>  $rowData['nombre'] , 'room' =>  $rowData['estancia'] , 'alert' => $alert, "date" => $date, "MAC" => $MAC);
      }
    }
    //devuelvo el contenido del array en formato JSON
    echo json_encode($data);
    //cierro la conexión con la base de datos
    $link->close();
  }
  else
  {
    //en caso de no haber alertas, respondo que no hay resultados, así podré notificar de tal circunstancia en la parte de front
    echo "noresult";
    //cierro la conexión con la base de datos
    $link->close();
  }
}
//en caso contrario, devuelvo un mensaje informativo
else {
    echo "No data posted with HTTP GET.";
}

//elimino espacios y caracteres especiales del input
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
