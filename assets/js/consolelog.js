/*
    A single place to control if calls to console.log() will
    produce any output.

    In places where console.log() was called, change them to
    consolelog().
*/
const debug = true;

function consolelog(text) {
    if(debug) {
        console.log(text);
    }
};

