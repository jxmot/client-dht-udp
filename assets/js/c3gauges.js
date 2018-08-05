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

// announce the purge statuses...
$(document).on('purge_status', function(e, payload) {
    // this portion of the page might have been disabled 
    // via options. don't try to change it if it doesn't 
    // exist on the page.
    if(document.getElementById(payload.dbtable) != null) {
        // our payload looks like this....
        // {"dbtable":"data","dbresult":true,"dbrows":0,"tstamp":1517400205347}
        // {"dbtable":"status","dbresult":true,"dbrows":0,"tstamp":1517400205347}
    
        // use the purged table name to reach its associated 
        // element. The render the result and the quantity of
        // rows that were purged.
        var out = `${((payload.dbresult) ? 'Success!' : 'Failed!')} purged <strong>${payload.dbrows}</strong> rows from table "<strong>${payload.dbtable}</strong>"`;
        // for handling older style data w/o the timestamp
        if(payload.tstamp !== undefined) {
            var purgedate = new Date(payload.tstamp);
            out += ` @ ${purgedate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false})}`;
        }
        document.getElementById(payload.dbtable).innerHTML = out;
    }
});

