// import the express module
const express = require('express');

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// create new router for the tours
const router = express.Router();

// use that router:
router
  .router('/')
  .get(getAllTours)
  .post(createTour);
router
  .router('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// when we have only one thing to export we use module.export
module.exports = router;
