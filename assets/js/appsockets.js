/*
    Application Specific Socket.io Initialization and Event Handlers

    (c) 2017 Jim Motyl - https://github.com/jxmot/
*/
var socket;
var socketready = false;

function initSocket()
{
    socket = io.connect(socketserver.host+':'+socketserver.port+'/');

    socket.on('SERVER', function(data) {
        consolelog('SERVER - '+JSON.stringify(data));
        if(data.status === true) socketready = true;
        else socketready = false;
    });

    socket.on('status', showStatus);
    socket.on('data', showData);
    socket.on('purge', showPurge);
    socket.on('wxobsv', showWXObsv);
    socket.on('wxfcst', showWXFcast);

    socket.on('disconnect', function(){ 
        consolelog('ERROR - socket is disconnected');
    });
};

function showStatus(data) {
    consolelog('showStatus - '+JSON.stringify(data.payload));
    $(document).trigger(data.payload.dev_id, data.payload);
};

function showData(data) {
    consolelog('showData - '+JSON.stringify(data.payload));
    $(document).trigger(data.payload.dev_id, data.payload);
};

function showPurge(data) {
    consolelog('showPurge - '+JSON.stringify(data.payload));
    $(document).trigger('purge_status', data.payload);
};

function showWXObsv(data) {
    consolelog('showWXObsv - '+JSON.stringify(data.payload));
    $(document).trigger('wxsvc_obsv', data.payload);
};

function showWXFcast(data) {
    consolelog('showWXFcast - '+JSON.stringify(data.payload));
    $(document).trigger('wxsvc_fcst', data.payload);
};

$(document).on('gauges_ready', function() {
    // initialize sockets for incoming sensor status and data
    initSocket();
});


