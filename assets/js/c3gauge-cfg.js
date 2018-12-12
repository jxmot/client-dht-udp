/*
    Gauge Configuration and Support Functions

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
// enable waiting for messages...
const _c3_enable = function() {
    // this is how we get access to the gauge's config data
    const thisGauge = this;
    // set the device label now
    document.getElementById(thisGauge.device).innerHTML = thisGauge.data_channel;
    // wait for incoming messages...
    // NOTE: data_channel is known as "dev_id" in the data
    $(document).on(thisGauge.data_channel, function(e, sdata) {
        consolelog(thisGauge.name + '  ' + thisGauge.type);
        consolelog('got data - ' + JSON.stringify(sdata));
        // all messages have a time stamp
        var infodate = new Date(sdata.tstamp);
        // it's easy to distinguish between a status and a data
        // message... use members that are unique to each
        if(sdata.status !== undefined) {
            // status, render and display it...
            var out = infodate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false}) + ' - ' + sdata.status;
            if((sdata.msg !== undefined) && (sdata.msg !== null)) out = out + ' - ' + sdata.msg;
            document.getElementById(thisGauge.status).innerHTML = out;
        } else {
            if(sdata.seq !== undefined) {
                // data, render and display...
                var point = 0;
                if(thisGauge.type === 'T') {
                    point = sdata.t;
                    // since the temperature and humidity arrive in 
                    // the same data packet then we'll only update 
                    // this info when we update the temperature
                    document.getElementById(thisGauge.info).innerHTML = infodate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
                } else point = sdata.h;
                if(thisGauge.round) point = Math.round(point);
                document.getElementById(thisGauge.label).innerHTML = point + ' ' + thisGauge.unit;
                _c3_draw(thisGauge.chart, point);
            }
        }
    });
};
// draw the gauge
const _c3_draw = function (_chart, point) {
    _chart.load({
        columns: [['data', point]]
    });
};
// temperature gauge options
var _c3_opt_t = {
    bindto: null,
    size: {
      //width: 100,
      height: 75
    },
    data: {
        columns: [
            ['data', null]
        ],
        type: 'gauge',
        selection: {
            isselectable: function (d) { return false }
        }
    },
    transition: {
        duration: null
    },
    gauge: {
        expand: false,
        label: {
            format: function(value, ratio) {
                // this will disable the label that gets
                // displayed by c3.js
                return null;
            },
            show: true
        },
        min: 25,
        max: 120
    },
    color: {
        pattern: ['#0000ff', '#00BF00', '#ff0000'],
        threshold: {
            values: [60, 90, 120]
        }
    },
    tooltip: {
        show: false
    }
};
// humidity gauge options
var _c3_opt_h = {
    bindto: null,
    size: {
      //width: 100,
      height: 75
    },
    data: {
        columns: [
            ['data', null]
        ],
        type: 'gauge',
        selection: {
            isselectable: function (d) { return false }
        }
    },
    transition: {
        duration: null
    },
    gauge: {
        expand: false,
        label: {
            format: function(value, ratio) {
                // this will disable the label that gets
                // displayed by c3.js
                return null;
            },
            show: true
        }
    },
    color: {
        pattern: ['#F97600', '#00BF00', '#ff0000'], 
        threshold: {
            values: [40, 70, 100]
        }
    },
    tooltip: {
        show: false
    }
};
// temperature gauge draw function and options
var _c3_temp_gauge = {
    draw: _c3_draw,
    opt:  _c3_opt_t
};
// humidity gauge draw function and options
var _c3_humi_gauge = {
    draw: _c3_draw,
    opt:  _c3_opt_h
};
// temperature gauge type and unit of measure text
var t_gauge = {
    type: 'T',
    unit: '°F'
};
// humidity gauge type and unit of measure text
var h_gauge = {
    type: 'H',
    unit: '%RH',
};
// the entire temperature gauge
var gaugetemp = {
    target: 'gauge_temp',
    type: t_gauge.type,
    unit: t_gauge.unit,
    round: false,
    opt: _c3_temp_gauge.opt,
    chart: {},
    data: {}
 };
// the entire humidity gauge
var gaugehumi = {
    target: 'gauge_humi',
    type: h_gauge.type,
    unit: h_gauge.unit,
    round: false,
    opt: _c3_humi_gauge.opt,
    chart: {},
    data: {}
};
//////////////////////////////////////////////////////////////////////////////
// the gauges...
var gauge_cfg = [
    {
        panel: 'sensor-1',
        name: 'Den',
        data_channel: 'ESP_49F542',
        enable: _c3_enable,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-2',
        name: 'Master Bedroom',
        data_channel: 'ESP_49EB40',
        enable: _c3_enable,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-3',
        name: 'Living Room',
        data_channel: 'ESP_49ECCD',
        enable: _c3_enable,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-4',
        name: 'Office',
        data_channel: 'ESP_49EC8B',
        enable: _c3_enable,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    }
];

