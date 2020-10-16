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
  //console.log('hello world, this is the home route!');
});


// Start the server! Which port are we listening on?
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
