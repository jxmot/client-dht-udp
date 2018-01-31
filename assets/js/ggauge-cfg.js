/*
    Gauge Configuration and Support Functions
*/
// enable waiting for messages...
var _gg_enable = function() {
    // this is how we get access to the gauge's config data
    var thisGauge = this;
    // wait for incoming messages...
    // NOTE: data_channel is known as "dev_id" in the data
    $(document).on(this.data_channel, function(e, sdata) {
        consolelog(thisGauge.name + '  ' + thisGauge.type);
        consolelog('got data - ' + JSON.stringify(sdata));
        // distinguish between data messages and status messages
        if(sdata.seq !== undefined) {
            var point = 0;
            if(thisGauge.type === 'T') {
                point = sdata.t;
            } else point = sdata.h;
            if(thisGauge.round) point = Math.round(point);
            _gg_draw(thisGauge.data, thisGauge.chart, thisGauge.opt, point);
        }
    }); 
};

// draw the gauge
var _gg_draw = function (_data, _chart, _opt, point) {
    _data.setValue(0, 1, point);
    _chart.draw(_data, _opt);
};

// google gauge options for temperature
var _gg_opt_t = {
    min: 25, max: 120, 
    width: 180, height: 180,
    yellowColor: 'blue',
    yellowFrom:25, yellowTo: 55,
    greenFrom: 55, greenTo: 80,
    redFrom: 80, redTo: 120,
    minorTicks: 5
};

// google gauge options for humidity
var _gg_opt_h = {
    min: 0, max: 100, 
    width: 180, height: 180,
    yellowFrom:0, yellowTo: 40,
    greenFrom: 40, greenTo: 70,
    redFrom: 70, redTo: 100,
    minorTicks: 5
};

var gauge_cfg = [
    // 
    {
        target: 'gaugediv_1',
        name:'Den',
        type: 'T',
        unit: 'F',
        data_channel: 'ESP_49F542',
        round: false,
        opt: _gg_opt_t,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_2',
        name:'Den',
        type: 'H',
        unit: '%',
        data_channel: 'ESP_49F542',
        round: false,
        opt: _gg_opt_h,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_3',
        name:'MBR',
        type: 'T',
        unit: 'F',
        data_channel: 'ESP_49EB40',
        round: false,
        opt: _gg_opt_t,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_4',
        name:'MBR',
        type: 'H',
        unit: '%',
        data_channel: 'ESP_49EB40',
        round: false,
        opt: _gg_opt_h,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_5',
        name:'LR',
        type: 'T',
        unit: 'F',
        data_channel: 'ESP_49ECCD',
        round: false,
        opt: _gg_opt_t,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_6',
        name:'LR',
        type: 'H',
        unit: '%',
        data_channel: 'ESP_49ECCD',
        round: false,
        opt: _gg_opt_h,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_7',
        name:'Office',
        type: 'T',
        unit: 'F',
        data_channel: 'ESP_49EC8B',
        round: false,
        opt: _gg_opt_t,
        chart: {},
        data: {},
        enable: _gg_enable
    },
    // 
    {
        target: 'gaugediv_8',
        name:'Office',
        type: 'H',
        unit: '%',
        data_channel: 'ESP_49EC8B',
        round: false,
        opt: _gg_opt_h,
        chart: {},
        data: {},
        enable: _gg_enable
    }
];
