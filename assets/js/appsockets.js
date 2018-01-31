/*
    Application Socket Communication
*/
var socket;
var socketready = false;

// initialize the socket connection and wait for messages
function initSocket()
{
    // initialize
    socket = io.connect(socketserver.host+':'+socketserver.port+'/');
    // NOTE: this might be removed if no use is needed
    socket.on('SERVER', function(data) {
        consolelog('SERVER - '+JSON.stringify(data));
        if(data.status === true) socketready = true;
        else socketready = false;
    });
    // wait for messages
    socket.on('status', showStatus);
    socket.on('data', showData);
};
// status has arrived, show it to the client...
function showStatus(data) {
    consolelog('showStatus - '+JSON.stringify(data.payload));
    $(document).trigger(data.payload.dev_id, data.payload);
};

// data has arrived, show it to the client...
function showData(data) {
    consolelog('showData - '+JSON.stringify(data.payload));
    $(document).trigger(data.payload.dev_id, data.payload);
};

// initialize our socket connections when the app is ready
$(document).on('app_ready', function() {
    // initialize sockets for incoming sensor status and data
    initSocket();
});


