const requestSuperTest = require("supertest");

const app = require("../config/app");

describe("Middleware Content Type", () => {
  test("Should return json content-type as default", async () => {
    app.get("/test_content_type", (request, response) => {
      response.send("");
    });

    await requestSuperTest(app).get("/test_content_type").expect("content-type", /json/);
  });

  test("Should return xml content-type if forced for test", async () => {
    app.get("/test_content_type_xml", (request, response) => {
      response.type("xml");
      response.send("");
    });

    await requestSuperTest(app).get("/test_content_type_xml").expect("content-type", /xml/);
  });
});
