<?php
// Iniciar sesión (sí, aunque la vamos a destruir, primero se debe iniciar)
session_start();
// Eliminar todo lo que haya en $_SESSION
session_destroy();
// Finalmente lo redireccionamos al formulario
header("Location: ../pro-sensorco2.php");

?>