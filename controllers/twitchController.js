const {
  getStreamer,
  getStream
} = require("../services/twitchService");

async function mergeTwitch(members) {
  for (let i=0; i<members.length; i++) {
    if (members[i].stream.label.toLowerCase() === "twitch") {
      try {
        const memberID = members[i].stream.id;
        const memberAlias = members[i].alias;
        // console.log(`${memberID}: ${memberAlias}`);
    
        // Get live stream if available.
        let streamData = await getStream(memberID);
        const streamResponse = streamData.status; // 200
        streamData = streamData.data.data[0];
    
        // Skip the rest of the loop if streamer isn't live.
        if (streamData === undefined) {
          console.log(`Skipping streamer: ${memberAlias}!!!!!!`);
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
        console.log(`Merged ${memberAlias}..........`);
      } catch (error) {
        console.error("Failed to merge API data", error);
      }
    } else {
      console.log("Skipping non-Twitch streamers...");
    }
  }

  return members;
}

exports.mergeTwitch = mergeTwitch;