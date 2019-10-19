// import the express module
const express = require('express');

// create a new router for the users
const router = express.Router();

// use that router:
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// when we have only one thing to export we use module.export
module.exports = router;
