-- phpMyAdmin SQL Dump
-- version 4.9.9
-- https://www.phpmyadmin.net/
--
-- Servidor: db5005283231.hosting-data.io
-- Tiempo de generación: 14-02-2022 a las 11:28:54
-- Versión del servidor: 5.7.36-log
-- Versión de PHP: 7.0.33-0+deb9u12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbs4423479`
--
CREATE DATABASE IF NOT EXISTS `dbs4423479` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `dbs4423479`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `Borrar datos de más de 4 meses`$$
CREATE DEFINER=`o4423479`@`%` PROCEDURE `Borrar datos de más de 4 meses` ()   BEGIN

 DELETE FROM Medidas WHERE fecha < now() - INTERVAL  124 DAY;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Alertas`
--

DROP TABLE IF EXISTS `Alertas`;
CREATE TABLE `Alertas` (
  `id_alerta` int(11) NOT NULL,
  `alerta` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sensor` char(17) NOT NULL,
  `id_escuela` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Escuelas`
--

DROP TABLE IF EXISTS `Escuelas`;
CREATE TABLE `Escuelas` (
  `id_escuela` int(20) NOT NULL,
  `pswrd` char(64) NOT NULL,
  `localidad` char(100) DEFAULT NULL,
  `nombre` char(50) DEFAULT NULL,
  `login` varchar(15) NOT NULL,
  `logo` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Medidas`
--

DROP TABLE IF EXISTS `Medidas`;
CREATE TABLE `Medidas` (
  `id_medida` int(60) NOT NULL,
  `MAC_sensor` char(17) NOT NULL,
  `co2` int(5) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `temp` float DEFAULT NULL,
  `humedad` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Disparadores `Medidas`
--
DROP TRIGGER IF EXISTS `alertaCO2baja`;
DELIMITER $$
CREATE TRIGGER `alertaCO2baja` BEFORE INSERT ON `Medidas` FOR EACH ROW IF NEW.co2 < 1000 AND (SELECT co2 FROM Medidas WHERE MAC_sensor = NEW.MAC_sensor ORDER BY id_medida DESC LIMIT 1) > 1000 THEN
    INSERT INTO Alertas (alerta,fecha,sensor,id_escuela) VALUES ('co2 está nuevamente por debajo de 1000 p.p.m.',NOW(), NEW.MAC_sensor,(SELECT id_escuela FROM Sensores WHERE MAC = NEW.MAC_sensor));
  END IF
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `alertaCO2sube`;
DELIMITER $$
CREATE TRIGGER `alertaCO2sube` BEFORE INSERT ON `Medidas` FOR EACH ROW IF NEW.co2 > 1000 AND (SELECT co2 FROM Medidas WHERE MAC_sensor = NEW.MAC_sensor ORDER BY id_medida DESC LIMIT 1) <1000 THEN
  INSERT INTO Alertas (alerta,fecha,sensor,id_escuela) VALUES ('co2 ha subido por encima de 1000 p.p.m.',NOW(), NEW.MAC_sensor, (SELECT id_escuela FROM Sensores WHERE MAC = NEW.MAC_sensor));
  END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Sensores`
--

DROP TABLE IF EXISTS `Sensores`;
CREATE TABLE `Sensores` (
  `MAC` char(17) NOT NULL,
  `id_escuela` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `aula` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Alertas`
--
ALTER TABLE `Alertas`
  ADD PRIMARY KEY (`id_alerta`);

--
-- Indices de la tabla `Escuelas`
--
ALTER TABLE `Escuelas`
  ADD PRIMARY KEY (`id_escuela`),
  ADD UNIQUE KEY `login` (`login`);

--
-- Indices de la tabla `Medidas`
--
ALTER TABLE `Medidas`
  ADD PRIMARY KEY (`id_medida`),
  ADD KEY `MAC_sensor` (`MAC_sensor`);

--
-- Indices de la tabla `Sensores`
--
ALTER TABLE `Sensores`
  ADD PRIMARY KEY (`MAC`),
  ADD KEY `id_escuela` (`id_escuela`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Alertas`
--
ALTER TABLE `Alertas`
  MODIFY `id_alerta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Escuelas`
--
ALTER TABLE `Escuelas`
  MODIFY `id_escuela` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Medidas`
--
ALTER TABLE `Medidas`
  MODIFY `id_medida` int(60) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Medidas`
--
ALTER TABLE `Medidas`
  ADD CONSTRAINT `Medidas_ibfk_1` FOREIGN KEY (`MAC_sensor`) REFERENCES `Sensores` (`MAC`);

--
-- Filtros para la tabla `Sensores`
--
ALTER TABLE `Sensores`
  ADD CONSTRAINT `Sensores_ibfk_1` FOREIGN KEY (`id_escuela`) REFERENCES `Escuelas` (`id_escuela`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
