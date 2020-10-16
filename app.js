'use strict';

const API = 'http://localhost:3000';

$('form').on('submit', submitHandler);

function submitHandler(e) {
  e.preventDefault();

  let city = $('#query-search').val();

  requestLocation(city);
}

function requestLocation(userCity) {

  const ajaxConfig = {
    method: 'get',
    dataType: 'json',
    data: { city: userCity } // what we're sending to the server, this is what the user types in.
  };

  // part of this .ajax call is the ajaxConfig which contains data {city: placeholder} placeholder is what the user enters.
  // ${API}/location means we are routing this request to ${API}/location
  $.ajax(`${API}/location`, ajaxConfig) // ${API}/location, location is the route
    .then(data => {
      console.log(data);
      renderLocation(data);
      requestWeather(location);
    });
}


function requestWeather(location) {
  // make our asynchronous call to our server!  (aka parallel universe)

  // ajaxSettings is what we send to ${API}/restaurants on server.js
  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
    data: { city: location }
  };

  $.ajax(`${API}/weather`, ajaxSettings)
    .then(data => {
      //console.log(data);
      data.forEach(day = {
        renderWeather(day);
      });
    });
}

function renderLocation(userLocation) {
  // mustache templating to append our .ajax API data that was returned.
  let $template = $('#geocoding-template').html();
  let html = Mustache.render($template, userLocation);
  $('#geocode').append(html);
}

function renderWeather(location){
  let $template = $('#weather-results-template').html();
  let html = Mustache.render($template, location);
  $('#restaurant').append(html);
}
