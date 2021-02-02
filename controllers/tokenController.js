const { setNewOAuthToken } = require('../services/twitchService');
const { isTwitchOAuthTokenValid, getNewOAuthToken } = require('./twitchOAuthController');
const config = require("config");

// Check if OAuth token is valid. If invalid, refresh token.
async function checkOAuthToken(platform) {
  if (platform === "Twitch") {
    console.log(`Current ${platform} OAuth Token:`, config.get("oauth_token"));

    const valid = await isTwitchOAuthTokenValid();
    if (valid === false) {
      const newOAuthToken = await getNewOAuthToken(); // calls refresh api in services
      setNewOAuthToken(newOAuthToken); // calls a function in the services module
    }
  }

  if (platform === "YouTube") {
    console.log(`Support for ${platform} is currently in development.`);
  }

  if (platform === "Facebook Gaming") {
    console.log(`Support for ${platform} is currently in development.`);
  }
}






const platforms = ["Twitch", "YouTube", "Facebook Gaming"];
await checkOAuthToken(platforms[0]);