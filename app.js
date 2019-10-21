// use Express
const express = require('express');
// use Morgan
const morgan = require('morgan');

// import Routes:
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// create a standard variable called app
const app = express();

// MIDDLEWARES:
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

// ROUTES
// Mounting route on tour router
app.use('/api/v1/tours', tourRouter);
// Mounting route on tour router
app.use('/api/v1/users', userRouter);

module.exports = app;
