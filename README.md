# CO₂ Sensor
 Software, Database and Web Application for a CO₂ sensor developed at the Medialab_ of the "Universidad de Oviedo".

# Introduction
 I work in a multidisciplinary team at the [Medialab_](https://medialab-uniovi.es/pro-sensorco2.php) and we are developing a sensor that the "Universidad de Oviedo", Gijon's technology park and also some schools in the area, will place in its installations. I'm in charge of the computing part of the project.

<img src="https://medialab-uniovi.es/media/fotos/sensorco2/5.png" width="300" height="200">
<em>One of the sensors performing at the medialab</em>

# Parts of the project

## Arduino
(*My Contribution in this part - About 35% of the code*)
- An arduino code which is running into a ESP32. Apart of showing messages depending of the CO₂ level and buzzing when it raises, it takes advantage of the WiFi module of the ESP32 and posts the values in a database, through an http petition to a PHP script every 30 seconds, sending the median of the CO₂ measures (in p.p.m.) taken during that time, and also the temperature and the relative humidity.

## Web Application
(*My Contribution in this part - 100% of the code*)

###### Back-End
- A MySQL database running in PHPMyAdmin. Every account has its own sensors linked to it, and every sensor takes measures, both relationships are 1:N. It also has an alerts table which gets actualized with triggers (if CO₂ is higher than 1000 p.p.m.).
- Different PHP scripts working with the database to retrieve the information needed for the different sections of the Front-End website, in JSON format.

*We already have more than 20 sensors performing into the laboratory, with a few millions of measures stored in the database, and it works allright.*

###### Front-End
- It consist in a single page website (if we despise the login page), and it changes the displayed info through Javascript, making ajax petitions to the Back-End and changing the view depending of the answer received.
- It allows to the users to see the performance of its sensors, showing a table with the performance of the sensors, summaries of their last week performance or line charts with the activity during the last 4 months.

