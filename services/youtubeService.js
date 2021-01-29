const axios = require('axios');

// Costly quota: 100. You are allowed 10,000/day ~ 4 requests per hour.
function getYouTubeStream(id) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${id}&type=video&eventType=live&key=${process.env.YOUTUBE_API_KEY}`;
  return axios.get(url);
}

function getYouTubeChannel(id) {
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;
  return axios.get(url);
}

function getYouTubeLiveVideoStats(id) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${id}&fields=items%2FliveStreamingDetails&key=${process.env.YOUTUBE_API_KEY}`;
  return axios.get(url);
}

function getYouTubeLiveVideoTitle(id) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;
  return axios.get(url);
}

function getLiveStreamStatus(url) {
  return axios.get(url);
}

exports.getYouTubeStream = getYouTubeStream;
exports.getYouTubeChannel = getYouTubeChannel;
exports.getYouTubeLiveVideoStats = getYouTubeLiveVideoStats;
exports.getLiveStreamStatus = getLiveStreamStatus;
exports.getYouTubeLiveVideoTitle = getYouTubeLiveVideoTitle;