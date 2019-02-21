'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

// Application Setup
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Load express
const app = express();
app.use(cors());

// API Routes
// NEW VERSION OF OUR LOCATION ROUTE
app.get('/location', (request, response) => {

  searchToLatLong(request.query.data)
    .then(location => response.send(location))
    .catch(error => handleError(error, response));
})

app.get('/weather', getWeather);

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

// Location Constructor
function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.formatted_address;
  this.latitude = res.geometry.location.lat;
  this.longitude = res.geometry.location.lng;
}

// What we need to do to refactor for SQL Storage

// 1. We need to check the database to see if the location exists
//    a. If it exists -> get the location information from the database
//    b. Return the information to the front-end

// 2. If the location is NOT in the database
//    a. Get the location information from the API
//    b. Run it through the constructor
//    c. Save it to the database
//    d. Add the newly added record id to location
//    e. Return the location

function searchToLatLong(query) {
  // CREATE the query string to check for the existence of the location
  const SQL = `SELECT * FROM locations WHERE search_query=$1;`;
  const values = [query];

  // Make the query of the database
  return client.query(SQL, values)
    .then(result => {
      // Check to see if the location was found and return the results
      if (result.rowCount > 0) {
        console.log('From SQL');
        return result.rows[0];

        // Otherwise get the location information from the Google API
      } else {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

        return superagent.get(url)
          .then(data => {
            console.log('FROM API');

            // Throw an error if there is a problem with the API request
            if (!data.body.results.length) { throw 'no Data' }

            // Otherwise create an instance of Location
            else {
              let location = new Location(query, data.body.results[0]);

              // Create a query string to INSERT a new record with the location data
              let newSQL = `INSERT INTO locations (search_query, formated_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id;`;
              let newValues = Object.values(location);

              // Add the record to the database
              return client.query(newSQL, newValues)
                .then(result => {

                  // Attach the id of the newly created record to the instance of location.
                  // This will be used to connect the location to the other databases.
                  location.id = result.rows[0].id;
                })
                .catch(console.error);
            }
          })
          .catch(error => console.log('Error in SQL CALl'));
      }
    });
}

// Weather Constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function getWeather(request, response) {

  // Get weather data from DarkSky API
  const URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  return superagent.get(URL)
    .then(data => {
      const weatherSummaries = [];
      data.body.daily.data.forEach(day => {
        const summary = new Weather(day);
        weatherSummaries.push(summary);
      })
      response.send(weatherSummaries)
    });
}


