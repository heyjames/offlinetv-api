const fs = require('fs').promises;
const filePath = "./data/live.json";
const { redis } = require('../src/redis');
const JSONCache = require('redis-json');

const jsonCache = new JSONCache(redis, {prefix: "cache:"});

// Load members JSON from file system.
async function loadMembers() {
  try {
    console.log("Loading members from JSON file...");
    const file = await fs.readFile(filePath);
    const { data: members } = JSON.parse(file);
    return members;
  } catch (error) {
    console.error("Failed to load members JSON file from disk.");
    process.exit(1);
  }
}

async function getMembersFromRedis() {
  try {
    console.log("Serving members from Redis...");
    const redisMembers = await jsonCache.get('redisMembers')
    return redisMembers;
  } catch (error) {
    console.error("Failed to serve members from Redis.");
    process.exit(1);
  }
}

async function saveMembersToRedis(members) {
  try {
    const liveObject= { errors: [], data: members };
    await jsonCache.rewrite('redisMembers', liveObject);
  } catch (error) {
    console.error("Failed to save members to Redis.");
  }
}

// Write members as JSON to file system.
async function saveMembers(members) {
  try {
    console.log("Saving members to JSON file...");
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
  saveMembers,
  saveMembersToRedis,
  getMembersFromRedis
};