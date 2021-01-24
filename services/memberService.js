const fs = require('fs').promises;
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

module.exports = {
  loadMembers,
  saveMembers
};