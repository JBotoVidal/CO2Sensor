<?php
    //Comprobación user y pwd
    include ("./seguridad.php");
    $link=connectCO2();
	$estaweb="loginco2";

 			//Comprueba usuario y pwd en la base de datos...
    $miusuario=$_POST['usuario'];
    $mipwd=$_POST['pwd'];
    //si usuario y contraseña no están vacíos
    if (($miusuario!="")&($mipwd!=""))
    {
        //voy a comprobar que ambos usuario y contraseña existen, creando un hash de la contraseña para ver si efectivamente coincide con el almacenado
        $sql = "SELECT * FROM Escuelas WHERE login = '$miusuario' AND pswrd = '" . md5($mipwd) . "'";
        //ejecuto la consulta
        $val = $link->query($sql);
        //ahora voy a contar el número de filas del resultado (solo pueden ser 0 o 1)
        $cont=mysqli_num_rows($val);
        //si al contar las filas obtenemos un 0, o usuario o contraseña no existen, devolvemos al usuario al formulario de login
        if($cont==0)
        {
          echo '<script type="text/javascript">
                alert("Usuario o contraseña incorrectos");
                window.location.href="../pro-sensorco2.php";
                </script>';
        }
        else
        {
            //si todo está ok y el usuario existe, almaceno valores deseados para la sesión
            while($rowEscuela = mysqli_fetch_array($val))
            {
                $name=$rowEscuela['nombre'];
                $id=$rowEscuela['id_escuela'];
                $logo=$rowEscuela['logo'];
            }
            //aprovecho la conexión para obtener una lista de los sensores asociados, que usaremos más adelante
            $sql2 = "SELECT nombre FROM Sensores WHERE id_escuela = '$id' ORDER BY nombre ASC";
            $sensor_list = $link->query($sql2);
            while($rowList = mysqli_fetch_assoc($sensor_list))
            {
                $list[]=$rowList;
            }
            //finalmente iniciamos sesión, y le pasamos los parámetros de sesión necesarios para la visualización de la información en las diferentes páginas
            session_start();
            $_SESSION["user"] = $miusuario;
            $_SESSION["id"] = $id;
            $_SESSION["name"] = $name;
            $_SESSION["logo"] = $logo;
            $_SESSION["sensorList"][] = $list;
            //enviamos al usuario al inicio de la aplicación
            header("Location: inicio.php");
        }
    }
    //si usuario o contraseña están vacíos, devolvemos al usuario al formulario de login
    else
    {
        echo '<script type="text/javascript">
              alert("Debes introducir usuario y contraseña");
              window.location.href="../pro-sensorco2.php";
              </script>';
    }
    
?>