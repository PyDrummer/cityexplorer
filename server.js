'use strict';

// Building a server notes!
// backend will use port 3000
// creating a server is the same everytime npm init -y in the console.
// next install the dependancies, npm install express cors dotenv in the console.
// alternatively if you clone from another person's repo you may use npm install to get all the depenancies.

//----------------------------------------------------------------------------------------------------------

// bring in the dependancies as variables
const express = require('express');
const cors = require('cors'); //cross origin resource sharing
const superagent = require('superagent');
const { response } = require('express');

require('dotenv').config(); // used to read a file/environment variables

// Declare our port for our server to listen on
const PORT = process.env.PORT || 3000; // reads the hidden file .env grabbing the PORT
// Start/instanciate express
const app = express();
// use CORS
app.use(cors()); // "just press 'I believe' for this"

//----------------------------------------------------------------------------------------------------------

// Creating a route!!
// get takes 2 things in, the name of the route '/' and callback
app.get('/', (request, response) => {
  response.send('sup'); // the browser is the client in this situation sending a request and gets responded with 'sup'
  //console.log('hello world, this is the home route!');
});

// ----------------------------- Route handlers ----------------------------------

// switching to using superagent on location route
app.get('/location', locationHandler);
// superagent on weather
app.get('/weather', weatherHandler);
// notFoundHandler function located below the constructors
app.use('*', notFoundHandler);

function locationHandler(req, res) {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY;

  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  //console.log(URL);

  superagent.get(URL)
    .then(data => {
      //console.log(data.body);
      let location = new Location(city, data.body[0]);
      res.status(200).json(location);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for Location?');
    });
}

function weatherHandler(req, res) {
  let city = req.query.search_query; // now our 'city' is search_query because of the constructor.
  console.log(`req.query ${req.query.search_query}`);
  let key = process.env.WEATHERBIT_API_KEY;

  const URL = `http://api.weatherbit.io/v2.0/forecast/daily/current?city=${city}&country=United%20States&key=${key}&days=7`;

  superagent.get(URL)
    .then(data => {
      console.log(data.body);
      let weatherArray = data.body.data.map(day => {
        // .map iterates over an array, changes each item in a way (stringing/constructor/etc). Then returns the changed item.

        //----------------------
        // turning the date into a string
        // let everyDay = day.datetime;
        // let splitDay = everyDay.split('-');
        let stringDay = new Date(day.ts * 1000).toDateString();
        console.log(stringDay);
        // each date is now a string in stringDay
        //-----------------------

        return new Weather(stringDay, day);
      });
      console.log(weatherArray);
      res.status(200).json(weatherArray);
      res.send(weatherArray);
    })
    // error handler pass in the error
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for weather?');
    });
}

// Now build a constructor to tailor the data.

function Location(query, obj) {
  this.search_query = query;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.formatted_query = obj.display_name;
}

function Weather(date, obj) {
  this.time = date;
  this.forecast = obj.weather.description;
}

//----------------------------------------------------------------------------------------------------------

// not found handler here:
function notFoundHandler(req, res) {
  res.status(404).send('Try again.');
}


// Start the server! Which port are we listening on?
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
