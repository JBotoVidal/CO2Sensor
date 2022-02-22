<?php
    //Comprobación user y pwd
    include ("./seguridadCO2.php");
    $link=connectCO2();
    header("Access-Control-Allow-Origin: *"); 

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    $nombre = test_input($_GET["user"]);
    $password = test_input($_GET["password"]);
    $sql = "SELECT login, pswrd FROM Escuelas WHERE login= '{$nombre}' AND pswrd = '{$password}' ";
        
    $val = $link->query($sql);
    $count=mysqli_num_rows($val);

    if($count==0)
    {
        echo "Usuario o contraseña incorrectos";
    }
    else
    {
        echo "Bienvenido";
    }
}
else
{
    echo "No data posted with HTTP POST.";
}

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
