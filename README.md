# Express_Tutorial
Tutorial on Express - a web framework for Node.js. This is my tute summary bases on udemy's nodejs-express-mongodb-bootcamp course
<br/>
### Setting up Express and Basic Routing
- npm init
- npm i express@4
- create app.js file - put all Express configurations inside this folder.
```JavaScript
// use Express
const express = require('express');

// create a standard variable called app and assign express to it; this will add methods to a the variable
const app = express();

// define a route:
// when someone hits that URL with a get request, what we want to happen is specified in a callback function as the second argument,
// and with the callback function we pass along a request and response argument.
app.get('/', (request, response) => {
  response.status(200).send('Hello from the server side!');
});

const port = 3000;
// use the listen method to create a server; pass in a port and a callback function that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

/* Run the application
OUTPUT:
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
App running on port 3000...
*/
```
- Test the API with postman:
![postman output](images/expressPostman.png)