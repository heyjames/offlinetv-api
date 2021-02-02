const express = require('express');
const app = express();
const config = require("config");

require('./src/startup');
require('./src/routes')(app);
// require('../controllers/tokenController');
// require('./src/mainLoop');

const port = process.env.PORT || config.get("port");
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

/*
//////////////////////////////////////////
// How to setup environmental variables //
//////////////////////////////////////////
// Windows Command Prompt/////////////////
set oauth_token=
set client_id=
set refresh_token=
set youtube_api_key=
set cors_url=
//////////////////////////////////////////
// Windows Powershell/////////////////////
$Env:oauth_token = ""
$Env:client_id = ""
$Env:refresh_token = ""
$Env:youtube_api_key = ""
$Env:cors_url = ""
//////////////////////////////////////////
// MacOS or Linux Terminal ///////////////
export oauth_token=
export client_id=
export refresh_token=
export youtube_api_key=
export cors_url=
//////////////////////////////////////////


  startup();
    |___make sure env vars are set
      |___tokenController(startupCheck=true);
        |___check if Twitch, Youtube, Facebook Gaming OAuth token is valid
          |___write to file system the last date time checked
          |___get new OAuth token if it isn't

    |___read from the live.JSON file
  mainLoop();
    |___tokenController(startupCheck=false);
      |___check if Twitch, Youtube, Facebook Gaming OAuth token is valid
        |___read from file system when the last time was checked
        |___proceed with OAuth token check if the last time was more than 3 hours ago
          |___get new OAuth token if it isn't

    |___platformController() - loop through members based on Twitch, Youtube, Facebook
      |___use the appropriate ____Service.js module to get channel data
      |___is the channel live? skip current loop if not live.
      |___if live, use the appropriate ____Service.js module to get user data
      |___merge channel data to the current member index's object API property

    |___write to the live.JSON file
*/