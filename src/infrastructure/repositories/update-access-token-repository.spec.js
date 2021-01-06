const UpdateAccessTokenRepository = require("./update-access-token-repository");
const MongoHelper = require("../helpers/mongo-helper");
const { MissingParamError } = require("../../utils/errors");

let userModel, fakeUser_id;

function makeSut() {
  const sut = new UpdateAccessTokenRepository();
  return { sut };
}

describe("UpdateAccessToken Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();

    const fakeUser = await userModel.insertOne({ email: "valid@email.com", password: "any" });
    fakeUser_id = fakeUser.ops[0]._id;
  });

  afterAll(async () => {
    await MongoHelper.close();
  });

  test("Should update the user with the given accessToken", async () => {
    const { sut } = makeSut();

    await sut.update(fakeUser_id, "valid_token");
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser_id });
    expect(updatedFakeUser.accessToken).toBe("valid_token");
  });

  test("Should throw if no params are provided", async () => {
    const { sut } = makeSut();
    await expect(sut.update()).rejects.toThrow(new MissingParamError("userId"));

    await expect(sut.update(fakeUser_id)).rejects.toThrow(new MissingParamError("accessToken"));
  });
});
