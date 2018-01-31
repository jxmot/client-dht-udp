// load the google gauge visualization - google API load 
google.charts.load('visualization', '1', {packages:['gauge']});
google.charts.setOnLoadCallback(initGauges);

// initialize the gauges...
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
        gauge_cfg[ix].enable();
    }
    // initialize sockets for incoming sensor status and data
    $(document).trigger('app_ready', true);
};


