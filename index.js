const BITBOXSDK = require('bitbox-sdk');
const jwt = require('jsonwebtoken');

const DEFAULT_REST_API = "https://rest.bitcoin.com/v2/";

class BlockOTP {
  constructor(config) {
    if (config && config.restURL && config.restURL !== "") {
      this.restURL = config.restURL;
    } else if (process.env.RESTURL && process.env.RESTURL !== "") {
      this.restURL = process.env.RESTURL;
    } else {
      this.restURL = DEFAULT_REST_API;
    }

    this.BITBOX = new BITBOXSDK.BITBOX({ restURL: this.restURL });
  }

  async createJWT(privKeyWIF, expiration = 1) {
    let blockCount = await this.BITBOX.Blockchain.getBlockCount();
    let blockHash = await this.BITBOX.Blockchain.getBestBlockHash();
    let payload = await {
      mkr: blockHash,
      ebk: blockCount + expiration
    };
    let signedMessage = await this.BITBOX.BitcoinCash.signMessageWithPrivKey(
      privKeyWIF,
      JSON.stringify(payload)
    );
    let jwtMsg = await jwt.sign(payload, signedMessage, {
      algorithm: 'HS256',
      noTimestamp: true
    });
    return await {
      privKeyMsg: signedMessage,
      jwtToken: jwtMsg
    };
  }

  async verifyJWT(signedMsg, token, pubKey) {
    let payload = jwt.decode(token, {complete: true});
    let verifyMessage = this.BITBOX.BitcoinCash.verifyMessage(
      pubKey,
      signedMsg,
      JSON.stringify(payload.payload)
    );
    if (verifyMessage === true) {
      try {
        let cert = jwt.verify(token, signedMsg, {ignoreExpiration: true});
        return {
          header: payload.header,
          payload: cert,
          pubKey: pubKey
        };
      } catch (err) {
        throw "Did not validate JWT payload data";
      }
    } else {
      throw "Did not validate private-key signed message";
    }
  }
}

module.exports = BlockOTP;
