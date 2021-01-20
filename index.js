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
const msg = require("./controllers/twitchController");

require('./routes/routes.js')(app);

async function mergeAPI(members) {
  for (let i=0; i<2; i++) {
    if (members[i].stream.label.toLowerCase() === "twitch") {
      try {
        const memberID = members[i].stream.id;
        const memberAlias = members[i].alias;
        // console.log(`${memberID}: ${memberAlias}`);

        // Get live stream if available.
        let streamData = await getStream(memberID);
        const streamResponse = streamData.status; // 200
        streamData = streamData.data.data[0];

        // Skip the rest of the loop if streamer isn't live.
        if (streamData === undefined) {
          console.log(`Skipping streamer: ${memberAlias}!!!!!!`);
          members[i].stream.live = false;
          members[i].api = {};
          continue;
        }

        // Get streamer info if available
        let streamerData = await getStreamer(memberID);
        const streamerResponse = streamerData.status; // 200
        streamerData = streamerData.data.data[0];
        
        // Initialize object to merge with members.api.
        let api = {};

        // Set live stream data.
        if (streamData !== undefined) {
          api.viewers = streamData.viewer_count;
          api.game = streamData.game_name;
          api.lastStream = streamData.started_at;
          api.title = streamData.title;
        }

        // Set profile picture URL.
        if (streamerData !== undefined) {
          api.logo = streamData.profile_image_url;
        }

        members[i].stream.live = true;
        
        members[i].api = api;
        console.log(`Merged ${memberAlias}..........`);
      } catch (error) {
        console.error("Failed to merge API data", error);
      }
    } else {
      console.log("Skipping non-Twitch streamers...");
    }
  }

  return members;
}

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

    members = await mergeAPI(members);
  
    // Write JSON file to file system.
    let stringifiedMembers = JSON.stringify(members, null, 2);
    await fs.writeFile("./data/live.json", stringifiedMembers);

    await pause(60);
    i++;
  }
}

async function main() {
  let members = await fs.readFile("./data/default.json");
  members = JSON.parse(members);

  await checkOAuthToken();
  
  mainLoop(members);
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('listening on port %s...', port);
});

main();

console.log(msg);