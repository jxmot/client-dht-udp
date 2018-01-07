# client-dht-udp

This is a web client to my **[node-dht-udp](<https://github.com/jxmot/node-dht-udp>)** server, and displays temperature and humidity using gauges.

## History

This project was created as part of a larger project that I'll refer to as **_SensorNet_**. The first pass will provide a means to display temperature and humidity for one or more *sensors*. 

During the initial development I investigated a number of gauge type displays. My requirements for a gauge included - 

* Must be configurable. The gauge's range, segment coloring & size, overall size, and behavior need to be configurable. And if possible those settings should have the ability to be altered during run-time.
* Development must be current and active. "Old code" is not acceptable. 
* Must be free of *major* bugs or deficiencies. I expect the gauges to work, and not require my time to find and fix someone else's bugs.
* The integration must be straight forward and not cumbersome.
* Must be *responsive*. The gauge(s) must resize as necessary as the browser's viewport size is changed.

After investigating a number of options I decided that *Google Gauges* would be the best choice *at this time*. The other I tried were cumbersome and bug-ridden. In addition their documentation was also lacking. However I will continue to research other options.

The only requirement that isn't met with *Google Gauges* is responsiveness. However I believe that I can implement a method to achieve this.

## Overview

The *complete* SensorNet consists of - 

* Temperature & Humidity Sensors - Each sensor consists of a DHT22 device and an ESP-01S.
* Database Gateway - A NodeJS *server* that listens for sensor data and forwards the data to a database. In the current implementation the database used is *Firebase*.
* Web Client - A browser based client that monitors the database for new data and displays it to the user.

<p align="center">
  <img src="./mdimg/basic-flow-1.png" alt="SensorNet Overview" txt="SensorNet Overview"/>
</p>


