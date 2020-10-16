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
    });
};

function renderLocation(userLocation) {
  // mustache templating to append our .ajax API data that was returned.
  let $template = $('#geocoding-template').html();
  let html = Mustache.render($template, userLocation);
  $('#geocode').append(html);
}
