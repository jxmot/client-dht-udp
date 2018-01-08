// load the google gauge visualization - google API load 
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(initGauges);

// display the data from ThingSpeak or a similar data souce
// directly to an indexed gauge
function displayData(ix, point) {
    console.log('displayData() - ix = ' + ix + '  point = ' + point);
    if(ix >= 0 && ix < gauge_cfg.length) {
        gauge_cfg[ix].data.setValue(0, 0, gauge_cfg[ix].name);
        gauge_cfg[ix].data.setValue(0, 1, point);
        gauge_cfg[ix].chart.draw(gauge_cfg[ix].data, gauge_cfg[ix].opt);
    } else console.log('displayData() - ix out of range = ' + ix);
};

// initialize the guages...
function initGauges() {
    // initialize all gauges...
    for(var ix = 0; ix < gauge_cfg.length; ix++)
    {
        gauge_cfg[ix].data = new google.visualization.DataTable();
        gauge_cfg[ix].data.addColumn('string', 'Label');
        gauge_cfg[ix].data.addColumn('number', 'Value');
        gauge_cfg[ix].data.addRows(1);
        // attach the gauge to its DOM target
        gauge_cfg[ix].chart = new google.visualization.Gauge(document.getElementById(gauge_cfg[ix].target));
        // set the gauge label, this will be the configured name plus its type
        gauge_cfg[ix].data.setValue(0, 0, gauge_cfg[ix].name + ' ' + gauge_cfg[ix].type);
        // choose the appropriate initialization based on the data source 
        // for the gauge
        if('thingspeak' === gauge_cfg[ix].data_source) {
            // This will start a repeating "read" of Thingspeak data, with an
            // interval that's configured in _thingspk-cfg.js
            thingspk_loadData(ix);
            setInterval(thingspk_loadData, thingspk_cfg.interval, ix);
        } else if('firebase' === gauge_cfg[ix].data_source) {
            // This gauge uses Firebase. Enable the gauge to receive updates from
            // the database as records are written to it.
            gauge_cfg[ix].enable();
            // The enable() function will read the last written record for only
            // the most recent sensor. This will insure that each gauge is updated
            // when it's created.
            firebase_initGauge(gauge_cfg[ix].data_channel);
        }
    }
};


