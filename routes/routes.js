const fs = require('fs').promises;
var cors = require('cors');

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
}

const router = (app) => {
  app.get('/', cors(corsOptions), async (req, res) => {
    let members = await fs.readFile("./data/live.json");
    members = JSON.parse(members);
    res.send(members);
  });
};

module.exports = router;