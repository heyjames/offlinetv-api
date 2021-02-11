const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const config = require("config");
const cors = require('cors');

const filePath = "./data/live.json";

const whitelist = [
  "https://otvdashboard.com",
  "http://otvdashboard.com",
  "https://www.otvdashboard.com",
  "http://www.otvdashboard.com",
  "https://offlinetv-api.herokuapp.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

// const remoteURL = "";
// const corsOptions = {
//   origin: remoteURL,
//   optionsSuccessStatus: 200
// };

router.get('/', cors(corsOptions), async (req, res) => {
  let members = await fs.readFile(filePath);
  members = JSON.parse(members);

  res.status(200).send(members);
});

console.log("members.js loaded...");
module.exports = router;