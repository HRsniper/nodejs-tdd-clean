const requestSuperTest = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../config/app");
const MongoHelper = require("../../infrastructure/helpers/mongo-helper");

let userModel;

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should return 200 when valid credentials are provided", async () => {
    await userModel.insertOne({
      email: "valid@email.com",
      password: bcrypt.hashSync("hashed_password", 10)
    });
    console.log(bcrypt.hashSync("hashed_password", 10));

    await requestSuperTest(app)
      .post("/api/login")
      .send({
        email: "valid@email.com",
        password: "hashed_password"
      })
      .expect(200);
  });

  test("Should return 401 when invalid credentials are provided", async () => {
    await requestSuperTest(app)
      .post("/api/login")
      .send({
        email: "invalid@email.com",
        password: "hashed_password"
      })
      .expect(401);
  });
});
