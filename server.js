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
const pg = require('pg'); // postgreSQL
const { response } = require('express');

require('dotenv').config(); // used to read a file/environment variables

// Declare our port for our server to listen on
const PORT = process.env.PORT || 4000; // reads the hidden file .env grabbing the PORT if you see 4000 something is wrong with .env
// Start/instanciate express
const app = express();
// use CORS
app.use(cors()); // "just press 'I believe' for this"

// creating our postgres client
const client = new pg.Client(process.env.DATABASE_URL);

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
// superagent for trails
app.get('/trails', trailHandler);
// superagent for movies
app.get('/movies', movieHandler);
// superagent for YELP
app.get('/yelp', yelpHandler);
// notFoundHandler function located below the constructors
app.use('*', notFoundHandler);



function locationHandler(req, res) {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY;

  const SQL = `SELECT * FROM locations WHERE search_query=$1`;
  const safeValue = [city];
  client.query(SQL, safeValue)
    .then(results => {
      if (results.rows.length > 0) {
        console.log('database was used!');
        res.status(200).json(results.rows[0]);
      } else {
        const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

        superagent.get(URL)
          .then(data => {
            let location = new Location(city, data.body[0]);
            // Sending these to the database
            let cityQuery = location.search_query;
            let lat = location.latitude;
            let lon = location.longitude;
            // sending stuff to my schema.sql database
            const SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *`;
            const safeValue = [cityQuery, cityQuery, lat, lon];

            client.query(SQL, safeValue)
              .then(results => {
                console.log('this is something new in the database', results.rows);
              })
              .catch(error => {
                console.log('Error', error);
                res.status(500).send('Something went wrong.');
              });
            res.status(200).json(location);
          })
          .catch((error) => {
            console.log('error', error);
            res.status(500).send('Your API call did not work for Location?');
          });
      }
    })
    .catch(error => {
      console.log('Error', error);
      res.status(500).send('Something went wrong.');
    });
}

function weatherHandler(req, res) {
  let city = req.query.search_query; // now our 'city' is search_query because the constructor changed it.
  // console.log(`req.query ${req.query.search_query}`);
  let key = process.env.WEATHERBIT_API_KEY;

  const URL = `http://api.weatherbit.io/v2.0/forecast/daily/current?city=${city}&country=United%20States&key=${key}&days=7`;

  superagent.get(URL)
    .then(data => {
      let weatherArray = data.body.data.map(day => {
        // .map iterates over an array, changes each item in a way (stringing/constructor/etc). Then returns the changed item.

        //----------------------
        // turning the date into a string
        let stringDay = new Date(day.ts * 1000).toDateString();
        // each date is now a string in stringDay
        //-----------------------

        return new Weather(stringDay, day);
      });
      //console.log(weatherArray);
      res.status(200).json(weatherArray);
      //res.send(weatherArray);
    })
    // error handler pass in the error
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for weather?');
    });
}

// "the first ten hikes and campgrounds in the area will be displayed in the browser"
function trailHandler(req, res) {
  //let city = req.query.search_query;
  let lat = req.query.latitude;
  let lon = req.query.longitude;
  let key = process.env.TRAILS_API_KEY;

  const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${key}&days=10`;

  superagent.get(URL)
    .then(data => {
      //console.log(data.body.trails); // WORKS
      let eachTrail = data.body.trails.map(trail => {
        let timeDateSplit = trail.conditionDate.split(' ');
        let newTimeDateSplit = [];
        // If there is no updated information run this:
        timeDateSplit.forEach(timeDate => {
          if (timeDate === '1970-01-01' || timeDate === '00:00:00') {
            let notRecoredTimeDate = 'not currently updated';
            newTimeDateSplit.push(notRecoredTimeDate);
          } else {
            newTimeDateSplit.push(timeDate);
          }
        });
        return new Trails(trail, newTimeDateSplit);
      });
      res.status(200).json(eachTrail);
      //res.send(eachTrail);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for trail?');
    });
}

// "the top twenty movies set in the area will be displayed in the browser"
function movieHandler(req, res) {
  let city = req.query.search_query;
  let key = process.env.MOVIE_API_KEY;

  const URL = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${city}&page=1&include_adult=false`;

  superagent.get(URL)
    .then(data => {
      // console.log(data.body.results[0]); // shows 'Sleepless in Seattle'
      let eachMovie = data.body.results.map(movies => {
        let imageToUse = '';
        if (movies.poster_path === null && movies.backdrop_path === null){
          imageToUse = 'https://i.imgur.com/GQPN5Q9.jpeg';
        }
        else if (movies.poster_path) {
          imageToUse = `https://image.tmdb.org/t/p/w500${movies.poster_path}`;
        }
        else if (movies.backdrop_path) {
          imageToUse = `https://image.tmdb.org/t/p/w500${movies.backdrop_path}`;
        }
        // console.log('image using: ', imageToUse);
        return new Movies(movies, imageToUse);
      });
      eachMovie = eachMovie.slice(0, 20);
      res.status(200).json(eachMovie);
      //res.send(eachMovie);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for Movies?');
    });
}

function yelpHandler(req, res) {
  const page = req.query.page || 1;
  let numPerPage = 5;
  let city = req.query.search_query;
  let key = process.env.YELP_API_KEY;
  const offset = ((page - 1) * numPerPage);

  const URL = `https://api.yelp.com/v3/businesses/search?location=${city}&term=restaurants&limit=5&offset=${offset}`;

  superagent.get(URL)
    .set('Authorization', `Bearer ${key}`)
    .then( data => {
      console.log(data.body.businesses[0]);
      let eachRestaurant = data.body.businesses.map(food =>{
        return new Restaurant(food);
      });
      res.status(200).json(eachRestaurant);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('Your API call did not work for Yelp?');
    });
}

// Now build the constructors to tailor the data.

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

function Trails(obj, dateTime) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.condition_date = new Date(dateTime[0]).toDateString();
  this.condition_time = dateTime[1];
}

function Movies(obj, img) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.popularity = obj.popularity;
  this.released_on = new Date(obj.release_date).toDateString();
  this.image_url = img;
}

function Restaurant(obj) {
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}

//----------------------------------------------------------------------------------------------------------

// not found handler here:
function notFoundHandler(req, res) {
  res.status(404).send('Try again.');
}

//Start the server! Which port are we listening on?
// app.listen(PORT, () => {
//   console.log(`Server is now listening on port ${PORT}`);
// });

// client connecting:
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Client now listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error! ', err);
  });
