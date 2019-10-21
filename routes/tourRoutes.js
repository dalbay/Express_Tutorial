// import the express module
const express = require('express');

// create new router for the tours
const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  next();
});

// import tourController (route handlers)
const tourController = require('./../controllers/tourController');

// use router:
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// when we have only one thing to export we use module.export
module.exports = router;
