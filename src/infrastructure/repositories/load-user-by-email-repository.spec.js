const { MongoClient } = require("mongodb");

const LoadUserByEmailRepository = require("./load-user-by-email-repository");

let db, client;

function makeSut() {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);
  return { sut, userModel };
}

describe("LoadUserByEmail Repository", () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await client.db();
  });

  beforeEach(async () => {
    await db.collection("users").deleteMany();
  });

  afterAll(async () => {
    await client.close();
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
});
