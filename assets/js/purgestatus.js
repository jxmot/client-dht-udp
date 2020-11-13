

// announce the data-purge statuses...
$(document).on('purge_status', function(e, payload) {
var out = '';

    // this portion of the page might have been disabled 
    // via options. don't try to change it if it doesn't 
    // exist on the page.
    if(document.getElementById(payload.dbtable) != null) {
        // our payload looks like this....
        // {"dbtable":"data","dbresult":true,"dbrows":0,"tstamp":1517400205347}
        // {"dbtable":"status","dbresult":true,"dbrows":0,"tstamp":1517400205347}
    
        // use the purged table name to reach its associated 
        // element. The render the result and the quantity of
        // rows that were purged.
        out = `${((payload.dbresult) ? 'Success!' : 'Failed!')} purged <strong>${payload.dbrows}</strong> rows from table "<strong>${payload.dbtable}</strong>"`;
        // for handling older style data w/o the timestamp
        if(payload.tstamp !== undefined) {
            var purgedate = new Date(payload.tstamp);
            out += ` @ ${purgedate.toLocaleString('en-US', {hourCycle:'h23', timeZone:'America/Chicago'})}`;
        }
        document.getElementById(payload.dbtable).innerHTML = out;
    }
});

