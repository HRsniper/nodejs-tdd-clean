const LoginRouter = require("./login-router");
const MissingParamError = require("../errors/missing-param-error");

function makeSut() {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return { sut, authUseCaseSpy };
}

describe("login router", () => {
  test("should return 400 if no email is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { password: "any" }
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("should return 400 if no password is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { email: "any@any.com" }
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("should return 500 if no httpRequest is provided", () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test("should return 500 if httpRequest has no body", () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("should call authUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("should return 401 when invalid credentials are provided", () => {
    const { sut } = makeSut();
    const httpRequest = { body: { email: "invalid", password: "invalid" } };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
  });
});
