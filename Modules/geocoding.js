//https://api.mapbox.com/geocoding/v5/mapbox.places/Nicosia.json?access_token=pk.eyJ1IjoicGhvdGlvcyIsImEiOiJjankwMGZ3bHEwN25jM21xdDBiZmZsZGM1In0.wSAGC6AIQFlbdFvzmdeVJg&limit=1
const geocodingSecretKey = "pk.eyJ1IjoicGhvdGlvcyIsImEiOiJjankwMGZ3bHEwN25jM21xdDBiZmZsZGM1In0.wSAGC6AIQFlbdFvzmdeVJg";
const geocodingAPI_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

const request = require("request");

let url = (query, options) => {
    let ret = geocodingAPI_URL + encodeURIComponent((query.join(" "))) + ".json?access_token=" + geocodingSecretKey;

    let queryParams = "";
    options.forEach((option) => {
        queryParams += "&";
        queryParams += option.key + "=" + option.value;
    });
    ret += queryParams;

    return ret;
}

let geocoding = (query, options, callback) => {
    let ex = null;
    let response = null;

    let _url = url(query, options);
    request({url: _url, json: true}, (error, {body}) => {
        if(error){
            ex = "Unable to connect to location service!";
        }
        else if(body.error){
            ex = "Unable to find location!";
        }
        else{
            const features = body.features;
            if(!features || features.length == 0){
                ex = "Geolocation Location not found....";
            }
            else{
                response = features[0];
            }
        }
    callback(ex, response);
    });
}

module.exports = {
    geocoding: geocoding
}
