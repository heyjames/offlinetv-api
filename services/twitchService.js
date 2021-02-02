const axios = require('axios');
const config = require("config");

const CLIENT_ID = config.get("client_id");
let OAUTH_TOKEN = config.get("oauth_token");
const REFRESH_TOKEN = config.get("refresh_token");

// Initialize TwitchAPI Axios object.
let TwitchAPI = refreshTwitchAPI(OAUTH_TOKEN);

function refreshTwitchAPI(oauthToken) {
  return axios.create({
    baseURL: "https://api.twitch.tv/helix/",
    headers: {
      "Client-ID": CLIENT_ID,
      "Authorization": "Bearer " + oauthToken
    }
  });
}

function refreshToken() {
  return axios.get("https://twitchtokengenerator.com/api/refresh/" + REFRESH_TOKEN);
}

async function getStreamer(id) {
  const { data } = await TwitchAPI.get(`users?id=${id}`);
  return data.data[0];
}

async function getStream(id) {
  const { data } = await TwitchAPI.get(`streams?user_id=${id}&first=1`);
  return data.data[0];
}

function setNewOAuthToken(newOAuthToken) {
  console.log("Token was refreshed.");
  TwitchAPI = refreshTwitchAPI(newOAuthToken);
}

exports.getStreamer = getStreamer;
exports.getStream = getStream;
exports.refreshToken = refreshToken;
exports.setNewOAuthToken = setNewOAuthToken;