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
  let limit = 180;

  while (true) {
    console.log("i: ", i);
    console.log("Current OAuth Token:", process.env.OAUTH_TOKEN);

    if (i === limit) {
      console.log("Checking if token is valid after 3 hours...");
      await checkOAuthToken();
      i = 0;
    }

    members = await mergeTwitch(members);
  
    // Write JSON file to file system.
    let stringifiedMembers = JSON.stringify(members, null, 2);
    await fs.writeFile("./data/live.json", stringifiedMembers);

    await pause(60);
    i++;
  }
}

async function main() {
  if (!process.env.OAUTH_TOKEN
    || !process.env.CLIENT_ID
    || !process.env.REFRESH_TOKEN) {
      console.error("Set your environmental variables.");
      process.exit(1);
  }

  let members = await fs.readFile("./data/default.json");
  members = JSON.parse(members);

  await checkOAuthToken();
  
  mainLoop(members);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('listening on port %s...', port);
});

// main();