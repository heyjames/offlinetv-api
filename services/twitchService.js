const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
let OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

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

function getStreamer(id) {
  return TwitchAPI.get(`users?id=${id}`);
}

function getStream(id) {
  return TwitchAPI.get(`streams?user_id=${id}&first=1`);
}

function setNewOAuthToken(newOAuthToken) {
  TwitchAPI = refreshTwitchAPI(newOAuthToken);
}

exports.getStreamer = getStreamer;
exports.getStream = getStream;
exports.refreshToken = refreshToken;
exports.setNewOAuthToken = setNewOAuthToken;