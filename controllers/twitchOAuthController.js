const { getStreamer, refreshToken } = require('../services/twitchService');

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

exports.isTwitchOAuthTokenValid = isTwitchOAuthTokenValid;
exports.getNewOAuthToken = getNewOAuthToken;