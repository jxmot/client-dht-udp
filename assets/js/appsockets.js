
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
};

function showStatus(data) {
    consolelog('showStatus - '+JSON.stringify(data.payload));
};

function showData(data) {
    consolelog('showData - '+JSON.stringify(data.payload));
    $(document).trigger(data.payload.dev_id, data.payload);
};

