const fs = require('fs').promises;

const appRouter = (app) => {
  // app.get('/', (req, res) => {
  //   res.send('welcome to the development api-server');
  // });
  
  app.get('/', async (req, res) => {
    let members = await fs.readFile("./data/live.json");
    members = JSON.parse(members);
    res.send(members);
  });
};

module.exports = appRouter;