const members = require('../routes/members');
const notFound = require("../routes/notFound");
const error = require("../middleware/error");

module.exports = app => {
  app.use("/api/members", members);
  app.use("/", notFound);
  app.use(error);
}

console.log("routes.js loaded...");