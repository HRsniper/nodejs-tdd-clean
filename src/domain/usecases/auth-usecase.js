const { MissingParamError } = require("../../utils/errors");

module.exports = class AuthUseCase {
  async auth(email /* , password */) {
    // this.email = email;
    // this.password = password;

    if (!email) {
      throw new MissingParamError("email");
    }

    // return this.accessToken;
  }
};
