const members = require('../routes/members');
const notFound = require('../routes/notFound');
const helmet = require('helmet');
const error = require('../middleware/error');
const bodyParser = require('body-parser');

module.exports = app => {
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );


  // app.get('/users', db.getUsers)
  // app.get('/users/:id', db.getUserById)
  // app.post('/users', db.createUser)
  // app.put('/users/:id', db.updateUser)
  // app.delete('/users/:id', db.deleteUser)











  app.use("/api/members", members);
  app.use("/", notFound);
  app.use(error);
}

console.log("routes.js loaded...");