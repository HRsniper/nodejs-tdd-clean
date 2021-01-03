const requestSuperTest = require("supertest");

let app;

describe("Middleware Content Type", () => {
  beforeEach(() => {
    jest.resetModules();
    app = require("../config/app");
  });

  test("Should return json content-type as default", async () => {
    app.get("/test_content_type", (request, response) => {
      response.send("");
    });

    await requestSuperTest(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("Should return xml content-type if forced for test", async () => {
    app.get("/test_content_type", (request, response) => {
      response.type("xml");
      response.send("");
    });

    await requestSuperTest(app).get("/test_content_type").expect("content-type", /xml/);
  });
});
