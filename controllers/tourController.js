// use File System
const fs = require('fs');

// Read Data (tours) - an array of JSON objects inside the dev-data folder.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// middleware function to check id
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

// ROUTE HANDLER for Tours

// get ALL Tours
exports.getAllTours = (request, response) => {
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

// get a Tour
exports.getTour = (request, response) => {
  const id = request.params.id * 1;

  const tour = tours.find(element => element.id === id);

  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// create a Tour
exports.createTour = (request, response) => {
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

// update a Tour
exports.updateTour = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

// delete a Tour
exports.deleteTour = (request, response) => {
  response.status(204).json({
    status: 'success',
    data: null
  });
};
