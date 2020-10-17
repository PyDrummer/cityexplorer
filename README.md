# cityexplorer
lab 06
**Author**: Anthony Beaver
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
This app allows the user to enter a city name. The app will then generate data about this city for the client.

## Getting Started
Go to the deployed heroku site. Then type in a city in the search option.
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture
Javascript, HTML, CSS, Node.JS and Heroku
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log
10-15: 
Begun building the scaffolding.
Added server functionality.
Deployed on heroku.
Added app.js functionality for getting user input from the submit and linked the ajax with the json file.
Added functionality to server.js for getting the request from app.js and getting our data from the json. Created a constructor to tailor the data then pushed it back to app.js
App.js can now append the tailored data recieved from the server's response.
Now i'm going to sleep.

10-17-2020 todo: delete json files, link up the location, weather and trails API keys in .env, refactor some code to use superagent on server.js.

<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.

## Credits and Collaborations
Worked with Michael Mandell on 10-15-2020
Worked with Louis Caruso
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
-->