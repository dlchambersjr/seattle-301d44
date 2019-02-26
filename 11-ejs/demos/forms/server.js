'use strict';

// Require express to make server work easier to accomplish
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Load middleware to help parse the request.body
app.use(express.urlencoded({ extended: true }));

// Load middleware to tell the server where to find our web files.
app.use(express.static('./public'));

// Add a route to listen for a post (form request)
app.post('/contact', (request, response) => {
  console.log(request.body.firstname);
});

// Add a catch-all to listen for routes that don't exist.
app.use('*', (request, response) => console.log('There was a problem with your request'));

// Tell the server to start listening
app.listen(PORT, () => console.log(`Listning on ${PORT}`));
