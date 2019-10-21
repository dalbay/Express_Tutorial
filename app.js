// use Express
const express = require('express');
// use Morgan
const morgan = require('morgan');

// import Routes:
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// create a standard variable called app
const app = express();

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

// use the router as a middleware (Mounting a Router):
app.use('/api/v1/tours', tourRouter);

// use the router as a middleware:
app.use('api/v1/users', userRouter);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
