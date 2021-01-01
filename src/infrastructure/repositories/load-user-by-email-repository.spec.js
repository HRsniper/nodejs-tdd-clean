const { MongoClient } = require("mongodb");

const LoadUserByEmailRepository = require("./load-user-by-email-repository");

describe("LoadUserByEmail Repository", () => {
  let db, client;
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
    const userModel = db.collection("users");
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load("invalid@email.com");
    expect(user).toBeNull();
  });

  test("Should return user if user is found", async () => {
    const userModel = db.collection("users");
    await userModel.insertOne({ email: "valid@email.com" });
    const sut = new LoadUserByEmailRepository(userModel);
    const user = await sut.load("valid@email.com");
    expect(user.email).toBe("valid@email.com");
  });
});
