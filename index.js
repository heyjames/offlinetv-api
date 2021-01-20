const fs = require('fs').promises;
const axios = require('axios');
const { getStreamer, getStream, refreshToken, setNewOAuthToken } = require("./services/twitchService");

async function mergeAPI(members) {
  for (let i=0; i<2; i++) {
    if (members[i].stream.label.toLowerCase() === "twitch") {
      try {
        const memberID = members[i].stream.id;
        const memberAlias = members[i].alias;
        console.log(`${memberID}: ${memberAlias}`);

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
          members[i].api.live = true;
        }

        // Set profile picture URL.
        if (streamerData !== undefined) {
          api.logo = streamData.profile_image_url;
        }
        
        members[i].api = { ...members[i].api,  ...api };
        console.log(`Merged ${memberAlias}..........`);
      } catch (error) {
        console.error("error", error);
      }
    } else {
      console.log("Skipping non-Twitch streamers...");
    }
  }

  return members;
}

async function getNewOAuthToken() {
  // Get a new OAuth token.
  try {
    const { data } = await refreshToken();
    if (data.success === false) throw new Error(data.message);
    return data.token;
  } catch (error) {
    console.error(error.message);
  }
}

async function isTwitchOAuthTokenValid() {
  let valid = false;

  // Test if Twitch OAuth token is valid.
  try {
    const response = await getStreamer("207813352");
    if (response.status === 200) {
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


async function refreshLoop() {
  console.log("Checking if token is valid in loop function...");
  // Handle invalid OAuth token.
  const valid = await isTwitchOAuthTokenValid();
  if (valid === false) {
    const newOAuthToken = await getNewOAuthToken();
    setNewOAuthToken(newOAuthToken);
  }
}

function pause(seconds) {
  return new Promise(resolve => {
      setTimeout(() => { resolve() }, seconds * 1000);
  });
}

async function main() {
  console.log("Hi");
  await pause(2);
  console.log("Bye");
  /*
  // Load the default JSON file.
  let members = await fs.readFile("./public/members.json");
  members = JSON.parse(members);

  // Merge data from the Twitch API.
  members = await mergeAPI(members);

  // Write JSON file to file system.
  let stringifiedMembers = JSON.stringify(members, null, 2);
  await fs.writeFile("./public/live.json", stringifiedMembers);
  */
}

main();