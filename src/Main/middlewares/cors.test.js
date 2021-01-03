const requestSuperTest = require("supertest");

const app = require("../config/app");

describe("Middleware CORS", () => {
  test("Should enable CORS", async () => {
    app.get("/test_cors", (request, response) => {
      response.send("");
    });

    const response = await requestSuperTest(app).get("/test_cors");
    // aberto para todos endereços
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toBe("*");
    expect(response.headers["access-control-allow-headers"]).toBe("*");
  });
});
