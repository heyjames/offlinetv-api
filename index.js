const express = require('express');
const app = express();
const fs = require('fs').promises;
const { pause } = require("./utils");
const {
  getStreamer,
  getStream,
  refreshToken,
  setNewOAuthToken
} = require("./services/twitchService");
const { mergeTwitch } = require("./controllers/twitchController");

require('./routes/routes.js')(app);

// Get a new OAuth token.
async function getNewOAuthToken() {
  try {
    const { data } = await refreshToken();
    if (data.success === false) throw new Error(data.message);
    return data.token;
  } catch (error) {
    console.error(error.message);
  }
}

// Test if Twitch OAuth token is valid.
async function isTwitchOAuthTokenValid() {
  let valid = false;

  try {
    const response = await getStreamer("207813352");
    if (response.status === 200) {
      console.log("OAuth token is good.");
      valid = true;
    }
  } catch (error) {
    valid = false;

    if (error.response.status === 401) {
      // console.error(error.response.data.message); // Invalid OAuth token
      console.log("OAuth token is invalid.");
    } else {
      console.error("Unknown Twitch API error.");
    }
  }

  return valid;
}

// Check if OAuth token is valid. If invalid, refresh token.
async function checkOAuthToken() {
  console.log("Current OAuth Token:", process.env.OAUTH_TOKEN);
  const valid = await isTwitchOAuthTokenValid();
  if (valid === false) {
    const newOAuthToken = await getNewOAuthToken(); // calls refresh api in services
    setNewOAuthToken(newOAuthToken);
  }
}

async function mainLoop(members) {
  let i = 0;
  let limit = 120; // pause(90) * 120 = 10800 seconds === 3 hours

  while (true) {
    console.log("i: ", i);
    console.log("Current OAuth Token:", process.env.OAUTH_TOKEN);

    // if (i === limit) {
    //   console.log("Checking if token is valid after 3 hours...");
    //   await checkOAuthToken();
    //   i = 0;
    // }

    members = await mergeTwitch(members);
  
    // Write JSON file to file system.
    let stringifiedMembers = JSON.stringify(members, null, 2);
    await fs.writeFile("./data/live.json", stringifiedMembers);

    await pause(90);
    i++;
  }
}

async function main() {
  /*
    startup();
      |___make sure env vars are set
        |___tokenController(startupCheck=true);
          |___check if Twitch, Youtube, Facebook Gaming OAuth token is valid
            |___write to file system the last date time checked
            |___get new OAuth token if it isn't

      |___read from the live.JSON file
    mainLoop();
      |___tokenController(startupCheck=false);
        |___check if Twitch, Youtube, Facebook Gaming OAuth token is valid
          |___read from file system when the last time was checked
          |___proceed with OAuth token check if the last time was more than 3 hours ago
            |___get new OAuth token if it isn't

      |___platformController() - loop through members based on Twitch, Youtube, Facebook
        |___use the appropriate ____Service.js module to get channel data
        |___is the channel live? skip current loop if not live.
        |___if live, use the appropriate ____Service.js module to get user data
        |___merge channel data to the current member index's object API property

      |___write to the live.JSON file
  */ 
  if (!process.env.OAUTH_TOKEN
    || !process.env.CLIENT_ID
    || !process.env.REFRESH_TOKEN) {
      console.error("Set your environmental variables.");
      process.exit(1);
  }

  let members = await fs.readFile("./data/live.json");
  members = JSON.parse(members);

  await checkOAuthToken();
  
  mainLoop(members);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

main();