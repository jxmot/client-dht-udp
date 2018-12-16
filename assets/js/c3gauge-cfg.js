/*
    Gauge Configuration and Support Functions

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
// enable waiting for messages...
const _c3_enable = function() {
    // this is how we get access to the gauge's config data
    const thisGauge = this;
    // set the device label now
    $('#'+thisGauge.panel+' #gaugeinfo').eq(0).text(thisGauge.data_channel);

    // wait for incoming messages...
    // NOTE: data_channel is known as "dev_id" in the data
    $(document).on(thisGauge.data_channel, function(e, sdata) {
        consolelog(thisGauge.name + ' got data - ' + JSON.stringify(sdata));
        // all messages have a time stamp
        var infodate = new Date(sdata.tstamp);
        // it's easy to distinguish between a status and a data
        // message... use members that are unique to each
        if(sdata.status !== undefined) {
            // status, render and display it...
            var out = infodate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false}) + ' - ' + sdata.status;
            if((sdata.msg !== undefined) && (sdata.msg !== null)) out = out + ' - ' + sdata.msg;
            $('#'+thisGauge.panel+' #gaugeinfo').eq(2).text(out);
        } else {
            if(sdata.seq !== undefined) {
                // data, render and display...
                $('#'+thisGauge.panel+' #gaugeinfo').eq(1).text(infodate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false}));

                let t = (thisGauge.gauges[0].round ? Math.round(sdata.t) : sdata.t);
                thisGauge.draw(thisGauge.gauges[0].chart, t);
                let last  = '<i class="gauge_label_last">'+thisGauge.trends[0].last+'</i>'; // &nbsp;&nbsp;
                let trendout = '<br><img class="gauge_label_trend" src="' + thisGauge.trends[0].get(t) + '"/>&nbsp;';
                $('#'+thisGauge.panel+' #gaugelabel').eq(0).html(t + ' ' + thisGauge.gauges[0].unit + trendout + last);

                let h = (thisGauge.gauges[1].round ? Math.round(sdata.h) : sdata.h);
                thisGauge.draw(thisGauge.gauges[1].chart, h);
                last  = '<i class="gauge_label_last">'+thisGauge.trends[1].last+'</i>';
                trendout = '<br><img class="gauge_label_trend" src="' + thisGauge.trends[1].get(h) + '"/>&nbsp;';
                $('#'+thisGauge.panel+' #gaugelabel').eq(1).html(h + ' ' + thisGauge.gauges[1].unit + trendout + last);
            }
        }
    });
};
// draw the gauge
const _c3_draw = function(_chart, point) {
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
// the entire temperature gauge (requires deep copy)
var gaugetemp = {
    target: 'gauge_temp',
    unit: '°F',
    round: false,
    opt: _c3_opt_t,
    chart: {}
 };
// the entire humidity gauge (requires deep copy)
var gaugehumi = {
    target: 'gauge_humi',
    unit: '%RH',
    round: false,
    opt: _c3_opt_h,
    chart: {}
};
// trend indicators for all gauges (does not require deep copy)
var trend = {
    dn: 'assets/img/trend_dn-30x45.png',
    eq: 'assets/img/trend_eq-30x23.png',
    up: 'assets/img/trend_up-30x45.png',
    unk:'assets/img/trend_unk-29x46.png',
    bln:'assets/img/trend_blank-30x45.png',
    last: '',
    get: function (curr, idunno = false) {
            let ret = '';

            if(this.last === '') ret = (idunno ? this.unk : this.bln);
            else ret = (curr > this.last ? this.up : (curr < this.last ? this.dn : this.eq));

            this.last = curr;
            return ret;
        }
};
//////////////////////////////////////////////////////////////////////////////
// the gauges...
var gauge_cfg = [
    {
        panel: 'sensor-1',
        name: 'Den',
        data_channel: 'ESP_49F542',
        trends: [Object.assign({}, trend), Object.assign({}, trend)],
        enable: _c3_enable,
        draw: _c3_draw,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-2',
        name: 'Master Bedroom',
        data_channel: 'ESP_49EB40',
        trends: [Object.assign({}, trend), Object.assign({}, trend)],
        enable: _c3_enable,
        draw: _c3_draw,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-3',
        name: 'Living Room',
        data_channel: 'ESP_49ECCD',
        trends: [Object.assign({}, trend), Object.assign({}, trend)],
        enable: _c3_enable,
        draw: _c3_draw,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    },
    {
        panel: 'sensor-4',
        name: 'Office',
        data_channel: 'ESP_49EC8B',
        trends: [Object.assign({}, trend), Object.assign({}, trend)],
        enable: _c3_enable,
        draw: _c3_draw,
        gauges: [JSON.parse(JSON.stringify(gaugetemp)), JSON.parse(JSON.stringify(gaugehumi))]
    }
];

