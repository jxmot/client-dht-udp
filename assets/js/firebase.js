//////////////////////////////////////////////////////////////////////////////
/*
    Firebase - functions for interfacing with firebase
*/
/*
*/
gSensorData.orderByChild('tstamp').limitToLast(1).on('child_added', newSensorData);



function newSensorData(snapShot) {

    console.log("data added!!!");

};



