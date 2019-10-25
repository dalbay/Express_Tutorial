const app = require('./app'); // since its our own module we need to use ./ for current folder.

// START SERVER
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
