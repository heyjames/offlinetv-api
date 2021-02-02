const { pause } = require('./utils');
const { loadMembers, saveMembers } = require('../services/memberService');
const { mergeDataToModel } = require('../controllers/mergeController');
const config = require("config");

async function updateMembersLoop() {
  try {
    let members = await loadMembers();
    let i = 0;
    // let limit = 120;

    while (true) {
      console.log("i:", i);
      console.log("Current OAuth Token:", config.get("oauth_token"));

      // if (i === limit) {
      //   console.log("Checking if token is valid after 3 hours...");
      //   await checkOAuthToken();
      //   i = 0;
      // }

      members = await mergeDataToModel(members);
      await saveMembers(members);
      await pause(600);
      
      i++;
    }
  } catch (error) {
    console.error("Update members loop error", error);
    process.exit(1);
  }
}

updateMembersLoop();