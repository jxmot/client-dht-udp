# client-dht-udp

**This document is a work-in-progress. Please note that this document may not be complete until this message is removed.**

This is a web client to my **[node-dht-udp](https://github.com/jxmot/node-dht-udp)** server, and displays temperature and humidity using gauges. It also displays current weather condition and forecast data from a *selectable* weather data source.

- [History](#history)
- [Overview](#overview)
  * [Technologies Used](#technologies-used)
  * [Application UI Layout](#application-ui-layout)
    + [Sensor Data Display](#sensor-data-display)
    + [System Status](#system-status)
    + [Weather Data](#weather-data)
- [Design Details](#design-details)
  * [Application Start Up](#application-start-up)
  * [Gauges](#gauges)
    + [Configuration](#configuration)
    + [Gauge Configuration Components](#gauge-configuration-components)
      - [Configuration Subcomponents](#configuration-subcomponents)
    + [Gauge HTML Elements](#gauge-html-elements)
    + [Initialization](#initialization)
  * [Connecting to the SensorNet Server](#connecting-to-the-sensornet-server)
    + [Configuration](#configuration-1)
  * [Status and Data Reception](#status-and-data-reception)
  * [Sensor Status](#sensor-status)
  * [Sensor Data](#sensor-data)
  * [Data Purge Status](#data-purge-status)
  * [Weather Data Reception](#weather-data-reception)
    + [Service Selection](#service-selection)
      - [Switching Between Services](#switching-between-services)
- [Extras](#extras)
- [Future](#future)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# History

This project was created as a submodule of a larger project that I'll refer to as **_SensorNet_**. That project can be found here - **[sensornet](https://github.com/jxmot/sensornet)**.

During the initial development I investigated a number of gauge type displays. My requirements for a gauge included - 

* Must be configurable. The gauge's range, segment coloring & size, overall size, and behavior need to be configurable. And if possible those settings should have the ability to be altered during run-time.
* Development must be current and active. "Old code" is not acceptable. 
* Must be free of *major* bugs or deficiencies. I expect the gauges to work, and not require my time to find and fix someone else's bugs.
* The integration must be straight forward and not cumbersome.
* Must be *responsive*. The gauge(s) must resize as necessary as the browser's viewport size is changed.

After investigating a number of options I decided that *<a href="https://c3js.org/" target="_blank">C3.js v0.4.18</a>*  would be the best choice. The others I tried were cumbersome and bug-ridden. In addition their documentation was also lacking. However I will continue to research additional options.

# Overview

## Technologies Used

* HTML/CSS
* Bootstrap
* JavaScript/jQuery

## Application UI Layout

<p align="center">
  <img src="./mdimg/sensornet-sshot1-530x350.png" style="width:65%"; alt="SensorNet Screen Shot #1" txt="SensorNet Screen Shot #1"/>
</p>

The page consists of four sensor *panels*, and three *collapsible panels*. It is responsive and viewable even on smaller mobile screens.

### Sensor Data Display

<p align="center">
  <img src="./mdimg/sensornet-sshot1b-530x237.png" style="width:65%"; alt="SensorNet Screen Shot #1b" txt="SensorNet Screen Shot #1"/>
</p>

### System Status

At this time the only system status that the client will display is the *data purge status*. It is an indication of the number of old sensor status and data records that were deleted in a data purge. Please see [node-dht-udp](https://github.com/jxmot/node-dht-udp) for additional details.

<p align="center">
  <img src="./mdimg/sensornet-sshot3B-1060x400.png" style="width:65%"; alt="SensorNet Screen Shot #3b" txt="SensorNet Screen Shot #3b"/>
</p>

### Weather Data

The SensorNet client does not obtain the weather data from its source. That task belongs to the SensorNet server, along with storing it until requested by a web client. The server will periodically request new data from the weather data provider. And when new data has been collected the SensorNet server will broadcast the data to all connected clients.

<p align="center">
  <img src="./mdimg/sensornet-sshot2-530x408.png" style="width:65%"; alt="SensorNet Screen Shot #2" txt="SensorNet Screen Shot #2"/>
</p>

<p align="center">
  <img src="./mdimg/sensornet-sshot2b-530x298.png" style="width:65%"; alt="SensorNet Screen Shot #2b" txt="SensorNet Screen Shot #2b"/>
</p>

Please see [node-dht-udp](https://github.com/jxmot/node-dht-udp) for additional details.

# Design Details

The SensorNet client function is to render sensor status and data for display in a browser. It does not interact with the SensorNet server except to establish a connection and to request to change the weather data source. After that it only receives sensor status & data, and weather condition & forecast data.

## Application Start Up

<p align="center">
  <img src="./mdimg/appstart-flow-860x497.png" style="width:80%;" alt="Client start up" txt="Client start up"/>
</p>


## Gauges 

The gauges in this application are based on the C3.js gauge example found [here](https://c3js.org/samples/chart_gauge.html).

There have been many changes made to how the gauges are implemented. In this application each gauge is kept as an object in an array. The objects contain - 

* gauge application-specific configuration items
* gauge-instance specific appearance configuration items - type, range, color bands, caption, etc
* gauge-instance specific functions and event handlers

### Configuration

The gauges are grouped in pairs, one gauge for temperature and the other is humidity. And each gauge is represented as an object within an array. In HTML the pair of gauges reside in a *panel* along with sensor status messages.

Here's an example of a configuration for two gauges in the same panel : 

```javascript
var gauge_cfg = [
    // Temperature Gauge
    {
        data_channel: 'ESP_49F542',
        name: 'Den',
        target: 'gaugediv_1',

        type: t_gauge.type,
        unit: t_gauge.unit,

        label: 'gaugelab_1',
        device: 'gauge_device_1',
        info: 'gauge_update_1',
        status: 'gauge_status_1',

        round: false,

        opt: _c3_temp_gauge.opt,
        chart: {},
        data: {},
        enable: _c3_enable
    },
    // Humidity Gauge
    {
        data_channel: 'ESP_49F542',
        name: 'Den',
        target: 'gaugediv_2',

        type: h_gauge.type,
        unit: h_gauge.unit,

        label: 'gaugelab_2',
        device: 'gauge_device_1',
        info: 'gauge_update_1',
        status: 'gauge_status_1',

        round: false,

        opt: _c3_humi_gauge.opt,
        chart: {},
        data: {},
        enable: _c3_enable
    }
};
```

Please note that there is some duplication of fields between paired gauges(*temperature & humidity*). And at this time the duplication is intentional. The purpose was to insure that *each* gauge was independent of the others and could have its own text elements assigned to it.

### Gauge Configuration Components

Each gauge configuration consists of the following components :

**Gauge Information :**

```javascript
data_channel: 'ESP_49F542',
name: 'Den',
target: 'gaugediv_1',
```

* `data_channel` - This links the gauge to a specific sensor. 
* `name` - This is the displayed name for the sensor.
* `target` - The ID of the `<div>` where the gauge will be contained.

**Gauge Type & Unit of Measure :**

This 

```javascript
type: t_gauge.type,
unit: t_gauge.unit,
```

* `type` - Contains `'T'` or `'H'` to indicate temperature or humidity.
* `unit` - Contains `'°F'` or `'°C'` to indicate Fahrenheit or centigrade.

The `t_gauge` object is the container for those options, and is reused in all temperature gauges.

**Sensor Data Display Elements :**

```javascript
label: 'gaugelab_1',
device: 'gauge_device_1',
info: 'gauge_update_1',
status: 'gauge_status_1',
```

* `label` - 
* `device` - 
* `info` - 
* `status` - 

**Sensor Data Adjustments :**

```javascript
round: false,
```

* `round` - If true the gauge value will be rounded to the nearest integer value.

**Gauge Configuration for C3.js :**

```javascript
opt: _c3_humi_gauge.opt,
chart: {},
data: {},
enable: _c3_enable
```

* `opt` - 
* `chart` - 
* `data` - 
* `enable` - 

#### Configuration Subcomponents


### Gauge HTML Elements

And here's the associated gauge HTML : 

```html
<div class="col-lg-2 col-lg-offset-2 col-md-3 col-sm-6 col-xs-12">
    <div id="sensor-panel-1" class="panel panel-success">
        <div class="panel-heading">
            <h3 id="sensor-panel-title-1" class="panel-title sensor-panel-title">Den</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 gauge_outer">
                    <div id="gaugediv_1" class="gauge_inner"></div>
                    <div id="gaugelab_1" class="gauge_label"></div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 gauge_outer">
                    <div id="gaugediv_2" class="gauge_inner"></div>
                    <div id="gaugelab_2" class="gauge_label"></div>
                </div>
            </div>
            <br>
            <header><h6>Device :</h6> <span id="gauge_device_1"></span></header>
            <header><h6>Update :</h6> <span id="gauge_update_1"></span></header>
            <header><h6>Status :</h6> <span id="gauge_status_1"></span></header>
        </div>
    </div>
</div>
```

### Initialization

<p align="center">
  <img src="./mdimg/gauges_init-flow-1-350x1368.png" style="max-width:25%;" alt="Client start up" txt="Client start up"/>
</p>

```javascript
(function() {
    initGauges();
})();

function initGauges() {
    // initialize all gauges...
    for(var ix = 0; ix < gauge_cfg.length; ix++)
    {
        // attach the gauge to its DOM target
        gauge_cfg[ix].opt.bindto = document.getElementById(gauge_cfg[ix].target);
        gauge_cfg[ix].chart = c3.generate(gauge_cfg[ix].opt);
        gauge_cfg[ix].enable();
    }
    // let the app know we're ready for incoming sensor 
    // status and data
    $(document).trigger('gauges_ready', true);
};
```

## Connecting to the SensorNet Server

Connecting to a Socket.io server is easy. The only *catch* is the client has to wait until all of the gauges have finished initializing. If it didn't wait status & data messages would be lost and not displayed. The gauge initialization code will emit a `gauges_ready` event after it has finished.

```javascript
$(document).on('gauges_ready', function() {
    // initialize sockets for incoming sensor status and data
    initSocket();
});


var socket;
var socketready = false;

function initSocket() {
    socket = io.connect(socketserver.host+':'+socketserver.port+'/', {
                        'reconnection': true,
                        'reconnectionDelay': 3000,
                        'reconnectionDelayMax' : 5000,
                        'reconnectionAttempts': 4});

    socket.on('connect_error', function(error) {
        // it's convenient that the alert halts everything,
        // makes it easier when restarting the server.
        alert('connect_error - '+JSON.stringify(error));
    });

    socket.on('server', function(data) {
        console.log('server - '+JSON.stringify(data));
        if(data.status === true) socketready = true;
        else socketready = false;
    });

    socket.on('status', showStatus);
    socket.on('data', showData);
    socket.on('purge', showPurge);
    socket.on('wxobsv', showWXObsv);
    socket.on('wxfcst', showWXFcast);

    socket.on('disconnect', function(){ 
        socketready = false;
        consolelog('ERROR - socket is disconnected');
    });
};
```

**NOTE : The SensorNet server must be running and accessible over the network by the client.**

### Configuration

The client must connect to a *known* Socket.io server. For convenience, the server's IP address and port number are configurable. An example can be found in `example_socketcfg.js`.

```
var socketserver = {
    host: 'your-socketio-host',
    port: 3000,
};
```

Make a copy of the file and save it as `_socketcfg.js`. Then edit it to match your server and save it. 

## Status and Data Reception

```javascript
    // listen for specific messages...
    socket.on('status', showStatus);
    socket.on('data', showData);
    socket.on('purge', showPurge);
    socket.on('wxobsv', showWXObsv);
    socket.on('wxfcst', showWXFcast);
```

## Sensor Status

## Sensor Data

## Data Purge Status

## Weather Data Reception

The SensorNet server is responsible for collecting and distributing the weather data to all connected clients. This approach is well suited for reducing the quantity of API requests that are sent to the weather data provider. Please see **[node-dht-udp](https://github.com/jxmot/node-dht-udp)** for detailed information.

### Service Selection

In the upper-right corner of the weather data panel are some radio buttons. They're used for selecting a weather data service as the provider for the displayed data and icons.

<p align="center">
  <img src="./mdimg/wxsel-254x97.png" alt="Weather service radio buttons" txt="Weather service radio buttons"/>
</p>

#### Switching Between Services

The radio buttons have `data` attributes that contain a *weather service ID* that is sent to the server to select a data provider. 

```html
<div id="wxsvc-picker" class="wxsvc-center">
    <h5>Choose a data source:</h5>
    <div class="radio-inline">
        <label class="use-pointer"><input class="use-pointer" type="radio" data-wxsvc="noaa-v3" name="optradio">NOAA</label>
    </div>
    <div class="radio-inline">
        <label class="use-pointer"><input class="use-pointer" type="radio" data-wxsvc="owm-v25" name="optradio" checked>OpenWeatherMap</label>
    </div>
</div>
```

```javascript
let wxsvc_selection = '';

(function() {
    wxsvc_selection = $('#wxsvc-picker input[type=radio]:checked').data('wxsvc');
    $(document).trigger('wxsvc_select', [wxsvc_selection]);
};

$('#wxsvc-picker input[type=radio]').on('change', function() {
    wxsvc_selection = $(this).data('wxsvc');
    $(document).trigger('wxsvc_select', [wxsvc_selection]);
});
```

# Extras

* `consolelog.js` - `consolelog()`, an alternative to `console.log()`. A boolean variable determines if output is sent to the console.
* `utils.js` - `adaptColor()`, used for automatically adjusting the text color based on the background color. 

# Future

Here's a list of things I'd like to investigate and possibly implement : 

* Increase quantity of gauge panels. And place all of them into a carousel or some other type of container. It would have to work for mobile and desktop browsers.
* Receive gauge info from the server via Socket.io during application start-up. This would include - 
    * Name
    * Data Channel
    * *TBD*
* Make the gauge panels *dynamic*, like the weather widgets and table they will not exist until rendered at application start-up.
* Rework the gauge element IDs. This will follow "Make the gauge panels *dynamic*".
* * Gauge visual enhancements : 
    * Implement *trend* indicators, these will show whether the current value is "up" or "down" from the last value.
    * Increase the number of value ranges for both types of gauge.
* Add a panel to show current thermostat state. *This will require modifications to the server*
* Historical sensor data graphs.
* Historical weather data, saved on the server and recalled by the application. 

<br>
<hr>
<br>
<p style="text-align:center">(c) 2018 Jim Motyl - https://github.com/jxmot/</p>
<br>
