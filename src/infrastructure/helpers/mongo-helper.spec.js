const sut = require("./mongo-helper");

describe("Mongo Helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test("Should reconnect when getCollection() is invoked and client is disconnected", async () => {
    // beforeAll
    expect(sut.db).toBeTruthy();

    await sut.disconnect();
    expect(sut.db).toBeFalsy();

    await sut.getCollection("users");
    expect(sut.db).toBeTruthy();

    // afterAll
  });

  test("Should reconnect when getDatabase() is invoked and client is disconnected", async () => {
    // beforeAll
    expect(sut.db).toBeTruthy();

    await sut.disconnect();
    expect(sut.db).toBeFalsy();

    await sut.getDatabase();
    expect(sut.db).toBeTruthy();

    // afterAll
  });
});