// use File System
const fs = require('fs');
// use Express
const express = require('express');
// use Morgan
const morgan = require('morgan');

// create a standard variable called app
const app = express();

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//--------------------------------------------------------------
// 1) MIDDLEWARES:

// Create a Middleware
app.use(express.json());

// Create a Middleware:
app.use(morgan('dev')); // passed in argument - how we want the loggin to look like. This 3rd middleware also calls a function with the next() method to move on.

// Create a Middleware
app.use((request, response, next) => {
  console.log('Hello from the middleware');
  // next function moves to the next middleware.
  next();
});

// Create a Middleware (manipulate the request function)
app.use((request, response, next) => {
  // Define a Property on the Request Object that we want to send back
  request.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLERS:

// get ALL Tours functions:
const getAllTours = (request, response) => {
  console.log(request.requestTime); // use the property here
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime, // send the property defined in middleware
    results: tours.length,
    data: {
      tours
    }
  });
};

// get a Tour function:
const getTour = (request, response) => {
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

// get all users:
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// get one user:
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// get all users:
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// get all users:
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// get all users:
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// 3) ROUTES

// create new router for the tours
const tourRouter = express.Router();

// use that router:
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// use the router as a middleware (Mounting a Router):
app.use('/api/v1/tours', tourRouter);

// create a new router for the users
const userRouter = express.Router();

// use that router:
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// use the router as a middleware:
app.use('api/v1/users', userRouter);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
