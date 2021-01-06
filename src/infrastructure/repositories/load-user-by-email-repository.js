const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helpers/mongo-helper");

module.exports = class LoadUserByEmailRepository {
  async load(email) {
    // this.email = email;

    if (!email) {
      throw new MissingParamError("email");
    }

    const db = await MongoHelper.getDatabase();
    const user = await db.collection("users").findOne({ email }, { projection: { password: 1 } });
    return user;
  }
};
