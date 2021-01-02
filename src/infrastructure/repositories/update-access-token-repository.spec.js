const UpdateAccessTokenRepository = require("./update-access-token-repository");
const MongoHelper = require("../helpers/mongo-helper");

let db;

describe("UpdateAccessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    db = await MongoHelper.getDatabase();
  });

  beforeEach(async () => {
    await db.collection("users").deleteMany();
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
    const fakeUser = await userModel.insertOne({ email: "valid@email.com", password: "any" });
    await sut.update(fakeUser.ops[0]._id, "valid_token");
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id });
    expect(updatedFakeUser.accessToken).toBe("valid_token");
  });

  test("Should throw if no userModel is provided", async () => {
    const sut = new UpdateAccessTokenRepository();
    const { userModel } = makeSut();
    const fakeUser = await userModel.insertOne({ email: "valid@email.com", password: "any" });
    const promise = sut.update(fakeUser.ops[0]._id, "valid_token");
    await expect(promise).rejects.toThrow();
  });
});
