const jwt = require("jsonwebtoken");

const MissingParamError = require("../errors/missing-param-error");
module.exports = class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }
  async generate(payload) {
    // this.payload = payload;

    if (!payload) {
      throw new MissingParamError("payload");
    }

    if (!this.secret) {
      throw new MissingParamError("secret");
    }

    // return jwt.sign({ sub: payload }, this.secret);
    return jwt.sign({ _id: payload }, this.secret);
  }
};
