const fs = require('fs').promises;
const { mergeTwitch } = require('../controllers/twitchController');
const { pause } = require('./utils');

const filePath = "./data/live.json";

// Load members JSON from file system.
async function loadMembers() {
  try {
    console.log("Loading members...");
    const members = await fs.readFile(filePath);
    return JSON.parse(members);
  } catch (error) {
    console.error("Failed to load members JSON file from disk.");
    process.exit(1);
  }
}

// Write members as JSON to file system.
async function saveMembers(members) {
  try {
    console.log("Saving members...");
    let stringifiedMembers = JSON.stringify(members, null, 2);
    await fs.writeFile(filePath, stringifiedMembers);
  } catch (error) {
    console.error("Failed to save members JSON file to disk.");
    process.exit(1);
  }
}

async function updateMembersLoop() {
  try {
    let members = await loadMembers();
    let i = 0;
    // let limit = 120;

    while (true) {
      console.log("i:", i);
      console.log("Current OAuth Token:", process.env.OAUTH_TOKEN);

      // if (i === limit) {
      //   console.log("Checking if token is valid after 3 hours...");
      //   await checkOAuthToken();
      //   i = 0;
      // }

      members = await mergeTwitch(members);
      await saveMembers(members);
      await pause(90);
      
      i++;
    }
  } catch (error) {
    console.error("Update members loop error", error);
  }
}

updateMembersLoop();