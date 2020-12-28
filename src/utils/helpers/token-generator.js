const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
// const MissingParamError = require("../errors/missing-param-error");

module.exports = class TokenGenerator {
  async generate(id) {
    // this.id = id;
    return jwt.sign(id, secret);
  }
};
