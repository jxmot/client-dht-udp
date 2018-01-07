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

## Design Details

From this point on it is *assumed* that the reader has some experience with - 

* HTML & CSS - just the basics.
* JavaScript - specifically events, triggers, and handlers. And accessing the DOM.
* Firebase - data retrieval.

The following topics will be covered in this document - 

* Gauge configuration & initialization.
* Data events.

### Gauge Configuration

The displayed gauges are configured in an array of objects found in `assets/js/gauge-cfg.js`. The following aspects are configurable - 

* Target HTML element - typically a `<div>` with an ID. The element's ID is considered to be the *target*.
* Gauge Name/Label - A string that is shown on the gauge face.
* Gauge Type - In this application the type can be either "**T**" (*temperature*) or "**H**" (*humidity*).
* Gauge Unit - This can be either "**F**" (*Fahrenheit*) or "**%**" (*percent*). Please note that this setting will be implemented in a future version of this application.
* Data Source - Typically this will be "**firebase**", however the code can also accept "**thingspeak**" if the data is routed through **[ThingSpeak](<https://thingspeak.com/>)**.
* Data Channel - Each of the sensors (*ESP8266 devices*) have unique hostnames. For example - **ESP_49F542** where the last 6 characters represent the 3 right-most octets of the devices *MAC address*. 
* Rounding of data values - This `bool` if set to `true` will enable rounding to an integer value. And the gauge will not display fractional values.
* Google Gauge Options - This is where the appearance of the gauge is configured. The *range*, width & height, segment colors & ranges, and presence of *ticks* are configured here. See **[Google Charts Visualization: Gauge](<https://developers.google.com/chart/interactive/docs/gallery/gauge>)** for detailed information.

In addition to gauge configuration settings each gauge in the array also contains a `chart` and `data` object that are representations of the Google Gauge. There is also a function within each gauge object in the array. This function aids in the handling of an event that is triggered for each gauge when new data arrives. The `eventType` is the `data_channel`. And allows for better distribution of incoming data to a specified gauge.

Here is an example of a gauge configuration - 

```javascript
    {
        target: 'gauge_div3',
        name:'Den',
        type: 'T',
        unit: 'F',
        data_source: 'firebase',
        data_channel: 'ESP_49F542',
        round: false,
        opt: {
            min: 25, max: 120, 
            width: 180, height: 180,
            yellowColor: 'blue',
            yellowFrom:25, yellowTo: 55,
            greenFrom: 55, greenTo: 80,
            redFrom: 80, redTo: 120,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: _enable
    }
```

This is the function used in each of the gauge objects - 

```javascript
var _enable = function() {
    var _data = this.data;
    var _chart = this.chart;
    var _type = this.type;
    var _name = this.name;
    var _opt = this.opt;
    // NOTE: data_channel is known as "hostname" in the data
    $(document).on(this.data_channel, function(e, sdata) {
        console.log(_name + '  ' + _type);
        console.log('got data - ' + JSON.stringify(sdata));

        var point = 0;
        if(_type === 'T') {
            point = sdata.t;
        } else point = sdata.h;
        _data.setValue(0, 1, point);
        _chart.draw(_data, _opt);
    });
};
```

The preceding gauge configuration will display like this - 

<p align="center">
  <img src="./mdimg/gauge-example-1.png" alt="Gauge Example" txt="Gauge Example"/>
</p>

Each function instance requires access to members within its associated *gauge object*. This is accomplished with this portion of the code -

```javascript
    var _data = this.data;
    var _chart = this.chart;
    var _type = this.type;
    var _name = this.name;
    var _opt = this.opt;
```

Please note that the gauge *options* can be changed during run-time and the gauge's appearance will update on the subsequent data update - `_chart.draw(_data, _opt);`.

### Data Events



#### Handling Incoming Data
