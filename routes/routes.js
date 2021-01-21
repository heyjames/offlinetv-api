const fs = require('fs').promises;
var cors = require('cors');

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const appRouter = (app) => {
  app.get('/', cors(corsOptions), async (req, res) => {
    let members = await fs.readFile("./data/live.json");
    members = JSON.parse(members);
    res.send(members);
  });
};

module.exports = appRouter;