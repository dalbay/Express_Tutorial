// use Express
const express = require('express');

// create a standard variable called app and assign express to it; this will add methods to a the variable
const app = express();

// define a route:
// when someone hits that URL with a get request, what we want to happen is specified in a callback function as the second argument,
// and with the callback function we pass along a request and response argument.
app.get('/', (request, response) => {
  response
    .status(200)
    .json({ message: 'Hellow from the server side!', app: 'Natours' });
});

const port = 3000;
// use the listen method to create a server; pass in a port and a callback function that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});