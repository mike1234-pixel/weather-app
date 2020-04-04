/*EXPRESS */
require("dotenv").config(); // to read .env file
const express = require("express");
const ejs = require("ejs");
const app = express();

/* BODY PARSER - parses our post requests so we can capture input data submitted by user */
const bodyParser = require("body-parser");

/* HTTPS */
const https = require("https"); // native node module that enables us to make an API call and parse the returned data.

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("index.ejs");
});

app.get("/error", function(req, res) {
  res.render("error.ejs");
});

app.post("/", function(req, res) {
  console.log(req.body.cityName); // post method captures the data inputted by user, we access that data here.

  const query = req.body.cityName; // user input used as query in the API call
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function(response) {
    console.log(response.statusCode); // successful if 200

    if (response.statusCode === 200) {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data); // parses the hexadecimal data we get to JSON format

        const temperature = weatherData.main.temp; // specify JSON path to specific data we want, store in var
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("results.ejs", {
          query: query,
          temperature: temperature,
          weatherDescription: weatherDescription,
          icon: icon,
          imageURL: imageURL
        });
        console.log(icon);
      });
    } else {
      res.render("error.ejs");
    }
  });
});

app.listen(3012, function() {
  console.log("Server is running on port 3012");
});

// openweather map weather conditions list: https://openweathermap.org/weather-conditions
