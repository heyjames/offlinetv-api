const fs = require('fs').promises;
const filePath = "./data/live.json";

// Load members JSON from file system.
async function loadMembers() {
  try {
    console.log("Loading members...");
    const file = await fs.readFile(filePath);
    const { data: members } = JSON.parse(file);
    return members;
  } catch (error) {
    console.error("Failed to load members JSON file from disk.");
    process.exit(1);
  }
}

// Write members as JSON to file system.
async function saveMembers(members) {
  try {
    console.log("Saving members...");
    // TODO: Handle the errors array properly.
    const liveObject= { errors: [], data: members };
    const LiveJSON = JSON.stringify(liveObject, null, 2);
    await fs.writeFile(filePath, LiveJSON);
  } catch (error) {
    console.error("Failed to save members JSON file to disk.");
    process.exit(1);
  }
}

module.exports = {
  loadMembers,
  saveMembers
};