const { getStreamer, getStream } = require('../services/twitchService');
const {
  getYouTubeStream,
  getYouTubeChannel,
  getYouTubeLiveVideoStats,
  getLiveStreamStatus,
  getYouTubeLiveVideoTitle
} = require('../services/youtubeService');

async function mergeTwitch(members) {
  for (let i=0; i<members.length; i++) {
    if (members[i].stream.label.toLowerCase() === "twitch") {
      try {
        const memberID = members[i].stream.id;
        const memberPlatform = members[i].stream.label;
        const memberAlias = members[i].alias;
        // console.log(`${memberID}: ${memberAlias}`);
    
        // Get live stream if available.
        let streamData = await getStream(memberID);
        const streamResponse = streamData.status; // 200
        streamData = streamData.data.data[0];
    
        // Skip the rest of the loop if streamer isn't live.
        if (streamData === undefined) {
          console.log(`Skipping ${memberAlias} (${memberPlatform})...`);
          members[i].stream.live = false;
          members[i].api = {};
          continue;
        }
    
        // Get streamer info if available
        let streamerData = await getStreamer(memberID);
        const streamerResponse = streamerData.status; // 200
        streamerData = streamerData.data.data[0];
        
        // Initialize object to merge with members.api.
        let api = {};
    
        // Set live stream data.
        if (streamData !== undefined) {
          api.viewers = streamData.viewer_count;
          api.game = streamData.game_name;
          api.stream_started_at = streamData.started_at;
          api.title = streamData.title;
        }
    
        // Set profile picture URL.
        if (streamerData !== undefined) {
          api.logo = streamerData.profile_image_url;
        }
    
        members[i].stream.live = true;
        members[i].stream.last_stream_date = new Date().toISOString();
        
        members[i].api = api;
        console.log(`Merged ${memberAlias} (${memberPlatform})...`);
      } catch (error) {
        console.error("Failed to merge API data", error);
      }
    } else if (members[i].stream.label.toLowerCase() === "youtube") {
      const memberID = members[i].stream.id;
      const memberPlatform = members[i].stream.label;
      const memberAlias = members[i].alias;
      const channelURL = members[i].stream.url;

      let liveVideoID = "";
      let livestreamURL = "";
      // Initialize object to merge with members.api.
      let api = {};

      // Parse the channel's main page for a live stream indicator.
      const { data: result } = await getLiveStreamStatus(channelURL);
      const isStreaming = /{"text":" watching"}/g.test(result);

      // Skip the rest of the loop if streamer isn't live.
      if (isStreaming === false) {
        console.log(`Skipping ${memberAlias} (${memberPlatform})...`);
        members[i].stream.live = false;
        members[i].stream.url_alt = "";
        members[i].api = {};
        continue;
      }
      
      // If streamer is live streaming...

      // Get and set the live stream's video ID.
      if (isStreaming === true) {
        liveVideoID = /\{"videoId":"([a-zA-Z0-9._-]+)"/g.exec(result)[1];
        // console.log(`${memberAlias} is live at ${liveVideoID}`);
        livestreamURL = "https://www.youtube.com/watch?v=" + liveVideoID;
      }
      
      //////////////////////////////////////////////////////////////////////////
      // Get streamer info (channel avatar)
      const { data: streamerData } = await getYouTubeChannel(memberID);
      const isValidUser = (streamerData.pageInfo.totalResults > 0);
      // Set profile picture URL.
      if (isValidUser) {
        api.logo = streamerData.items[0].snippet.thumbnails.default.url;
      }
      //////////////////////////////////////////////////////////////////////////

      
      //////////////////////////////////////////////////////////////////////////
      // Get the live video info from the video ID like view count, start time.
      const { data: liveVideoStats } = await getYouTubeLiveVideoStats(liveVideoID);
      // Get the live video title from the video ID.
      const { data: liveVideoTitle } = await getYouTubeLiveVideoTitle(liveVideoID);
      // console.log("liveVideoTitle.items[0].snippet:", liveVideoTitle.items[0].snippet);
      // const isStreamingCheck2 = liveVideoTitle.items[0].snippet.liveBroadcastContent; // live vs none: string type
      
      // Map live stream data.
      api.viewers = parseInt(liveVideoStats.items[0].liveStreamingDetails.concurrentViewers);
      // api.game = streamData.items[0].snippet.game_name; TODO: Find game name.
      api.game = "";
      api.stream_started_at = liveVideoStats.items[0].liveStreamingDetails.actualStartTime;
      api.title = liveVideoTitle.items[0].snippet.title;
      //////////////////////////////////////////////////////////////////////////




      members[i].stream.live = true;
      members[i].stream.url_alt = livestreamURL;
      members[i].stream.last_stream_date = new Date().toISOString();
      
      members[i].api = api;
      console.log(`Merged ${memberAlias} (${memberPlatform})...`);
    } else {
      console.log("Skipping non-Twitch streamers...");
    }
  }

  return members;
}

module.exports = {
  mergeTwitch
}