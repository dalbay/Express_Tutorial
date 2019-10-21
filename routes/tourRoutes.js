// import the express module
const express = require('express');

// import tourController (route handlers)
const tourController = require('./../controllers/tourController');

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// create new router for the tours
const router = express.Router();

// use that router:
router
  .router('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .router('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// when we have only one thing to export we use module.export
module.exports = router;
