const LoginRouter = require("./login-router");
const { MissingParamError, UnauthorizedError, ServerError, InvalidParamError } = require("../errors");

function makeAuthUseCase() {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;

      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
}

function makeSut() {
  const authUseCaseSpy = new makeAuthUseCase();
  const emailValidatorSpy = new makeEmailValidator();
  authUseCaseSpy.accessToken = "validToken";
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

  return { sut, authUseCaseSpy, emailValidatorSpy };
}

function makeEmailValidator() {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
      return this.isEmailValid;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
}

function makeAuthUseCaseWithError() {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error("");
    }
  }

  return new AuthUseCaseSpy();
}

describe("login router", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { password: "any" }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: { email: "any@any.com" }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("should return 500 if no httpRequest is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 500 if httpRequest has no body", async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should call authUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = { body: { email: "invalid@email.com", password: "invalid" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("should return 200 when valid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    // authUseCaseSpy.accessToken = "validToken";
    const httpRequest = { body: { email: "valid@email.com", password: "valid" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("should return 500 if no authUseCase is provided", async () => {
    const sut = new LoginRouter();
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 500 if authUseCase has no auth", async () => {
    class AuthUseCaseSpy {}
    const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 500 if authUseCase throws", async () => {
    const authUseCaseSpy = new makeAuthUseCaseWithError();
    authUseCaseSpy.accessToken = "validToken";
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: { email: "invalid@email.com", password: "any" }
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("should return 500 if no EmailValidator is provided", async () => {
    const authUseCaseSpy = new makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("should return 500 if EmailValidator has no isValid method", async () => {
    const authUseCaseSpy = new makeAuthUseCase();
    class EmailValidatorSpy {}
    const emailValidatorSpy = new EmailValidatorSpy();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
