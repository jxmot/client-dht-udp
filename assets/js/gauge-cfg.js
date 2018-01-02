var gauge_cfg = [
    // 
    {
        target: 'gauge_div',
        name:'Object',
        type: 'T',                      // or 'H'
        unit: 'F',                      // or 'C' or '%' <-- get from incoming data, req's mods
        //data_source: 'thingspeak',      // or 'firebase' or ????
        data_source: '',      // or 'firebase' or ????
        data_channel: 'field2',         // the thingspeak field, or use a unique ID, this could be "name" or "loc"
        round: true,                    // true = round the value before displaying it
        opt: {
            min: 25, max: 120,          // the range of the gauge
            width: 180, height: 180,    // size
            yellowColor: 'blue',        // change the color of the defined `yellow` sector
            yellowFrom:25, yellowTo: 55,
            greenFrom: 55, greenTo: 80,
            redFrom: 80, redTo: 120,
            minorTicks: 5
        },
        chart: {},
        data: {}
    },
    // 
    {
        target: 'gauge_div2',
        name:'Ambient',
        type: 'T',                      // or 'H'
        unit: 'F',                      // or 'C' or '%' <-- get from incoming data, req's mods
        //data_source: 'thingspeak',      // or 'firebase' or ???? (if set to '' then gauge is ignored)
        data_source: '',      // or 'firebase' or ???? (if set to '' then gauge is ignored)
        data_channel: 'field1',         // the thingspeak field, or use a unique ID, this could be "(host)name" or "loc"
        round: false,                   // true = round the value before displaying it
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
        data: {}
    },
    // 
    {
        target: 'gauge_div3',
        name:'Office',
        type: 'T',                      // or 'H'
        unit: 'F',                      // or 'C' or '%' <-- get from incoming data, req's mods
        data_source: 'firebase',      // or 'firebase' or ???? (if set to '' then gauge is ignored)
        data_channel: 'ESP_49F542',         // the thingspeak field, or use a unique ID, this could be "(host)name" or "loc"
        round: false,                   // true = round the value before displaying it
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
        enable: function() {
                    var _data = this.data;
                    var _chart = this.chart;
                    var _type = this.type;
                    var _name = this.name;
                    var _opt = this.opt;
                    $(document).on(this.data_channel, function(e, sdata) {
                        console.log(_name + '  ' + _type);
                        console.log('got data - ' + JSON.stringify(sdata));

                        _data.setValue(0, 0, _name + ' ' + _type);
                        var point = 0;
                        if(_type === 'T') {
                            point = sdata.t;
                        } else point = sdata.h;
                        _data.setValue(0, 1, point);
                        _chart.draw(_data, _opt);
                    });
                }
    },
    // 
    {
        target: 'gauge_div4',
        name:'Office',
        type: 'H',                      // or 'H'
        unit: '%',                      // or 'C' or '%' <-- get from incoming data, req's mods
        data_source: 'firebase',      // or 'firebase' or ???? (if set to '' then gauge is ignored)
        data_channel: 'ESP_49F542',         // the thingspeak field, or use a unique ID, this could be "(host)name" or "loc"
        round: false,                   // true = round the value before displaying it
        opt: {
            min: 0, max: 100, 
            width: 180, height: 180,
            //yellowColor: 'blue',
            yellowFrom:0, yellowTo: 40,
            greenFrom: 40, greenTo: 70,
            redFrom: 70, redTo: 100,
            minorTicks: 5
        },
        chart: {},
        data: {},
        enable: function(ix) {
                    var _data = this.data;
                    var _chart = this.chart;
                    var _type = this.type;
                    var _name = this.name;
                    var _opt = this.opt;
                    $(document).on(this.data_channel, function(e, sdata) {
                        console.log(_name + '  ' + _type);
                        console.log('got data - ' + JSON.stringify(sdata));

                        _data.setValue(0, 0, _name + ' ' + _type);
                        var point = 0;
                        if(_type === 'T') {
                            point = sdata.t;
                        } else point = sdata.h;
                        _data.setValue(0, 1, point);
                        _chart.draw(_data, _opt);
                    });
                }
    }
];
