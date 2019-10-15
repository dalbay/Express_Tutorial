# Express_Tutorial
Tutorial on Express - a web framework for Node.js. This is my tute summary bases on udemy's nodejs-express-mongodb-bootcamp course
<br/>
### Setting up Express and Basic Routing
- ```npm init```
- ```npm i express@4```
- create app.js file - put all Express configurations inside this folder.
```JavaScript
// Use Express:
const express = require('express');

// Define app variable and assign express to it: 
// this add methods that we will use to the app variable
const app = express();

// Define a route:
// when the route is hit the callback function specifies the outcome
// pass in request and response arguments to the callback function
app.get('/', (request, response) => {
  response.status(200).send('Hello from the server side!');
});

const port = 3000;
// Use listen() method to create a server:
// pass in a port and a callback function which will be called as soon as the server starts listening.
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
- Test the API with **Postman**:
![postman output](images/expressPostman.png)
You could also run the application and test it in the browser. Note that Postman does not render HTML.  
Instead of responding text with ```send()``` method, we can also responde with JSON. We don't have to manually define the content-type with express; some result headers are automatically send back by express.
```JavaScript
app.get('/', (request, response) => {
  response
    .status(200)
    .json({ message: 'Hellow from the server side!', app: 'Natours' });
});
```  
Here we have a JSON object response in Postman.
![Json postman img](images/expressJson.png)
<br/>

### APIs and RESTful API Design

