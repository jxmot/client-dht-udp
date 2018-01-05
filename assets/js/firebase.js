//////////////////////////////////////////////////////////////////////////////
/*
    Firebase - functions for interfacing with firebase
*/
/*
    Wait for new data to be written to the sensor data log
*/
gSensorData.orderByChild('tstamp').limitToLast(1).on('child_added', newSensorData);

function newSensorData(snapShot) {
    console.log('data added!!!');
    console.log(JSON.stringify(snapShot.val()));
    console.log();

    var data = JSON.parse(JSON.stringify(snapShot.val()));

    $(document).trigger(data.hostname, data);
};

/*
    Wait for new statuses to be written to the sensor status log
*/
gSensorStatus.orderByChild('tstamp').limitToLast(1).on('child_added', newSensorStatus);

function newSensorStatus(snapShot) {
    var status = JSON.parse(JSON.stringify(snapShot.val()));
    $(document).trigger(status.hostname+'_status', status);
};


/*
    In situations where a gauge (google gauges) isn't seen until its 
    first update this will obtain the last record for a specified
    gauge. And then the event is triggered and the gauge will update
    and display.
*/
// Gauges are configured in pairs, one for temperature and one for
// humidity. A single event trigger will update both, but since this
// function is called during gauge initialization it will be called
// twice with the same `hostname`. This will aid in preventing a 
// gauge from being updated twice.
var lasthostname = '';

function firebase_initGauge(hostname) {

    if(lasthostname === hostname) return;
    lasthostname = hostname;

    gSensorData.orderByChild('hostname').equalTo(hostname).limitToLast(1).once('value', function(snapShot) {
        snapShot.forEach(function(data) {
            $(document).trigger(data.val().hostname, data.val());
        });
    });
};



