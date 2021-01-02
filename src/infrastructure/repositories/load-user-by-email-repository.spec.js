const LoadUserByEmailRepository = require("./load-user-by-email-repository");
const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helpers/mongo-helper");

let db;

function makeSut() {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);
  return { sut, userModel };
}

describe("LoadUserByEmail Repository", () => {
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

  test("Should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid@email.com");
    expect(user).toBeNull();
  });

  test("Should return user if user is found", async () => {
    const { sut, userModel } = makeSut();
    const fakeUser = await userModel.insertOne({ email: "valid@email.com", password: "any" });
    const user = await sut.load("valid@email.com");
    expect(user).toEqual({ _id: fakeUser.ops[0]._id, password: fakeUser.ops[0].password });
  });

  test("Should throw if no userModel is provided", async () => {
    const sut = new LoadUserByEmailRepository();
    const promise = sut.load("any@email.com");
    await expect(promise).rejects.toThrow();
  });

  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });
});
