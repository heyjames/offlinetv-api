const members = require('../routes/members');
const notFound = require("../routes/notFound");
const helmet = require("helmet");
const error = require("../middleware/error");

module.exports = app => {
  app.use(helmet());
  app.use("/api/members", members);
  app.use("/", notFound);
  app.use(error);
}

console.log("routes.js loaded...");