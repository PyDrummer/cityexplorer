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

// using app.get to get the request from app.js
app.get('/location', (request, response) => {
  // the ajaxConfig which contains data {userCity: placeholder} lives in the request in the .get method.
  //console.log(request.query.city); // this will return whatever the user types in the search bar.
  let city = request.query.city;

  // now we get the data we need from location.json for the response to the app.js (a flat file)
  let data = require('./data/location.json')[0];
  //console.log(data);

  // build a constructor based off the data we get from './data/location.json'
  let location = new Location(data, city);
  //console.log(location); wired up
  response.send(location); // this response gets sent back to app.js and becomes .then(data) in requestLocation
});

// using app.get
app.get('/weather', (request, response) => {
  let data = require('./data/weather.json');
  //console.log(data);

  let weatherArray = [];
  data.data.forEach(day => {

    //----------------------
    // turning the date into a string
    let everyDay = day.valid_date;
    // console.log(everyDay);
    let splitDay = everyDay.split('-');
    let stringDay = new Date(splitDay).toDateString();
    // each date is now a string in stringDay
    //-----------------------

    weatherArray.push(new Weather(stringDay, day));
  });

  response.send(weatherArray);
});

// Now build a constructor to tailor the data.

function Location(obj, query) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}

function Weather(date, obj) {
  this.time = date;
  this.forecast = obj.weather.description;
}

//----------------------------------------------------------------------------------------------------------

// Start the server! Which port are we listening on?
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
