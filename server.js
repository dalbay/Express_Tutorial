const app = require('./app'); // since its our own module we need to use ./ for current folder.

// display the environment
console.log(process.env);

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
