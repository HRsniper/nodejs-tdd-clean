const jwt = require("jsonwebtoken");

const MissingParamError = require("../errors/missing-param-error");
module.exports = class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  async generate(payload) {
    // this.payload = payload;

    if (!this.secret) {
      throw new MissingParamError("secret");
    }

    return jwt.sign(payload, this.secret);
  }
};
