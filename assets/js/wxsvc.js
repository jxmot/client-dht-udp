
(function() {
    adaptColor('div.wxsvc-content');
    //      OR
    //adaptColor('div.wxsvc-content','div.panel-body');
})();

$(document).on('wxsvc_obsv', function(e, payload) {

    let wxdata = JSON.parse(JSON.stringify(payload));

    $('#wxsvc_plc').text(wxdata.plc);

    let obsdate = new Date(wxdata.gmt);
    let gmt = obsdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
    $('#wxsvc_gmt').text('On ' + gmt.replace(',', ' @'));

    $('#wxsvc_svc').text(wxdata.svc);
    $('#wxsvc_txt').text(wxdata.txt);
    $('#wxsvc_t').text(wxdata.t);
    $('#wxsvc_h').text(wxdata.h);

    // todo: check all values, adjust all text as needed
    $('#wxsvc_dew').text(wxdata.dew);

    if(wxdata.hix < 0) $('#wxsvc_hix_msg').addClass('hidden');
    else {
        $('#wxsvc_hix_msg').removeClass('hidden');
        $('#wxsvc_hix').text(wxdata.hix);
    }

//  $('#wxsvc_wch').text(wxdata.wch);

    $('#wxsvc_ws').text(wxdata.ws);
    $('#wxsvc_wd').text(degToCard(wxdata.wd));
    // todo: check value, adjust text as needed
    if(wxdata.wg < 0) $('#wxsvc_wg_msg').addClass('hidden');
    else {
        $('#wxsvc_wg_msg').removeClass('hidden');
        $('#wxsvc_wg').text(wxdata.wg);
    }
});

$(document).on('wxsvc_fcst', function(e, payload) {

    clearForecast();

    let wxdata = JSON.parse(JSON.stringify(payload));

    let fcastdate = new Date(wxdata.gmt);
    let gmt = fcastdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
    $('#wxfcast_gmt').text('On ' + gmt.replace(',', ' @'));
    
    for(ix = 0; ix < wxdata.per.length; ix++) {
        if(wxdata.per[ix].slot !== undefined) {
            let slotix = wxdata.per[ix].slot;
            $('td#slot-'+slotix+' h5.when').text(wxdata.per[ix].name);
            $('td#slot-'+slotix+' img.icon')[0].src = wxdata.per[ix].icon;
            $('td#slot-'+slotix+' img.icon')[0].alt = wxdata.per[ix].alt;
            $('td#slot-'+slotix+' p.text').text(wxdata.per[ix].text);
        }
    }
});

function clearForecast() {
    $('#wxfcast_gmt').text("");
    for(ix = 0; ix < 6; ix++) {
        $('td#slot-'+ix+' h5.when').text("");
        $('td#slot-'+ix+' img.icon')[0].src = "";
        $('td#slot-'+ix+' img.icon')[0].alt = "";
        $('td#slot-'+ix+' p.text').text("");
    }
};

/*
    http://snowfence.umn.edu/Components/winddirectionanddegreeswithouttable3.htm

    Cardinal        Degree 
    Direction 	    Direction
    N               348.75 -  11.25
    NNE              11.25 -  33.75
    NE               33.75 -  56.25
    ENE              56.25 -  78.75
    E                78.75 - 101.25
    ESE             101.25 - 123.75
    SE              123.75 - 146.25
    SSE             146.25 - 168.75
    S               168.75 - 191.25
    SSW             191.25 - 213.75
    SW              213.75 - 236.25
    WSW             236.25 - 258.75
    W               258.75 - 281.25
    WNW             281.25 - 303.75
    NW              303.75 - 326.25
    NNW             326.25 - 348.75

*/
const wind_dir = [
    {card:'North', from: 348.75, to:  11.25},
    {card:'NNE',   from:  11.25, to:  33.75},
    {card:'NE',    from:  33.75, to:  56.25},
    {card:'ENE',   from:  56.25, to:  78.75},
    {card:'East',  from:  78.75, to: 101.25},
    {card:'ESE',   from: 101.25, to: 123.75},
    {card:'SE',    from: 123.75, to: 146.25},
    {card:'SSE',   from: 146.25, to: 168.75},
    {card:'South', from: 168.75, to: 191.25},
    {card:'SSW',   from: 191.25, to: 213.75},
    {card:'SW',    from: 213.75, to: 236.25},
    {card:'WSW',   from: 236.25, to: 258.75},
    {card:'West',  from: 258.75, to: 281.25},
    {card:'WNW',   from: 281.25, to: 303.75},
    {card:'NW',    from: 303.75, to: 326.25},
    {card:'NNW',   from: 326.25, to: 348.75}
];

function degToCard(deg) {
let card = '?';
    // North is a special case, because it can be > 348.75
    // or < 11.25. 
    if((deg >= wind_dir[0].from) || (deg <= wind_dir[0].to))
        card = wind_dir[0].card;
    else {
        for(ix = 1; ix < wind_dir.length; ix++) {
            if((deg >= wind_dir[ix].from) && (deg <= wind_dir[ix].to)) {
                card = wind_dir[ix].card;
                break;
            }
        }
    }
    return card;
};

function makeWidget(slotidx = 0) {
const slotx = [
'                                                    <div id="slot_'+slotidx+'" class="wxsvc-three_hour hidden">',
'                                                        <div class="row wxsvc-widget-row">',
'                                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">',
'                                                                <div class="row wxsvc-widget-date-row">',
'                                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">',
'                                                                        <h5 id="wxfcast_date" class="wxsvc-right wxsvc-nomargin-bot"></h5>',
'                                                                    </div>',
'                                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">',
'                                                                        <h5 id="wxfcast_time" class="wxsvc-left wxsvc-nomargin-bot"></h5>',
'                                                                    </div>',
'                                                                </div>',
'                                                                <div class="row">',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <img id="wxfcast_icon" class="wxsvc-imgcenter" src="">',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h5 id="wxfcast_temp" class="wxsvc-nomargin-bot"></h5>',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h5 id="wxfcast_humi" class="wxsvc-nomargin-bot"></h5>',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h5 id="wxfcast_cond" class="wxsvc-nomargin-bot"></h5>',
'                                                                    </div>',
'                                                                </div>',
'                                                                <div class="row">',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h6 id="wxfcast_winds" class="wxsvc-center wxsvc-nomargin-top"></h6>',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h6 id="wxfcast_windd" class="wxsvc-nomargin-top"></h6>',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h6 id="wxfcast_temph" class="wxsvc-nomargin-top"></h6>',
'                                                                    </div>',
'                                                                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">',
'                                                                        <h6 id="wxfcast_templ" class="wxsvc-nomargin-top"></h6>',
'                                                                    </div>',
'                                                                </div>',
'                                                            </div>',
'                                                        </div>',
'                                                    </div>',
''].join('\n');
    return slotx;
};

function makeTable() {
const table = [
'                                                    <table id="wxfcast" class="wxfcast-table">',
'                                                        <tbody id="wxfcast-body">',
'                                                            <!-- wx data is added dynamically -->',
'                                                            <tr id="wxfcast-day-row">',
'                                                                <td id="slot-0" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                                <td id="slot-2" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                                <td id="slot-4" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                            </tr>',
'                                                            <tr id="wxfcast-night-row">',
'                                                                <td id="slot-1" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                                <td id="slot-3" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                                <td id="slot-5" class="wxsvc-table-cell-center wxsvc-table-cell-vert wxsvc-table-cell-width">',
'                                                                    <h5 class="when"></h5>',
'                                                                    <img class="icon" src="" alt="">',
'                                                                    <p class="text">',
'                                                                    </p>',
'                                                                </td>',
'                                                            </tr>',
'                                                        </tbody>',
'                                                    </table>',
''].join('\n');
    return table;
};

function dayOfWeek(dt) {

const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    return days[dt.getDay()];
};

