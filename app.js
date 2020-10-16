'use strict';

const API = 'http://localhost:3000';

$('form').on('submit', submitHandler);

function submitHandler(e) {
  e.preventDefault();

  let city = $('#query-search').val();

  requestLocation(city);
}

function requestLocation(placeholder) {

  const ajaxConfig = {
    method: 'get',
    dataType: 'json',
    data: {city: 'placeholder'} // what we're sending to the server, what the user types in.
  };

  $.ajax(`${API}/location`, ajaxConfig) // ${API}/location, location is the route
    .then(data => {
      console.log(data);
    });
};