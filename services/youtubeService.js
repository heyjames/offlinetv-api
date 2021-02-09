const axios = require('axios');
const config = require("config");

// Costly quota: 100. You are allowed 10,000/day ~ 4 requests per hour.
function getYouTubeStream(id) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&type=video&eventType=live&key=${config.get("youtube_api_key")}`;
  return axios.get(url);
}

function getYouTubeChannel(id) {
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${config.get("youtube_api_key")}`;
  return axios.get(url);
}

function getYouTubeLiveVideoStats(id) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${id}&fields=items%2FliveStreamingDetails&key=${config.get("youtube_api_key")}`;
  return axios.get(url);
}

function getYouTubeLiveVideoTitle(id) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${config.get("youtube_api_key")}`;
  return axios.get(url);
}

function getYouTubeChannelHTML(url) {
  return axios.get(url);
}

// TODO: Refactor - Not DRY
function getYouTubeLiveVideoGame(url) {
  return axios.get(url);
}

exports.getYouTubeStream = getYouTubeStream;
exports.getYouTubeChannel = getYouTubeChannel;
exports.getYouTubeLiveVideoStats = getYouTubeLiveVideoStats;
exports.getYouTubeChannelHTML = getYouTubeChannelHTML;
exports.getYouTubeLiveVideoTitle = getYouTubeLiveVideoTitle;
exports.getYouTubeLiveVideoGame = getYouTubeLiveVideoGame;