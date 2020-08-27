
let MAX_DAY_PERIODS = 24;

let wxsvc_selection = '';

(function() {
    wxsvc_selection = $('#wxsvc-picker input[type=radio]:checked').val();
    $(document).trigger('wxsvc_select', [wxsvc_selection]);

    createOWMWidgets();
    createNOAATable();

    $(document).on('wxsvc_obsv', wxsvc_obsv);
    $(document).on('wxsvc_fcst', wxsvc_fcst);
})();

function createOWMWidgets() {
    for(let ix = 0; ix < MAX_DAY_PERIODS; ix++) {
        let w = makeWidget(ix);
        $('#forecast_widgets').append(w);
    }
};

function createNOAATable() {
    let t = makeTable();
    $('#forecast_table').append(t);
}

function wxsvc_obsv(e, payload) {

    let wxdata = JSON.parse(JSON.stringify(payload));

    if(wxdata.format === undefined) {
        $('#wxsvc-picker').hide();
        wxsvc_selection = wxdata.format = 'noaa-v3';
    }

    if(wxsvc_selection === wxdata.format) {
        switch(wxdata.format) {
            case 'owm-v25':
                updateOWMObsv(wxdata);
                break;
    
            case 'noaa-v3':
                updateNOAAObsv(wxdata);
                break;
    
            default:
                break;
        }
    }
};

function updateOWMObsv(wxdata) {
    noaaObsvOff();

    $('#wxsvc_plc').text(wxdata.plc);

    let obsdate = new Date(wxdata.gmt);
    let gmt = obsdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
    gmt = gmt.replace(' ', '');
    let ob = gmt.split(',');
    let time = ob[1].split(':');
    $('#wxsvc_gmt').text(ob[0] + ' @ ' + time[0] + ':' + time[1]);

    $('#wxsvc_svc').text(wxdata.svc);

    // get sunrise/set times and use just the time
    $('#wxsvc_sun').removeClass('hidden');
    let sr = new Date(wxdata.sr);

    let sundy = sr.toLocaleDateString();
    $('#wxsvc_sundy').text(sundy);

    let sunup = sr.getHours() + ':' + (sr.getMinutes() < 10 ? '0' : '') + sr.getMinutes();
    $('#wxsvc_sunup').text(sunup);

// TODO : convert to function
    let ss = new Date(wxdata.ss);
    let sundn = ss.getHours() + ':' + (ss.getMinutes() < 10 ? '0' : '') + ss.getMinutes();
    $('#wxsvc_sundn').text(sundn);

    $('#wxsvc_ico').removeClass('hidden');
    $('#wxsvc_ico')[0].src  = wxdata.icon;
    $('#wxsvc_ico')[0].alt  = wxdata.desc;

    $('#wxsvc_desc').removeClass('hidden');
    $('#wxsvc_comma').removeClass('hidden');
    $('#wxsvc_desc').text(wxdata.desc);

    $('#wxsvc_t').text(Math.round(wxdata.t));
    $('#wxsvc_h').text(wxdata.h);

    $('#wxsvc_tminmax').removeClass('hidden');
    $('#wxsvc_tmin').text(Math.round(wxdata.tmin));
    $('#wxsvc_tmax').text(Math.round(wxdata.tmax));

    $('#wxsvc_ws').text(Math.round(wxdata.ws));
    $('#wxsvc_wd').text(degToCard(wxdata.wd));
};

function updateNOAAObsv(wxdata) {
    owmObsvOff();

    $('#wxsvc_plc').text(wxdata.plc);

    let obsdate = new Date(wxdata.gmt);
    let gmt = obsdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
    $('#wxsvc_gmt').text(gmt.replace(',', ' @'));

    $('#wxsvc_svc').text(wxdata.svc);

    $('#wxsvc_desc').removeClass('hidden');
    $('#wxsvc_comma').removeClass('hidden');
    $('#wxsvc_ico').addClass('hidden');

    $('#wxsvc_desc').text(wxdata.txt);
    $('#wxsvc_t').text(wxdata.t);
    $('#wxsvc_h').text(wxdata.h);

    // todo: check all values, adjust all text as needed
    $('#wxsvc_dewhix').removeClass('hidden');
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
    if((wxdata.wg < 0) || (wxdata.wg === undefined)) $('#wxsvc_wg_msg').addClass('hidden');
    else {
        $('#wxsvc_wg_msg').removeClass('hidden');
        $('#wxsvc_wg').text(wxdata.wg);
    }
};

function wxsvc_fcst(e, payload) {

    let wxdata = JSON.parse(JSON.stringify(payload));

    if(wxdata.format === undefined) {
        $('#wxsvc-picker').hide();
        wxsvc_selection = wxdata.format = 'noaa-v3';
    }

    if(wxsvc_selection === wxdata.format) {
        switch(wxdata.format) {
            case 'owm-v25':
                $('#forecast_table').addClass('hidden');
                $('#forecast_widgets').removeClass('hidden');
                clearOWMFcasts();
                updateOWMFcast(wxdata);
                break;
    
            case 'noaa-v3':
                $('#forecast_widgets').addClass('hidden');
                $('#forecast_table').removeClass('hidden');
                clearNOAAFcast();
                updateNOAAFcast(wxdata);
                break;
    
            default:
                break;
        }
    }
};

function updateOWMFcast(wxdata) {

    let currFcast = JSON.parse(JSON.stringify(wxdata));

    let fcastdate = new Date(currFcast.gmt);
    let gmt = fcastdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
    gmt = gmt.replace(' ', '');
    let ob = gmt.split(',');
    let time = ob[1].split(':');
    $('#wxfcast_gmt').text(ob[0] + ' @ ' + time[0] + ':' + time[1]);

    for(let ix = 0; ix < MAX_DAY_PERIODS; ix++) {
        let fcdate = new Date(currFcast.per[ix].dt);
        let fcdt = fcdate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
        let fc = fcdt.split(', ');
        let time = fc[1].split(':');

        let todate = new Date(currFcast.per[ix].dt + (10800 * 1000));
        let todt = todate.toLocaleString('en-US', {timeZone:'America/Chicago', hour12:false});
        let to = todt.split(', ');
        let totime = to[1].split(':');

        $('#slot_'+ix+' #wxfcast_date')[0].innerText  = fc[0] + ', ' + dayOfWeek(fcdate);
        $('#slot_'+ix+' #wxfcast_time')[0].innerText  = time[0] + ':' + time[1] + ' to ' + totime[0] + ':' + totime[1];

        setOWMFcastHeader(ix, time[0]);

        $('#slot_'+ix+' #wxfcast_icon')[0].src        = currFcast.per[ix].icon;
        $('#slot_'+ix+' #wxfcast_temp')[0].innerText  = Math.round(currFcast.per[ix].t) + '°';
        $('#slot_'+ix+' #wxfcast_humi')[0].innerText  = currFcast.per[ix].h + '%RH';
        $('#slot_'+ix+' #wxfcast_cond')[0].innerText  = currFcast.per[ix].main;

        $('#slot_'+ix+' #wxfcast_winds')[0].innerText = Math.round(currFcast.per[ix].ws) + ' MPH';
        $('#slot_'+ix+' #wxfcast_windd')[0].innerText = degToCard(currFcast.per[ix].wd);
        $('#slot_'+ix+' #wxfcast_templ')[0].innerText = 'Low : ' + Math.round(currFcast.per[ix].tmin) + '°';
        $('#slot_'+ix+' #wxfcast_temph')[0].innerText = 'High : ' + Math.round(currFcast.per[ix].tmax) + '°';
    }
};

$('#wxsvc-picker input[type=radio]').on('change', function() {
    wxsvc_selection = $(this).val();
    $(document).trigger('wxsvc_select', [wxsvc_selection]);
});

/*
    The OWM forecast data is seprated into 3 hour segments
    with 8 segments per day. When we display each segment 
    the title(date, and time range) will have a background
    color that is indicative of its time of day. Such as,
    morning, midday, night, etc.

    
*/

let HDRCLASS = 0;
let HOURS = 1;

// TODO: Create seasonal variations
/*
    Here is the table of CSS classes(wxsvc.css) and an hour
    value(as text). The table is iterated and when a matching
    hour is found that corresponding CSS class will be applied
    to the container.
*/
let dayperiods = [
    ['wxsvc-widget-midnight', ['01']],
    ['wxsvc-widget-sunrise',  ['04']],
    ['wxsvc-widget-morning',  ['07']],
    ['wxsvc-widget-midday',   ['10','13']],
    ['wxsvc-widget-aftnoon',  ['16']],
    ['wxsvc-widget-sunset',   ['19']],
    ['wxsvc-widget-night',    ['22']]
];

/*
    Clear the dayperiod CSS class from a specified slot, 
    this will iterate through the dayperiod array and
    attempt to remove the class.
*/
function clearHdrClass(ix) {
    for(let hx = 0; hx < dayperiods.length; hx++) {
        $('#slot_'+ix+' div.wxsvc-widget-date-row').removeClass(dayperiods[hx][HDRCLASS]);
    }
};

/*
    Add a dayperiod class to a specified slot, and adjust
    the text color(dark or light) so that it is visible.
*/
function applyHdrClass(ix, hdrclass) {
    $('#slot_'+ix+' div.wxsvc-widget-date-row').addClass(hdrclass);
    adaptColor('#slot_'+ix+' div.wxsvc-widget-date-row h5','#slot_'+ix+' div.wxsvc-widget-date-row');
    $('#slot_'+ix).removeClass('hidden');
};

/*
    For a specified slot clear the dayperiod class, then
    find the appropriate one and apply it to the slot.
*/
function setOWMFcastHeader(ix, hour) {
let hdrclass = '';

    clearHdrClass(ix);

    for(let hx = 0; hx < dayperiods.length; hx++) {
        if(dayperiods[hx][HOURS].includes(hour)) {
            hdrclass = dayperiods[hx][HDRCLASS];
            break;
        }
    }

    applyHdrClass(ix, hdrclass);
};

/*
    Clear/remove all content from a specified slot
*/
function clearOWMFcast(ix) {
    $('#slot_'+ix+' #wxfcast_date')[0].innerText  = '';
    $('#slot_'+ix+' #wxfcast_time')[0].innerText  = '';
    $('#slot_'+ix+' #wxfcast_icon')[0].src        = '';
    $('#slot_'+ix+' #wxfcast_temp')[0].innerText  = '';
    $('#slot_'+ix+' #wxfcast_humi')[0].innerText  = '';
    $('#slot_'+ix+' #wxfcast_cond')[0].innerText  = '';
    $('#slot_'+ix+' #wxfcast_winds')[0].innerText = '';
    $('#slot_'+ix+' #wxfcast_windd')[0].innerText = '';
    $('#slot_'+ix+' #wxfcast_temph')[0].innerText = '';
    $('#slot_'+ix+' #wxfcast_templ')[0].innerText = '';
};

function clearOWMFcasts() {
    $('#wxfcast_gmt').text('');

    for(let ix = 0; ix < MAX_DAY_PERIODS; ix++) {
        clearOWMFcast(ix);
    }
};

function updateNOAAFcast(wxdata) {
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
};

function clearNOAAFcast(ix = 0) {
    $('#wxfcast_gmt').text('');
    for(ix = 0; ix < 6; ix++) {
        $('td#slot-'+ix+' h5.when').text('');
        $('td#slot-'+ix+' img.icon')[0].src = '';
        $('td#slot-'+ix+' img.icon')[0].alt = '';
        $('td#slot-'+ix+' p.text').text('');
    }
};

function noaaObsvOff() {
    $('#wxsvc_desc').addClass('hidden');
    $('#wxsvc_comma').addClass('hidden');
    $('#wxsvc_dewhix').addClass('hidden');
    $('#wxsvc_hix_msg').addClass('hidden');
    $('#wxsvc_wg_msg').addClass('hidden');
};

function owmObsvOff() {
    $('#wxsvc_sun').addClass('hidden');
    $('#wxsvc_ico').addClass('hidden');
    $('#wxsvc_desc').addClass('hidden');
    $('#wxsvc_comma').addClass('hidden');
    $('#wxsvc_tminmax').addClass('hidden');
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

