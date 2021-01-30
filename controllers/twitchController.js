const { getStreamer, getStream } = require('../services/twitchService');
const {
  getYouTubeChannel,
  getYouTubeLiveVideoStats,
  getLiveStreamStatus,
  getYouTubeLiveVideoTitle
} = require('../services/youtubeService');

function mapTwitchData(streamData, streamerData) {
  const api = {};

  if (streamData !== undefined) {
    api.viewers = streamData.viewer_count;
    api.game = streamData.game_name;
    api.stream_started_at = streamData.started_at;
    api.title = streamData.title;
  }

  if (streamerData !== undefined) {
    api.logo = streamerData.profile_image_url;
  }

  return api;
}

async function mergeTwitch(members) {
  for (let i=0; i<members.length; i++) {

    if (members[i].stream.label.toLowerCase() === "twitch") {
      try {
        const memberID = members[i].stream.id;
        const memberPlatform = members[i].stream.label;
        const memberAlias = members[i].alias;
      
        // Get channel data
        const streamData = await getStream(memberID);

        // Skip if channel is literally offline
        if (streamData === undefined) {
          console.log(`...............Skipping [${memberPlatform}] ${memberAlias}`);

          // Set miscellaneous stream metadata
          members[i].stream.live = false;
          members[i].api = {};

          continue;
        }

        // Get streamer data (logo)
        const streamerData = await getStreamer(memberID);

        // Map channel and streamer data (logo) into API model
        const api = mapTwitchData(streamData, streamerData);
        members[i].api = api;
    
        // Set miscellaneous stream metadata
        members[i].stream.live = true;
        members[i].stream.last_stream_date = new Date().toISOString();
        
        console.log(`Merged ${memberAlias} [${memberPlatform}]`);
      } catch (error) {
        console.error("Failed to merge Twitch API data", error);
      }
    } else if (members[i].stream.label.toLowerCase() === "youtube") {
      try {
        const memberID = members[i].stream.id;
        const memberPlatform = members[i].stream.label;
        const memberAlias = members[i].alias;
        const channelURL = members[i].stream.url;

        let liveVideoID = "";
        let livestreamURL = "";

        let api = {};

        // Parse the channel's main page for a live stream indicator.
        const { data: result } = await getLiveStreamStatus(channelURL);
        const isStreaming = /{"text":" watching"}/g.test(result);

        // Skip the rest of the loop if streamer isn't live.
        if (isStreaming === false) {
          console.log(`...............Skipping [${memberPlatform}] ${memberAlias}`);
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
        console.log(`Merged ${memberAlias} [${memberPlatform}]`); 
      } catch (error) {
        console.error("Failed to merge YouTube API data", error);
      }
    } else {
      console.log("Skipping non-Twitch streamers...");
    }
  }

  return members;
}

module.exports = {
  mergeTwitch
}