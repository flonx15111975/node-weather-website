const path = require("path");
const express = require("express");
const hbs = require("hbs");

const chalk = require("chalk");
const utils = require("../utils");

const app = express();
const publicDirPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Photios"
    });
});
app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Us",
        name: "Photios"
    });
});
app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Photios",
        message: "this is the help message...."
    });
});

app.get("/weather", (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "address must be provided."
        });
    }
    else {
        try{
            let _forecast = null;
            let _location = null;

            let latitude = null;
            let longitude = null;
            let query = [req.query.address];
            //  GEOLOCATION
            try{
                if(query.length > 0)
                {
                    let geocodingoptions =  [{key: "limit", value: 1}];
            
                    let geocoding = utils.geocoding.geocoding(query, geocodingoptions, (error, response) => {
                        if(error){
                            return res.send({
                                error: "Geolocation Error: " + error
                            });
                        }
                        else {
                            console.log(response);
                            const {center} = response;
    
                            longitude = center[0];
                            latitude = center[1];
            
                            //  DARK SKY
                            let darkSkyoptions =  [{key: "units", value: "si"},
                                                {key: "lang", value: "en"}];
                            const darkSky = utils.dark_sky.darkSky(latitude, longitude, darkSkyoptions, (error, {timezone,currently,daily} = {}) => {
                                if(error){
                                    return res.send({
                                        error: "Geolocation Error: " + error
                                    });
                                }
                                else{
                                    const temperature = currently.temperature;
                                    const precipProbability = currently.precipProbability;
                                    const summary = daily.data[0].summary;
                                    
                                    _location = timezone;
                                    _forecast = summary + " Currently the Tempreture is " + temperature + " degrees out. There is " + precipProbability + "% chance of rain.";
                               
                                    res.send(
                                        {
                                            address: req.query.address,
                                            location: _location,
                                            forecast: _forecast
                                        });            
                                }
                            })
                        }
                    });
                }
                else{
                    return res.send({
                        error: "Please provide an address"
                    });
                }
            }
            catch(ex)
            {   
                return res.send({
                    error: "Error: " + ex                
                });
            }
        }
        catch(ex){
            return res.send({
                error: "Error: " + ex                
            });
        }
    }
});

app.get("/products", (req, res) => {
    const query = req.query;
    if(!query.search) {
        return res.send({
            error: "You must provide a search term"
        });
    }
    else {
        res.send({
            products: []
        });
    }  
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Photios",
        message: "Help article not found"
    });
});
    
app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Photios",
        message: "Page not found"
    });
});



app.listen(3000, () => {
    console.log("Server is up on port 3000");
});
