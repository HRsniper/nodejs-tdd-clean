const requestSuperTest = require("supertest");

const app = require("./app");

describe("App Setup", () => {
  test("Should disable x-powered-by header", async () => {
    app.get("/test_x_powered_by", (request, response) => {
      response.send("");
    });

    const response = await requestSuperTest(app).get("/test_x_powered_by");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});
