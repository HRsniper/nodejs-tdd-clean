const LoginRouter = require("./login-router");
const { MissingParamError, UnauthorizedError } = require("../errors");

function makeSut() {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;

      return this.accessToken;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = "validToken";
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
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = { body: { email: "invalid@email.com", password: "invalid" } };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("should return 200 when valid credentials are provided", () => {
    const { sut, authUseCaseSpy } = makeSut();
    // authUseCaseSpy.accessToken = "validToken";
    const httpRequest = { body: { email: "valid@email.com", password: "valid" } };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("should return 500 if no authUseCase is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("should return 500 if authUseCase has no auth", () => {
    class AuthUseCaseSpy {}
    const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
