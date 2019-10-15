
## Setting up Express and Basic Routing
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

## APIs and RESTful API Design
- Building API's using the RESTful Architecture
- Application Programming Interface is a piece of software that can be used by another piece of software, in order to allow applications to talk to each other.
  - Browser's DOM JavaScript API
  - With OOP, when exposing methods to the public, we're creating an API
  - fs or http API's, . . .
  - Web API
### The REST Architecture
*a way of building Web API's in a logical way making them easy to consume.*  
#### REST Principles

1. Separate API into logical ***resources*** -> Resource: Object or representation of something, which has data associated to it. Any information that can be *named*(not a verb) can be a resource.  
   Example:  
   tours, users, review,...
<br/>

2. Expose structured, ***resource-based URLs*** -> make available the data using some structured URLs that the client can send some requests to.  
   Example:  
   https://www.natours.com/addNewTour (/addNewTour is called ENDPOINT - Entpoints will send back different data to the client)
<br/>

3. Use ***HTTP methods*** -> Endpoints should be names and not verbs. Use http methods and names for the endpoint.  
   Example:  
   /getTours   - ```GET```     /tours  : Read  
   /addNewTour - ```POST```    /tours  : Create  
   /updateTour - ```PUT```(sent the entire object) / ```PATCH```(part of object) /tours  : Update  
   /deleteTour - ```DELETE```  /tours  : Delete
<br/>

4. Send data as ***JSON*** -> We can send JSON without formatting; we can also do some simple response formatting before sending it to the client. The standard that we are using is called **JSend**. We create a new object; add a status message to it; and add the data into an object called data.  
   This formatting is called **Enveloping**- common practive to mitigate some security issues. There are also other response formatting standarts like JSOPN:API, OData JSON Protocol, ...
<br/>

5. Be ***stateless*** -> All state is handled on the client. (State refers to a piece of data in the application that might change overtime; ex: loggedIn, currentPage) This means that each request must contain all the information necessary to process a certain request. The server should not have to remember previous requests.
<br/>

## Handling GET Requests

- In this project we will be able to see tours, book tours, create accounts, look at reviews from other users. The graphical interface will be build later.
- Start the project by working with the data - *Create the API.*
```JavaScript
// Use File System
const fs = require('fs');

// Use Express
const express = require('express');

// Assign to Variable app
const app = express();

// Read Data - (tours) array of JSON objects; in top-level code; not in the route handler.
// Top level will be executed only once right after the application startup.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// Define a Route:
app.get('/api/v1/tours', (request, response) => { // the callback function is called 'The Route Handler';  
  // only callback functions will run inside the Event Loop. In here we cannot have any blocking code!
  // read the data before we can send it to the client(in top-level code).
  // Send Data to Client:
  response.status(200).json({
    // in JSend standard format:
    status: 'success',
    data: {
      tours
    }
  });
});

const port = 3000;
// Create a Server; pass in a port and a callback function that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```
Run the project and test the api in Postman:
![tours api image](images/expressTours.png)


