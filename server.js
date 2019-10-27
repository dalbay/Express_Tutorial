// require the environmetal variable module
const dotenv = require('dotenv');
// read and save the environmental variables in node.js
dotenv.config({ path: './config.env' });

const app = require('./app'); // since its our own module we need to use ./ for current folder.

// display the environment
//console.log(process.env);

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
