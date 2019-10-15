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
- Building API's using the RESTful Architecture
- Application Programming Interface is a piece of software that can be used by another piece of software, in order to allow applications to talk to each other.
  - Browser's DOM JavaScript API
  - With OOP, when exposing methods to the public, we're creating an API
  - fs or http API's, . . .
  - Web API
#### The REST Architecture
- is a way of building Web API's in a logical way making them easy to consume. 
**REST Principles**  
1. Separate API into logical ***resources*** -> Resource: Object or representation of something, which has data associated to it. Any information that can be *named*(not a verb) can be a resource.  
   Ex: tours, users, review,...
2. Expose structured, ***resource-based URLs*** -> make available the data using some structured URLs that the client can send some requests to.  
   Ex: https://www.natours.com/addNewTour (/addNewTour is called ENDPOINT - Entpoints will send back different data to the client)
3. Use ***HTTP methods*** (verbs) -> Endpoints should be names and not verbs. Use http methods and names for the endpoint.  
   Ex: /getTours - GET  /tours   : Read
       /addNewTour - POST  /tours  : Create  
	   /updateTour - PUT(sent the entire object) or PATCH(part of object) /tours  : Update
	   /deleteTour - DELETE  /tours  : Delete
4. Send data as ***JSON*** -> We can send JSON without formatting; we can also do some simple response formatting before sending it to the client. The standard that we are using is called JSend. We create a new object; add a status message to it; and add the data into an object called data. This formatting is called **Enveloping**- common practive to mitigate some security issues. There are also other response formatting standarts like JSOPN:API, OData JSON Protocol, ...
5. Be ***stateless*** -> All state is handled on the client. (State refers to a piece of data in the application that might change overtime; ex: loggedIn, currentPage) This means that each request must contain all the information necessary to process a certain request. The server should not have to remember previous requests.
