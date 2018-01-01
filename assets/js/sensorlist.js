
// TODO: move this data to firebase and read it from there, don't 
// look them up on each update, but read the entire table and search
// it for the incoming sensor's info.
var sensorList : [
    {name:"ESP_49EC8B",loc:"BLU",low_limit:40,high_limit:95},
    {name:"ESP_49F542",loc:"RED",low_limit:40,high_limit:95},
    {name:"ESP_49EB40",loc:"GRN",low_limit:40,high_limit:95},
    {name:"ESP_49ECCD",loc:"WHT",low_limit:40,high_limit:95},
    {name:"END",loc:"END"}
];

