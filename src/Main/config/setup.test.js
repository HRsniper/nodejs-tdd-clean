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
