<?php
  //Comprobación user y pwd
  include ("./seguridad.php");
  $link=connectCO2();
	$estaweb="inicio";
?>
<!doctype html>
<html class="no-js" lang="es">
  <head>
  <title>Medialab CO₂</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.11.3/cr-1.5.5/r-2.2.9/datatables.min.css"/>

  <link rel="stylesheet" type="text/css" href="css/inicio.css">
  <link rel="stylesheet" type="text/css" href="css/custombootstrap.css">
  <link rel="shortcut icon" href="../media/iconos/favicon.ico">
  <link rel="apple-touch-icon" href="../media/imagenes/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="72x72" href="../media/imagenes/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="114x114" href="../media/imagenes/apple-touch-icon-114x114.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body onload="table()" style="background: WhiteSmoke;">
    <?php
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
        //almaceno el nombre, su id y el logo del usuario
        $name="";
  	    $id_escuela="";
        $logo="";
  	    while($rowEscuela = mysqli_fetch_array($val))
        {
  			  $name=$rowEscuela['nombre'];
  			  $id_escuela=$rowEscuela['id_escuela'];
          $logo=$rowEscuela['logo'];
        }
        //si al contar las filas obtenemos un 0, o usuario o contraseña no existen, devolvemos al usuario al formulario de login
        if($cont==0)
        {
          echo '<script type="text/javascript">
                alert("Usuario o contraseña incorrectos");
                window.location.href="../api.php";
                </script>';
        }
      }
      //si usuario o contraseña están vacíos, devolvemos al usuario al formulario de login
      else
      {
        echo '<script type="text/javascript">
              alert("Debes introducir usuario y contraseña");
              window.location.href="../api.php";
              </script>';
      }
      $sql2 = "SELECT nombre FROM Sensores WHERE id_escuela = '$id_escuela'";
      $sensor_list = $link->query($sql2);
      while($rowList = mysqli_fetch_assoc($sensor_list))
      {
        $list[]=$rowList;
      }
    ?>
    <script type="text/javascript">
      var id ='<?php echo $id_escuela; ?>';
      var center = '<?php echo $name;?>';
      var sensorList = '<?php echo json_encode($list);?>';
    </script>
    <div class="row p-1 text-white shadow-sm" style="background: LightSeaGreen;">
      <div class="col-3 align-top text-end">
        <picture>
          <img src="<?php echo $logo;?>" class="img-fluid" alt="<?php echo $center;?>" style="max-width:300px; max-height:100px;">
        </picture>
      </div>
      <div class="col-9 text-end">
        <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" style="margin-right:10%; margin-top:26px; border: none; color:#FFFFFF; box-shadow:none; font-size: 26px; background-color:#20B2AA;"><i class="bi bi-list"></i> Menú</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div id="navA" class="offcanvas-header">
            <h5 id="offcanvasRightLabel" style="color:#000000;font-size:24px;">Menú</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item" data-bs-dismiss="offcanvas"><a onclick="table()"  href="#" style="color:#20B2AA; font-size:20px; display: block;">Sensores</a></li>
              <li class="list-group-item" data-bs-dismiss="offcanvas"><a onclick="alerts()" href="#" style="color:#20B2AA; font-size:20px; display: block;">Alertas</a></li>
              <li class="list-group-item" style=" padding-top: 95%; "><a href='https://www.medialab-uniovi.es/api.php' style="color:#DC143C; font-size:20px;">Cerrar sesión</a></li>
            </ul>
          </div>
        </div>
        </div>
    </div>
    <main class="container-lg border-start border-5 rounded-3 shadow p-4 mb-4 bg-white" style="margin-top:15px; min-height:730px; border-color: LightSeaGreen !important;">
      <div id="usuario">
        <div class="row">
          <div class="col">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page"><i class="bi bi-house"></i><script type="text/javascript"> '+center+'</script></li>
              </ol>
            </nav>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <a onclick="table()" href="#" float-left style="color:#20B2AA;"><i class="bi bi-arrow-repeat"></i> Actualizar tabla</a>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="container overflow-auto" id="info"></div>
      </div>
    </main>
    <footer class="page-footer text-white font-small pt-4" style="background: LightSeaGreen; margin-top: auto;">
      <div class="footer-copyright text-center py-3">
        <picture>
          <img src="image/logo_blanco.png" class="img-fluid" alt="Medialab" style="max-width:100px; max-height:56px;">
        </picture>
        <p>Universidad de Oviedo</p>
      </div>
    </footer>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript" src="js/inicio.js" async></script>
    <script src="js/highcharts.js"></script>
    <script src="js/boost.js"></script>
    <script src="js/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.11.3/cr-1.5.5/r-2.2.9/datatables.min.js"></script>
  </body>
</html>
