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

  async getBlockchainData() {
    let blockCount = await this.BITBOX.Blockchain.getBlockCount();
    let blockHash = await this.BITBOX.Blockchain.getBestBlockHash();
    return {
      bkc: blockCount,
      mkr: blockHash
    };
  }

  async signPayloadWithKey(privKeyWIF, payload = null) {
    if (payload === null) {
      payload = await this.getBlockchainData();
    }
    return await {
      payload: payload,
      signedMsg: this.BITBOX.BitcoinCash.signMessageWithPrivKey(
                  privKeyWIF,
                  JSON.stringify(payload)
                )
    };
  }

  verifySignedPayload(address, signedMsg, payload) {
    return this.BITBOX.BitcoinCash.verifyMessage(
      address,
      signedMsg,
      JSON.stringify(payload)
    );
  }

  async createJWT(address, signedMsg) {
    let payload = await this.getBlockchainData();
    let verifyMessage = await this.verifySignedPayload(address, signedMsg, payload);
    if (verifyMessage === true) {
      return jwt.sign(payload, signedMsg, {
        algorithm: 'HS256',
        noTimestamp: true
      });
    } else {
      throw "Did not validate private-key signed message";
    }
  }

  async verifyJWT(address, signedMsg, token) {
    let payload = jwt.decode(token);
    let verifyMessage = this.verifySignedPayload(address, signedMsg, payload);
    if (verifyMessage === true) {
      try {
        let cert = jwt.verify(token, signedMsg, {ignoreExpiration: true});
        return {
          payload: cert,
          address: address
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
