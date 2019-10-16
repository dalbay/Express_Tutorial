// use File System
const fs = require('fs');

// use Express
const express = require('express');

// create a standard variable called app
const app = express();

// Create a Middleware (function that can modify incoming request data)
app.use(express.json());

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
// We don't have to read data in the route handler, Read data in top-level code; it will be executed only once right after the application startup.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Define a Route to get ALL Tours:
app.get('/api/v1/tours', (request, response) => {
  // the callback function is usually called 'The Route Handler';
  // only callback functions will run inside the Event Loop. In here we cannot have any blocking code!
  // read the data before we can send it to the client(in top-level code).
  // send it to the client:
  response.status(200).json({
    // we want to send back JSend standard format:
    status: 'success',
    results: tours.length, // this only makes sens when we sending multiple objects(array)
    data: {
      tours
    }
  });
});

// Define a Route to GET ONE Tour by defining a variable:
app.get('/api/v1/tours/:id', (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1; // converts string to number.
  const tour = tours.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

// Define a new Route to add a new Tour with the HTTP POST Request
app.post('/api/v1/tours', (request, response) => {
  // the id of an object is handled by the db - takes id of last object and adds 1
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, price: 230 }, request.body);

  // push the new tour to the tours array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
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
