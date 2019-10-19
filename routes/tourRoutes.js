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
