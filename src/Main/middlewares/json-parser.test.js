const requestSuperTest = require("supertest");
const app = require("../config/app");

describe("JSON Parser Middleware", () => {
  test("Should parse body as JSON", async () => {
    app.post("/test_json_parser", (request, response) => {
      response.send(request.body);
    });

    await requestSuperTest(app)
      .post("/test_json_parser")
      .send({ email: "valid@email.com" })
      .expect({ email: "valid@email.com" });
  });
});
