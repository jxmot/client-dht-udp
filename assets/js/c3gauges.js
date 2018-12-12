/*
    Gauge Initialization 

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
// initialize the gauges and adjust text color
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
        $('#sensornet #panel').eq(ix).append(makeSensorPanel(ix));

        // attach the gauges to their DOM target
        //      temperature
        gauge_cfg[ix].gauges[0].opt.bindto = $('#' + gauge_cfg[ix].panel + ' #' + gauge_cfg[ix].gauges[0].target)[0];
        gauge_cfg[ix].gauges[0].chart = c3.generate(gauge_cfg[ix].gauges[0].opt);
        //      humidity
        gauge_cfg[ix].gauges[1].opt.bindto = $('#' + gauge_cfg[ix].panel + ' #' + gauge_cfg[ix].gauges[1].target)[0];
        gauge_cfg[ix].gauges[1].chart = c3.generate(gauge_cfg[ix].gauges[1].opt);
        // enable the gauge-pair for sensor data & status events
        gauge_cfg[ix].enable();
    }
    // let the app know we're ready for incoming sensor 
    // status and data
    $(document).trigger('gauges_ready', true);
};

// create a sensor panel with two gauges
function makeSensorPanel(gaugeidx) {
const gauge = [
'                    <!-- sensor panel, 2 gauges -->',
'                    <div id="'+ gauge_cfg[gaugeidx].panel + '" class="panel panel-success">',
'                        <div class="panel-heading">',
'                            <h3 class="panel-title sensor-panel-title">' + gauge_cfg[gaugeidx].name + '</h3>',
'                        </div>',
'                        <div class="panel-body">',
'                            <div class="row">',
'                                <div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 gauge_outer">',
'                                    <div id="'+gauge_cfg[gaugeidx].gauges[0].target+'" class="gauge_inner"></div>',
'                                    <div id="gaugelabel" class="gauge_label"></div>',
'                                </div>',
'                                <div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 gauge_outer">',
'                                    <div id="'+gauge_cfg[gaugeidx].gauges[1].target+'" class="gauge_inner"></div>',
'                                    <div id="gaugelabel" class="gauge_label"></div>',
'                                </div>',
'                            </div>',
'                            <br>',
'                            <header><h6>Device :</h6> <span id="gaugeinfo"></span></header>',
'                            <header><h6>Update :</h6> <span id="gaugeinfo"></span></header>',
'                            <header><h6>Status :</h6> <span id="gaugeinfo"></span></header>',
'                        </div>',
'                    </div>',
'                    <!-- ^sensor panel, 2 gauges -->',
''].join('\n');
    return gauge;
};


