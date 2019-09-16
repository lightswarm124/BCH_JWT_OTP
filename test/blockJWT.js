const BlockAuth = require('../index');
const auth = new BlockAuth();

const privKeyWIF = "L5PKiCuwwgmVN1GQNg8CdR6Rmg7tg1Npw7GyL5ULRPZ5EVPhtSrz";
const pubAddr = "1P23VhvFLH18qP7YRCPDWPwA9TCJjmp9B5";

run()
async function run() {
  let JWT = await auth.createJWT(privKeyWIF);
  console.log(JWT);
  let verify = await auth.verifyJWT(JWT.privKeyMsg, JWT.jwtToken, pubAddr);
  console.log(verify);
}
