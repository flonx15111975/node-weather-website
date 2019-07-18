// https://api.darksky.net/forecast/52dfe98390568dd9ba0250dfdfa4e255/37.8267,-122.4233
const darkSkySecretKey = "52dfe98390568dd9ba0250dfdfa4e255";
const darkSkyAPI_URL = "https://api.darksky.net/forecast/";

const request = require("request");

let url = (latitude, longitude, options) => {
    let ret = darkSkyAPI_URL + darkSkySecretKey + "/" + latitude + "," + longitude;

    let queryParams = "";
    options.forEach((option) => {
        if(queryParams.length === 0)
            queryParams = "?";
        else
            queryParams += "&";

        queryParams += option.key + "=" + option.value;
    });
    ret += queryParams;

    return ret;
}

let darkSky = (latitude, longitude, options, callback) => {
    let ex = null;
    let response = null;

    let _url = url(latitude, longitude, options);
    request({url: _url, json: true}, (error, {body}) => {
        if(error){
            ex = "Unable to connect to Dark Sky service!";
        }
        else if(body.error){
            ex = "Unable to find location.";
        }
        else{
            response = body;
        }
    callback(ex, response);
    });
}

module.exports = {
    darkSky: darkSky
}

