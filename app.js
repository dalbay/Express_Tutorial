// use File System
const fs = require('fs');

// use Express
const express = require('express');

// create a standard variable called app and assign express to it; this will add methods to a the variable
const app = express();

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
// We don't have to read data in the route handler, Read data in top-level code; it will be executed only once right after the application startup.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// define a route:
app.get('/api/v1/tours', (request, response) => {
  // the callback function is usually called 'The Route Handler';
  // only callback functions will run inside the Event Loop. In here we cannot have any blocking code!
  // read the data before we can send it to the client(in top-level code).
  // send it to the client:
  response.status(200).json({
    // we want to send back JSend standard format:
    status: 'success',
    data: {
      tours
    }
  });
});

const port = 3000;
// use the listen method to create a server; pass in a port and a callback function that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// // when someone hits that URL with a get request, what we want to happen is specified in a callback function as the second argument,
// // and with the callback function we pass along a request and response argument.
// app.get('/', (request, response) => {
//   response
//     .status(200)
//     .json({ message: 'Hellow from the server side!', app: 'Natours' });
// });
