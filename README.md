
## Setting up Express and Basic Routing
- ```npm init```
- ```npm install express```
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

- Start the project by working with the data -> *Create the API.*
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
    // we want to send back JSend standard format:
    status: 'success',
    results: tours.length, // only add when we sending multiple objects(array)
    data: {
      tours
    }
  });
});

const port = 3000;
// Create a Server; callback function will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```
Run the project and test the api in Postman:
![tours api image](images/expressTours.png)
<br/>

## Handling POST Requests

- Create a new Route
- To send data from the client to the server on the request, add a **middleware** to the top-level - ```app.use(express.json());```.  
- *Middleware:* can manipulate the request or response object, or execute any other code. It is mostly used for request. 
```JavaScript
// Top-level Code:

// Create a Middleware (function that can modify incoming request data)
app.use(express.json());

// Define a new Route to add a new Tour with the HTTP POST Request
app.post('/api/v1/tours', (request, response) => {
  console.log(request.body);
  response.send('Done'); // always need to send response to finish the cycle.
});
```
- For testing purposes, specify the Body in Postman - (raw JSON the data that we want to send to the server.) and Send data:
![Postman post request](images/expressPost.png)  
Console Output:  
```
[nodemon] starting `node app.js`
App running on port 3000...
{ name: 'Test api', duration: 10, difficulty: 'easy' }
```
#### Example:
Create a new tour and add it to the json file  
```JavaScript
// Define a new Route to add a new Tour with the HTTP POST Request
app.post('/api/v1/tours', (request, response) => {
  // the id of an object is handled by the db - takes id of last object and adds 1
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId, price: 230 }, request.body);

  // push the new tour to the tours array
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      response.status(201).json({   // 201 Created Status
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
});
```  
Add additional data in Postman for testing purpose:
![Post create tour object](images/expressNewTour.png)  
<br/>

## Responding to URL Parameters
- Define Parameters in the URL
- Read these Parameters and respond to them
#### Example:  
- implement retreiving only one tour.
- the end piece of the URL is where we want a variable that acts as a unique identifier.
- we want to read this variable from the URL - define a route which can accept a variable.
- create the variable with a colon in the URL with any name  ```app.get('/api/v1/tours/:id', (request, response) => {```  
- we can access the variable with the assigned value to it with the params property; params are all the variables in the URL - ```request.params```.
- Note that we can create as many variables as we want in the URL with a **/:variable_name**, and define the values by adding them to the enpoint. 
  <br/>
  We could also make the parameters *optional* by adding a **?** to the end of the variable name, like **/:variable_name?**. This way if we no longer have to specify it at the endpoint.  
```JavaScript
// Define a Route to GET ONE Tour by defining a variable:
app.get('/api/v1/tours/:id', (request, response) => {
  console.log(request.params); 
  response.status(200).json({
    status: 'success'
  });
});
```  
Run the server and make a GET request in Postman with a value of 5 ```127.0.0.1:3000/api/v1/tours/5```, and see the OUTPUT in console for the params:
```
[nodemon] starting `node app.js`
App running on port 3000...
{ id: '5' }  --> here is the variable with the assigned value
```
- Next, get the tour from the JSON file with that id.  
  Convert the input at the endpoint to a number.  
  Use the ```find()``` array function and pass in a callback function.  
  Make sure the value passed in is a valid id, if not send back a 404  
  In a real world senario user input should always be validated.  
  Respond the tour data.  
```JavaScript
// Define a Route to GET ONE Tour by defining a variable:
app.get('/api/v1/tours/:id', (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1; // converts string to number.

  if (id > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    }); // exit the function
  }
  // we could also try to get the tour first,
  // and then test and see if we got a tour:
  // if(!tour){
  
  const tour = tours.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});
```  
Run the server and make a GET request in Postman with a value of 5 ```127.0.0.1:3000/api/v1/tours/5```; This will respond with the tour of id 5.
![Params image](images/expressParams.png)  
<br/>

## Handling PATCH Requests
- to update data
- first expect a patch request to come in and create the URL for it
- to update tour - get tour from json file,update it, and save it.
- For this example we are only sending back a simple response.
```JavaScript
// Update data with patch - properties on the object
app.patch('/api/v1/tours/:id', (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
});
```
Run the server and make a PATCH request in Postman with a value of 5 and change the value of a property in the Body section ```127.0.0.1:3000/api/v1/tours/5```; The output will only display a message with the updated tour here.

<br/>

## Handling DELETE Requests
- in this example we are not implementing the deleting from the source but only displaying a message, because we are only dealing with a file.  
- the response for a DELETE request is usually 204. This means *No Content*. We don't send data back, instead we send null.
```JavaScript
// Delete data
app.delete('/api/v1/tours/:id', (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(204).json({
    status: 'success',
    data: null
  });
});
```  
Run the server and make a DELETE request in Postman with a value of 5  ```127.0.0.1:3000/api/v1/tours/5```; The output in postman is no content at all.  
<br/>


## Refactoring Routes
- refactor the code so that the routes are together and the handler functions are also together.
- export the handler functions into their own functions. 
```JavaScript
// CRUD Functions All Together:

// GET ALL Tours functions:
const getAllTours = (request, response) => {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

// GET A Tour function:
const getTour = (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1;

  if (id > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  const tour = tours.find(element => element.id === id);
  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// CREATE a Tour function:
const createTour = (request, response) => {
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

// UPDATE a Tour function
const updateTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

// DELETE a Tour function
const deleteTour = (request, response) => {
  if (request.params.id * 1 > tours.length) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  response.status(204).json({
    status: 'success',
    data: null
  });
};

// ROUTES - use route() method with the URL and attach HTML methods with the same route.

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .post(deleteTour);
```  
<br/>

## Middleware and the Request-Response Cycle
*Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.*
- **Middleware** functions are functions that have access to the **request object**(req), the **response object**(res), and the next middleware function in the application's request-response cycle. 
- Middleware functions can 
  - manipulate the request or response object, 
  - execute any other code, 
  - end the request-response cycle, or 
  - call the next middleware function in the stack. 
- It is called middleware because it is a function that is executed in the middle of receiving the request and sending the response. 
- We can say "in Express, everything is middleware" (even routers)".  
- It is mostly used for request - to send data from the client to the server on the request, add a **middleware** to the top-level - ```app.use(express.json());```.   
Other example for middleware are parsing body, logs, setting headers, router,... 
- All the middleware functions that we use together in the app is called the **Middleware Stack**.
- The order of the middleware functions is defined in the code, which is important in express.  
Think of the whole process as going through a pipeline, where the request and response objects are created at the beginning, and will go through each middleware where they will be processed. 
- At the end of each middleware function, a ```next()``` function is called. 
- The last middleware function is usually a route handler that uses the ```send()``` function to send the request back to the client. The whole process is called the **Request-Response Cycle**.  
  ![express request-repsonse cycle](images/expressMiddleware.png)  
<br/>

*An Express application can use the following types of middleware:*
1. *Application-level middleware:*  
  Bind application-level middleware to an instance of the app object by using the ```app.use()``` and ```app.METHOD()``` functions, where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT, or POST) in lowercase.  

This example shows a middleware function with no mount path. The function is executed every time the app receives a request.
```JavaScript
var app = express()

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```  
This example shows a middleware function mounted on the /user/:id path. The function is executed for any type of HTTP request on the /user/:id path.
```JavaScript
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
```  
This example shows a route and its handler function (middleware system). The function handles GET requests to the /user/:id path.
```JavaScript
app.get('/user/:id', function (req, res, next) {
  res.send('USER')
})
```   
To skip the rest of the middleware functions from a router middleware stack, call ```next('route')``` to pass control to the next route.  
NOTE: next('route') will work only in middleware functions that were loaded by using the app.METHOD() or router.METHOD() functions.  
This example shows a middleware sub-stack that handles GET requests to the /user/:id path.  
```JavaScript
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function (req, res, next) {
  res.send('special')
})
```  
2. *Router-level Middleware:*  
  Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of ```express.Router()```.  
Load router-level middleware by using the ```router.use()``` and ```router.METHOD()``` functions.  

The following example code replicates the middleware system that is shown above for application-level middleware, by using router-level middleware:
```JavaScript
var app = express()
var router = express.Router()

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

// a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
router.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

// a middleware sub-stack that handles GET requests to the /user/:id path
router.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next router
  if (req.params.id === '0') next('route')
  // otherwise pass control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.render('regular')
})

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id)
  res.render('special')
})

// mount the router on the app
app.use('/', router)
```  
3. *Error-handling Middleware:*  
  Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three, specifically with the signature (err, req, res, next)):
```JavaScript
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```
4. *Built-in middleware:*  
  Express has the following built-in middleware functions:

  * express.static serves static assets such as HTML files, images, and so on.
  * express.json parses incoming requests with JSON payloads. NOTE: Available with Express 4.16.0+
  * express.urlencoded parses incoming requests with URL-encoded payloads. NOTE: Available with Express 4.16.0+
5. *Third-party middleware:*  
  Use third-party middleware to add functionality to Express apps. (more details in later section)  
  The following example illustrates installing and loading the cookie-parsing middleware function cookie-parser.
```JavaScript
 // -- $ npm install cookie-parser
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')

// load the cookie-parsing middleware
app.use(cookieParser())
```
<br/>

## Creating Our Own Middleware
- To create our own middleware use ```app.use``` and pass in a callback function that we want to add to our middleware stack.
- in each middleware function, we have access to the request and response and also the next() function that we can add as an argument to the callback function -```request, response, next```.
- Route functions are also middleware that get only executed for certain URL's
- The middleware that we define are going to be applied for every single request. Don't add middleware after the route handlers - they send a result and therefore end the request-response cycle.

```JavaScript
// Create a Middleware
app.use(express.json());

// Create a Middleware
app.use((request, response, next) => {
  console.log("Hello from the middleware");
  // next function moves to the next middleware.
  next();
});

// Create a Middleware (manipulate the request function)
app.use((request, response, next) => {
  // Define a Property on the Request Object, (sending back the date/time)
  request.requestTime = new Date().toISOString();
  next();
 });
 
 // use the properties in the the route handlers:
 // get ALL Tours functions:
const getAllTours = (request, response) => {
  console.log(request.requestTime); // use the Property Defined in Middleware
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime, // send back the Property Defined in Middleware
    results: tours.length,
    data: {
      tours
    }
  });
};

```  
Run the server and get request in postman; OUTPUT:
![middleware get property](images/expressMiddleware1.png)  

## Using 3rd-Party Middleware
Popular login middleware **Morgan** - helps us see requests data in the console.
<br/>
  
***To make use of a Middleware:***   
1. *Add to package.json* - ```npm i morgan``` - (Morgan is not a dev-dependency but a regular dependency.) 
2. *Require in code* - ```const morgan = require('morgan');```
3. *Use middleware* - ```app.use(morgan('dev'));``` the dev argument describes how we want the log to look like;(options displayed in IntelliSense).  
   When you look at the documentation for *morgan middleware*, you will see that the ```morgan()``` funtions will return another function with the same typical signature like our own middleware functions ```return function logger(req, res, next){```; and it also calls the ```next()``` function at the end, just like our middleware functions.

Run the application, and make a request in postman.  
The data about the request will be displayed in the console:  
``` GET /api/v1/tours/ 200 4.592 ms - 8703 ```  
<br/>

***List of recommended Middleware in express:***  
 
The Express middleware modules listed here are maintained by the Expressjs team:  

| Middleware module  | Description	 | Replaces built-in function (Express 3) |
| ----------------- | ------------- | --------------------------------- |
| body-parser      | 	Parse HTTP request body. | express.bodyParser |
| compression |	Compress HTTP responses.	| express.compress |
| connect-rid	| Generate unique request ID.|	NA|
| cookie-parser |	Parse cookie header and populate req.cookies. |  express.cookieParser |
| cookie-session |	Establish cookie-based sessions.	| express.cookieSession |
| cors	| Enable cross-origin resource sharing (CORS) with various options.|	NA |
| csurf	| Protect from CSRF exploits.	| express.csrf |
| errorhandler |	Development error-handling/debugging.|	express.errorHandler |
| method-override |	Override HTTP methods using header.	| express.methodOverride |
| morgan | HTTP request logger. |	express.logger |
| multer	| Handle multi-part form data.	| express.bodyParser |
| response-time	| Record HTTP response time.	| express.responseTime |
| serve-favicon	| Serve a favicon.	| express.favicon |
| serve-index	| Serve directory listing for a given path. |	express.directory |
| serve-static	| Serve static files.	| express.static |
| session	| Establish server-based sessions (development only). |	express.session |
| timeout |	Set a timeout period for HTTP request processing. | express.timeout |
| vhost	| Create virtual domains.	| express.vhost |

<br/>
These are some additional popular middleware modules:  

| Middleware module	        | Description          |
| ------------- |--------------| 
|   cls-rtracer    | 	Middleware for CLS-based request id generation. An out-of-the-box solution for adding request ids into your logs.		| 
|  connect-image-optimus     | 		Optimize image serving. Switches images to .webp or .jxr, if possible.	| 
|   express-debug    | 		Development tool that adds information about template variables (locals), current session, and so on.	| 
|   express-partial-response    | 	Filters out parts of JSON responses based on the fields query-string; by using Google API’s Partial Response.		| 
|   express-simple-cdn    | 	Use a CDN for static assets, with multiple host support.		| 
|    express-slash   | 	Handles routes with and without trailing slashes.		| 
|   express-stormpath    | 	User storage, authentication, authorization, SSO, and data security.		| 
|  express-uncapitalize     | 	Redirects HTTP requests containing uppercase to a canonical lowercase form.		| 
|   helmet    | 	Helps secure your apps by setting various HTTP headers.			| 
|   join-io    | 		Joins files on the fly to reduce the requests count.		| 
|   passport    | 	Authentication using “strategies” such as OAuth, OpenID and many others. See http://passportjs.org/ for more information.			| 
|    static-expiry   | 		Fingerprint URLs or caching headers for static assets.	| 
| view-helpers      | 	Common helper methods for views.  |
|   sriracha-admin	    | 	Dynamically generate an admin site for Mongoose.

<br/>

## Implementing Routes - for the "Users"
In this application, we will implement routes for user rescourse; user accounts, user roles... To do so,
- add the routes,
- add the responses for the get/post/... requests,
- and the functions for these request methods.

```JavaScript
// add the routes
app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// next, create the functions for the http request calls(implement later)

// get all users:
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
// // get one user:
. . . 
```  
<br/>
Run the server and make a request in postman.  

## Creating and Mounting Multiple Routers
- create multiple routers and use a process called **Mounting**  
- our goal is to *separate code into multiple files* - a separate file for the user routes; one for the tour routes; and different files for the handlers as well.  
- the four different routes that we have are kind of on the same router - the router is the app object. If we want to seperate these routes into two different files, we need to create a router, save it to a variable; and use it with that variable name instead of app.
- Create a sub-application; this is how we connect the routers with the application(by using it as a middleware) - ```app.use('/api/v1/tours', tourRouter);``` This process is called **Mounting Router** - mounting a router onto a route.
```JavaScript
// create new router for the tours
const tourRouter = express.Router();

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

// use the router as a middleware (Mounting a Router):
app.use('/api/v1/tours', tourRouter);



// create a new router for the users
const userRouter = express.Router();

// use that router:
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// use the router as a middleware:
app.use('api/v1/users', userRouter);
```  

<br/>

## Refactor the Application - A Better File Structure

- To have a separation of concern create different resources for each router; and then put them together in one main app file.  
  The main app.js file is usually used for *middleware declaration*. The middleware declared on the top are used for all routes.
- Create a new folder - "routes" with two files - "tourRoutes.js" and "userRoutes.js"
- copy and paste the routes into these files 
- next, export the routes from the files  

*tourRoutes.js* file:  
```JavaScript
// import the express module
const express = require('express');

// create new router for the tours
const router = express.Router();

// use that router:
router
  .route('/')
  .get(getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// when we have only one thing to export we use module.export
module.exports = router;
```  
*userRoutes.js* file:
```JavaScript
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

// export the router - when we have only one thing to export we use module.export
module.exports = router;
```
- import the routers from tourRoutes.js and userRoutes.js into the app.js file 
```JavaScript
// import Routes:
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
```  
- Mount these routers onto the two different routes with *app.use*  
```JavaScript
// Mounting tourRouter on a Router
app.use('/api/v1/tours', tourRouter);

// Mounting userRouter on a Router
app.use('api/v1/users', userRouter);
```  

- Next, remove the *Route Handlers* (CRUD functions) to a separate file -> *controllers*; and add them to the tourController.js and the userController.js files.  
  Export the functions from these files. Since we have more than one function to export, put all of the functions on the *exports object*,  instead of using module.exports.
```JavaScript
// Exporting Functions:

// get ALL Tours
exports.getAllTours = (request, response) => {
	...
// get a Tour
exports.getTour = (request, response) => {
	...
// create a Tour
exports.createTour = (request, response) => {
	...
// update a Tour
exports.updateTour = (request, response) => {
	...
// delete a Tour
exports.deleteTour = (request, response) => {
	...
	
// the same for the user functions inside the userController.js...
```  
- import the handlers in tourRoutes.js and userRoutes.js; and use CRUD methods  in the router
```JavaScript
// tourRouter.js:

// Import tourController (route handlers) in tourRouter.js
const tourController = require('./../controllers/tourController');

// use in router:
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);


// userRouter.js:

// Import userController (route handler) in userRouter.js
const userController = require('./../controllers/userController');

// use in router:
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
```  
Recap:  
 - We receive the request in the app.js file.
 - depending on that route it will be send to either one of the routers(tourRouter, userRouter).
 - depending on that route and the method, it will execute one of the controllers.
 - and from that controller is where the response gets send and finishes the request-response cycle.

- Lastly, create a server.js file, to have everything that is related to express on one file and everything that is related to the server (like db configurations, error handling, environment variables)on another.  
  - server.js is going to be the starting file.  
  - copy and past the server code from app.js to server.js
  - export app(express) from app.js to server.js - ```module.exports = app;```
  - import app in server.js - ```const app = require('./app'); // since its our own module we need to use ./ for current folder.``` 
  - change the npm script to ```"start": "nodemon server.js"```  

## Param Middleware  
- middleware that only runs for certain parameters in the URL.
- when you specify the middleware in a router (here for example in tourRouter.js) then it will only work for the tours. This shows that each router acts as a mini application withing an application.
- To utilize the param middleware, apply the Router objects ```param()``` method. The first argument will be the parameter from the URL that is targeted, and the second argument is the actual middleware functions with req, res, next, and the val arguments.
- the val argument is the parameter from the URL that is being passed 
```JavaScript
	// create new router for the tours
	const router = express.Router();

	router.param('id', (req, res, next, val) => {
	  console.log(`Tour id is: ${val}`);
	  next();
	});
``` 
Run the server and send a request - 127.0.0.1:3000/api/v1/tours/3  
Here is the OUTPUT for the request in the console ```Tour id is: 3```.  
<br/>
To recap, if we have an incomming request for /tours/id, that request will go through all of the middlewares (```app.use((req, res, next) => {});```) inside the app.js file and eventually hit the last routes middleware with the right path - (```app.use('/api/v1/tours', tourRouter);```).  
This will send the application flow to the tourRouter middleware where the ```router.param('id', (req, res, next, val) => {)``` middleware functions will run its code.  

***A practical usecase to run such a middleware:***  
We can make use of the param middleware and perform a validation to check if id exists before the execution hits the handler functions.  
Cut the code out of the handler functions inside the tourController that checks the id -(getTour, updateTour, deleteTour). Paste this code to another middleware above the handler functions and export it. This will run before the request hits the handler functions.
```JavaScript
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
```  
Inside the tourRoutes.js file, update the router param function with this new controller function:  
```JavaScript
router.param('id', tourController.checkId);
```  
Run the server and make a get request with an invalid id - 127.0.0.1:3000/api/v1/tours/ 255  
The response will be:  
![middleware params img](images/expressParams1.png)  
***The flow of this execution is as follows:***  
- code hits app.js file
- the router middleware function at the end of the file will run; note that the tour path is mounted to this middleware function:
```JavaScript
// import Routes:
const tourRouter = require('./routes/tourRoutes');

...

// ROUTES
// Mounting route on tour router
app.use('/api/v1/tours', tourRouter);
// Mounting route on tour router
app.use('/api/v1/users', userRouter);

module.exports = app;
```
- execution hits tourRoutes.js file
- here the router.param middleware functions will run before the router code is hits; note that this will send execution to the tourController and run the checkid middleware function.
```JavaScript
// import the express module
const express = require('express');

// create new router for the tours
const router = express.Router();

// import tourController (route handlers)
const tourController = require('./../controllers/tourController');

router.param('id', tourController.checkId);

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
```  
- execution hits tourController.js file
- the checkid middleware function will be executed; if invalid request is made a 404 will be returned and the request-response cycle will come to and end, otherwise the next middleware functions will be executed and since this functions is exported, code flow will come back to tourRoutes.js  
```JavaScript
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
```  
- execution hits tourRoutes.js file
- the matching router will be executed; in this case the ```.get(tourController.getTour)``` which will send execution to the tourController getTour function.
- execution hits tourController.js file and executes the getTour middleware function; this is where a response is send back and the request-response cycle stops.
```JavaScript
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
```  
- execution hits the app.js file and back to the server.js.
```JavaScript
const app = require('./app'); // since its our own module we need to use ./ for current folder.

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```  
<br/>

## Chaining Multiple Middleware Functions

- for example for the post request we passed in only one middleware function which is the createTour handler. This is the only function that is going to be called when we get a post request.  
  let's say we want to run multiple middleware functions; for example, to check the data that is comming from the body(check if request.body actually has the data).
- Check if checkBody middleware - if body contains the name and the price property  
Add the middleware function to tourController.js:
```JavaScript
// Create a checkBody middleware - check if bod contains name and price properties, if not send back 400 (bad request).
// Add it to the post handler stack
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};
```
Call the middleware function in tourRoutes.js
```JavaScript
// use router:
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
```  
Run the server and make a post request with the name and price properties in the body. The execution will hit the ```.route('/')```router and direct to the .post method which will execute the tourController.checkBody middleware function. Since the properties are present, the middleware functions will call the ```next()``` middleware functions which is tourConroller.createTour. This will then finish the request-response cycle. The response is a 201 Created:  
![middleware resonse 201](images/expressParams2.png)  
<br/>

## Serving Static Files
- Files that reside in our system that we can't access using our routes. 
- We need to use a build in middleware ```app.use(express.static(''))``` and pass in the directory from which we want to serve static files. Add the middleware to the app.js file:
```JavaScript
// Create a Middleware to access static files
app.use(express.static(`${__dirname}/public`));
```  
- we can now access this file from the browser, but without adding the "/public/" to the URL. That's because if the URL is not found it will automatically look up the public folder and sets this folder to the root - http://127.0.0.1:8000/overview.html. Now we can access every static file that's inside the public folder from the browser.
<br/>

## Environmental Variables
- node.js or express can run in different environments.
- depending on the environment we might use different settings like db's, login on/off,...
- the most important environments are the production and development environments.
- the type of settings are based on environment variables.
- by default, express sets the environment to development.
- let's take a look at the variable in the server - (everything that is not related to the app.js file(express configurations ) will be handled on the server.js file.  
Display the current environment - ```app.get('env')```:  
```JavaScript
const app = require('./app'); // since its our own module we need to use ./ for current folder.

// display the environment
console.log(app.get('env'));

// START SERVER
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

/*
OUTPUT:
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
development
App running on port 8000...
*/
```  
- node.js and express both set some global/environment variables.  
- To list the variables that node.js sets - ```Console.log(process.env);```.
- these variables come from the process core module.
- in express many processes depend on the **NODE_ENV** variable - a convention which defines which mode we are in - production/development.
- express does not define this variable and we need to define that manually;
- ***Define an environmental variable:*** the easies way is to use the terminal  
  prepend the NODE_ENV variable to the command that starts the process(we used the npm start which stands for nodemon server.js.)  **```NODE_ENV=development nodemon server.js```**  
- Many packages on npm that we use for express development depend on this environment variable. When a project is ready and we are going to deploy it, we should change the NODE_ENV variable to production. 
- Everytime our app uses some kind of configuration we change the environmental variabels.  
#### Create a configuration file for the environmental variables:
- create a file **config.env** and create some variables:
```JavaScript
	NODE_ENV=development
	PORT=8000
	USER=tom
	PASSWORD=123456
```
- to make the configuration file look nice use the **DotENV extensions**
- install the **doten** npm package to make use of these variables - ```npm i dotenv```
- require that module in the server.js on the top before we require app. -**```const dotenv = require('dotenv');```**
- next, use the module to read the file and save the environmental variables in node.js - **```dotenv.config({ path: './config.env' });```**
- make use the environmental variable in the console - **```console.log(process.env);```**
- make use the environmental variable in the app.js file -
```JavaScript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // passed in argument - how we want the loggin to look like. 
}
```  
- make use the environmental variable in the server.js file -
```JavaScript
// START SERVER
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
	  console.log(`App running on port ${port}...`);
	});
```
- add another start script to the package.json file for production and change the NODE_ENV variable to production, also rename the start script to start:dev
```JavaScript
    "start:dev": "nodemon server.js",
    "start:prod": "SET NODE_ENV=production & nodemon server.js"
```
Run the server - ```> npm run start:prod```. You will see that the NODE_ENV variable will be set to production.  
*This is how we run different code depending on whether we are in development or in production.*

<br/>

## Setting up ESLint + Prettier in VS Code
- install extensions
- install ESLint and prettier as npm packages.

- install dev-dependency:
- to show formatting errors as we type in prettier - eslint-plugin-prettier
- to disable eslint for formatting, we want prettier for formatting - eslint-config-prettier
- for future project all you need to do is to got to your package.json file and copy that configuration and install it in your next project; all of this packages have to be installed locally. 
- we also need to install a style guide - eslint-config-airbnb
- to add a couple specific eslint rules only for node.js(to find errors when writing node.js code) - eslint-plugin-node
- to make the airbnb work - eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
- ```> npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev```  
Here are all the packages in package.json:
```JavaScript
  "devDependencies": {
    "eslint": "^6.6.0",
    "eslint-config-airbnb": "^18.0.1",
    "eslint-config-prettier": "^6.5.0",
    "eslint-plugin-import": "^2.18.2",
    "eslint-plugin-jsx-a11y": "^6.2.3",
    "eslint-plugin-node": "^10.0.0",
    "eslint-plugin-prettier": "^3.1.1",
    "eslint-plugin-react": "^7.16.0",
    "nodemon": "^1.19.3",
    "prettier": "^1.18.2"
  }
```  
- next we need config files for prettier and eslint. 
  - .prettierrc
  ```JSON
  {
     "singleQuote": true
  }
  ```
  -  .eslintrc.json - eslint set rules that we can manipulate. You can lookup ESLint webside for configurations; here is the configuration we're going to use:
  ```JSON
  {
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
    }
  }
  ```