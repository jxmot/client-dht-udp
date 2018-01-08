
// this function is used by gauges the obtain their data
// from a firebase (or similar) data source. But NOT
// Thingspeak!
var _enable = function() {
    var _data = this.data;
    var _chart = this.chart;
    var _type = this.type;
    var _name = this.name;
    var _opt = this.opt;
    // NOTE: data_channel is known as "dev_id" in the data
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


var gauge_cfg = [
    // 
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
    },
    // 
    {
        target: 'gauge_div4',
        name:'Den',
        type: 'H',
        unit: '%',
        data_source: 'firebase',
        data_channel: 'ESP_49F542',
        round: false,
        opt: {
            min: 0, max: 100, 
            width: 180, height: 180,
            yellowFrom:0, yellowTo: 40,
            greenFrom: 40, greenTo: 70,
            redFrom: 70, redTo: 100,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: _enable
    },
    // 
    {
        target: 'gauge_div5',
        name:'MBR',
        type: 'T',
        unit: 'F',
        data_source: 'firebase',
        data_channel: 'ESP_49EB40',
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
    },
    // 
    {
        target: 'gauge_div6',
        name:'MBR',
        type: 'H',
        unit: '%',
        data_source: 'firebase',
        data_channel: 'ESP_49EB40',
        round: false,
        opt: {
            min: 0, max: 100, 
            width: 180, height: 180,
            yellowFrom:0, yellowTo: 40,
            greenFrom: 40, greenTo: 70,
            redFrom: 70, redTo: 100,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: _enable
    },
    // 
    {
        target: 'gauge_div7',
        name:'LR',
        type: 'T',
        unit: 'F',
        data_source: 'firebase',
        data_channel: 'ESP_49ECCD',
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
    },
    // 
    {
        target: 'gauge_div8',
        name:'LR',
        type: 'H',
        unit: '%',
        data_source: 'firebase',
        data_channel: 'ESP_49ECCD',
        round: false,
        opt: {
            min: 0, max: 100, 
            width: 180, height: 180,
            yellowFrom:0, yellowTo: 40,
            greenFrom: 40, greenTo: 70,
            redFrom: 70, redTo: 100,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: _enable
    },
    // 
    {
        target: 'gauge_div9',
        name:'Office',
        type: 'T',
        unit: 'F',
        data_source: 'firebase',
        data_channel: 'ESP_49EC8B',
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
    },
    // 
    {
        target: 'gauge_div10',
        name:'Office',
        type: 'H',
        unit: '%',
        data_source: 'firebase',
        data_channel: 'ESP_49EC8B',
        round: false,
        opt: {
            min: 0, max: 100, 
            width: 180, height: 180,
            yellowFrom:0, yellowTo: 40,
            greenFrom: 40, greenTo: 70,
            redFrom: 70, redTo: 100,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: _enable
    }
];
