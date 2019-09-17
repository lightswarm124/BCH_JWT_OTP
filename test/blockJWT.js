const BlockAuth = require('../index');
const auth = new BlockAuth();

const privKeyWIF = "L5PKiCuwwgmVN1GQNg8CdR6Rmg7tg1Npw7GyL5ULRPZ5EVPhtSrz";
const address = "bitcoincash:qrcc23q0w7wgld690kduxvhetu0am523c5ufq5pes4";

run()
async function run() {
  let signedMsg = await auth.signPayloadWithKey(privKeyWIF);
  console.log("Signed Message:", signedMsg, "\n");
  let jwt = await auth.createJWT(address, signedMsg.signedMsg);
  console.log("JWT Token:", jwt, "\n");
  let verify = await auth.verifyJWT(address, signedMsg.signedMsg, jwt);
  console.log("Verifcation:", verify);
}
