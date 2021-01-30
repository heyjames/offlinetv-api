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