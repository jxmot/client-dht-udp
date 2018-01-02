//////////////////////////////////////////////////////////////////////////////
/*
    Firebase - functions for interfacing with firebase
*/
/*
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
*/
gSensorStatus.orderByChild('tstamp').limitToLast(1).on('child_added', newSensorStatus);

function newSensorStatus(snapShot) {
    console.log('status added!!!');
    console.log(JSON.stringify(snapShot.val()));
    console.log();

    var status = JSON.parse(JSON.stringify(snapShot.val()));

    $(document).trigger(status.hostname+'_status', status);
};



