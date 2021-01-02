const UpdateAccessTokenRepository = require("./update-access-token-repository");
const MongoHelper = require("../helpers/mongo-helper");
const { MissingParamError } = require("../../utils/errors");

let db, fakeUser_id;

describe("UpdateAccessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    db = await MongoHelper.getDatabase();
  });

  beforeEach(async () => {
    const userModel = db.collection("users");
    await userModel.deleteMany();

    const fakeUser = await userModel.insertOne({ email: "valid@email.com", password: "any" });
    fakeUser_id = fakeUser.ops[0]._id;
  });

  afterAll(async () => {
    await MongoHelper.close();
  });

  function makeSut() {
    const userModel = db.collection("users");
    const sut = new UpdateAccessTokenRepository(userModel);
    return { sut, userModel };
  }

  test("Should update the user with the given accessToken", async () => {
    const { sut, userModel } = makeSut();

    await sut.update(fakeUser_id, "valid_token");
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser_id });
    expect(updatedFakeUser.accessToken).toBe("valid_token");
  });

  test("Should throw if no userModel is provided", async () => {
    const sut = new UpdateAccessTokenRepository();

    const promise = sut.update(fakeUser_id, "valid_token");
    await expect(promise).rejects.toThrow();
  });

  test("Should throw if no params are provided", async () => {
    const { sut } = makeSut();
    await expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));

    await expect(sut.update(fakeUser_id)).rejects.toThrow(new MissingParamError("accessToken"));
  });
});
