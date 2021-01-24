const { pause } = require('./utils');
const { loadMembers, saveMembers } = require('../services/memberService');
const { mergeTwitch } = require('../controllers/twitchController');

async function updateMembersLoop() {
  try {
    let members = await loadMembers();
    let i = 0;
    // let limit = 120;

    while (true) {
      console.log("i:", i);
      console.log("Current OAuth Token:", process.env.OAUTH_TOKEN);

      // if (i === limit) {
      //   console.log("Checking if token is valid after 3 hours...");
      //   await checkOAuthToken();
      //   i = 0;
      // }

      members = await mergeTwitch(members);
      await saveMembers(members);
      await pause(300);
      
      i++;
    }
  } catch (error) {
    console.error("Update members loop error", error);
    process.exit(1);
  }
}

updateMembersLoop();