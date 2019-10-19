// import the express module
const express = require('express');

// create new router for the tours
const route = express.Router();

// use that router:
route
  .route('/')
  .get(getAllTours)
  .post(createTour);
route
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// when we have only one thing to export we use module.export
module.exports = route;
