const { pause } = require('./utils');
const {
  loadMembers,
  saveMembers,
  saveMembersToRedis
} = require('../services/memberService');
const { mergeDataToModel } = require('../controllers/mergeController');
const config = require("config");

// async function updateMembersLoop() {
//   try {
//     let members = await loadMembers();
//     let i = 0;
//     // let limit = 120;

//     while (true) {
//       console.log("i:", i);
//       // console.log("Current OAuth Token:", config.get("oauth_token"));

//       // if (i === limit) {
//       //   console.log("Checking if token is valid after 3 hours...");
//       //   await checkOAuthToken();
//       //   i = 0;
//       // }

//       members = await mergeDataToModel(members);
//       await saveMembers(members);
//       await pause(300);
      
//       i++;
//     }
//   } catch (error) {
//     console.error("Update members loop error", error);
//     process.exit(1);
//   }
// }
// updateMembersLoop();

// async function membersLoop() {
//   let members = await loadMembers();
//   members = await mergeDataToModel(members);
//   await saveMembers(members);
//   console.log("membersLoop done");
// }
// membersLoop();

async function redisLoop() {
  try {
    let members = await loadMembers();
    members = await mergeDataToModel(members);
    await saveMembersToRedis(members);
  } catch (error) {
    console.error("Update members loop error", error);
    process.exit(1);
  }
}

redisLoop();
let myInterval;
if (myInterval) clearInterval(myInterval);
myInterval = setInterval(redisLoop, 300000);