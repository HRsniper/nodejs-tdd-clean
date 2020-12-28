const bcrypt = require("bcrypt");
module.exports = class Encrypter {
  async compare(value, hash) {
    // this.value = value;
    // this.hash = hash;
    const isValid = await bcrypt.compare(value, hash);

    return isValid;
  }
};
