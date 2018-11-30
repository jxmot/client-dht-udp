/*
    Gauge Initialization and Purge event handler

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
(function() {
    c3_initGauges();
    adaptColor('h3.sensor-panel-title','div.panel-heading');
    adaptColor('div.gauge_label','body');
})();

// initialize the gauges...
function c3_initGauges() {
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

