// use File System
const fs = require('fs');

// use Express
const express = require('express');

// create a standard variable called app
const app = express();

// Create a Middleware
app.use(express.json());

// Create a Middleware
app.use((request, response, next) => {
  console.log("Hello from the middleware");
  // next function moves to the next middleware.
  next();
});

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get ALL Tours functions:
const getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

// get a Tour function:
const getTour = (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1;

  if (id > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  const tour = tours.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// create a Tour function:
const createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, price: 230 }, request.body);

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
};

// update a Tour function
const updateTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

// delete a Tour function
const deleteTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(204).json({
    status: 'success',
    data: null
  });
};

// Define a Route to get ALL Tours:
//app.get('/api/v1/tours', getAllTours);

// Define a Route to GET ONE Tour
//app.get('/api/v1/tours/:id', getTour);

// Define a new Route to add a new Tour
//app.post('/api/v1/tours', createTour);

// Update a Tour
//app.patch('/api/v1/tours/:id', updateTour);

// Delete data
//app.delete('/api/v1/tours/:id', deleteTour);

// use the route() method with the URL and attach HTML methods with the same route.
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .post(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
