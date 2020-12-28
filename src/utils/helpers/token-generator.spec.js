// const jwt = require("jsonwebtoken");

const TokenGenerator = require("./token-generator");
// const MissingParamError = require("../errors/missing-param-error");

describe("Token Generator", () => {
  function makeSut() {
    const sut = new TokenGenerator();

    return { sut };
  }

  test("Should return null if JWT returns null", async () => {
    const { sut } = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBeNull();
  });

  // test("Should return token if bcrypt returns token", async () => {

  // });

  // test("Should call JWT with correct values", async () => {

  // });

  // test("Should throw if no params is provided", async () => {
  
  // });
});
