'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());



// API Routes

// OLD VERSION OF OUR LOCATION ROUTE
// app.get('/location', (request, response) => {
//   const locationData = searchToLatLong(request.query.data);
//   response.send(locationData);
// });

// NEW VERSION OF OUR LOCATION ROUTE
app.get('/location', (request, response) => {

  searchToLatLong(request.query.data)
    .then(location => response.send(location))
    .catch(error => handleError(error, response));
})

app.get('/weather', (request, response) => {
  const weatherData = getWeather();
  response.send(weatherData);
});

app.use('*', handleError);

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`));

// Helper Functions

// Error handler
function handleError(err, res) {
  console.log('\n\n***********\nError Handler Helper\n\n ***********\n')
  // console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong.');
}

// REFACTOR FOR SQL
function searchToLatLong(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(res => {
      return new Location(query, res);
    })
    .catch(error => handleError);
}



function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}

function getWeather() {
  const darkskyData = require('./data/darksky.json');

  const weatherSummaries = [];

  darkskyData.daily.data.forEach(day => {
    weatherSummaries.push(new Weather(day));
  });

  return weatherSummaries;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}


