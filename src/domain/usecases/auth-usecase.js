module.exports = class AuthUseCase {
  async auth(email /* , password */) {
    // this.email = email;
    // this.password = password;

    if (!email) {
      throw new Error();
    }

    // return this.accessToken;
  }
};
