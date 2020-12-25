const { MissingParamError } = require("../../utils/errors");

module.exports = class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  async auth(email, password) {
    // this.email = email;
    // this.password = password;

    if (!email) {
      throw new MissingParamError("email");
    }

    if (!password) {
      throw new MissingParamError("password");
    }

    await this.loadUserByEmailRepository.load(email);

    // return this.accessToken;
  }
};
