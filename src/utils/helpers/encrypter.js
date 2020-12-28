module.exports = class Encrypter {
  async compare(password, hashedPassword) {
    this.password = password;
    this.hashedPassword = hashedPassword;
    return true;
  }
};
