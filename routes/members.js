const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const cors = require('cors');

const filePath = "./data/live.json";
const remoteURL = "http://localhost:3000";

const corsOptions = {
  origin: remoteURL,
  optionsSuccessStatus: 200
}

router.get('/', cors(corsOptions), async (req, res) => {
  let members = await fs.readFile(filePath);
  members = JSON.parse(members);

  res.status(200).send(members);
});

console.log("members.js loaded...");
module.exports = router;