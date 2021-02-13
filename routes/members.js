const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const config = require("config");
const cors = require('cors');
const db = require('../db/queries');

const filePath = "./data/live.json";

const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = [
      "https://otvdashboard.com",
      "http://otvdashboard.com",
      "https://www.otvdashboard.com",
      "http://www.otvdashboard.com",
      "https://offlinetv-api.herokuapp.com"
    ];
    
    if (process.env.NODE_ENV === "development") {
      whitelist.push("http://localhost:3000");
    }
  
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
  try {
    let resultString = await fs.readFile(filePath);
    resultString = JSON.parse(resultString);
    
    let { data: members } = resultString;
  
    for (let i=0; i<members.length; i++) {
      let lastStreamedAtDB = await db.getLastStreamedById(members[i].id);
      if (lastStreamedAtDB === ""
        || lastStreamedAtDB === undefined
        || lastStreamedAtDB === null
        || Object.keys(lastStreamedAtDB).length === 0) {
          members[i].stream.last_stream_date = "";
        } else {
          members[i].stream.last_stream_date = lastStreamedAtDB.toString();
        }
      
      if (i === 0) {
        console.log("Begin");
        // console.log(typeof db.getLastStreamedById(members[i].id));
        // console.log(await db.getLastStreamedById(members[i].id));
      //   console.log(typeof members[i].stream.last_stream_date);
        console.log(members[i].stream.last_stream_date);
        console.log("End");
      }
    }

    resultString.data = members;
    console.log(members);
  
    res.status(200).send(resultString);
  } catch (error) {
    console.error("Failed to get members from JSON file.");
  }
});

console.log("members.js loaded...");
module.exports = router;