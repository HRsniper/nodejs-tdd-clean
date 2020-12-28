module.exports = {
  token: "any_token",

  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  }
};
