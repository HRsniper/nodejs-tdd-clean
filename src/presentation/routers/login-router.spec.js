const LoginRouter = require("./login-router");
const { UnauthorizedError, ServerError } = require("../errors");
const { MissingParamError, InvalidParamError } = require("../../utils/errors");

function makeAuthUseCase() {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;

      return this.accessToken;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  return { authUseCaseSpy };
}

function makeSut() {
  const { authUseCaseSpy } = makeAuthUseCase();
  const { emailValidatorSpy } = makeEmailValidator();
  authUseCaseSpy.accessToken = "validToken";
  const sut = new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator: emailValidatorSpy });

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
  return { emailValidatorSpy };
}

function makeAuthUseCaseWithError() {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error("");
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  return { authUseCaseSpy };
}

function makeEmailValidatorWithError() {
  class EmailValidatorSpy {
    isValid() {
      throw new Error("");
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  return { emailValidatorSpy };
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

  test("should return 500 if authUseCase throws", async () => {
    const { authUseCaseSpy } = makeAuthUseCaseWithError();
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

  test("should return 500 if EmailValidator throws", async () => {
    const { authUseCaseSpy } = makeAuthUseCase();
    const { emailValidatorSpy } = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = { body: { email: "any@any.com", password: "any" } };
    await sut.route(httpRequest);
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });

  test("Should throw if no invalid dependencies is provided", async () => {
    const invalid = {};
    const { authUseCaseSpy } = makeAuthUseCase();
    const suts = [].concat(
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({ authUseCase: invalid }),
      new LoginRouter({ authUseCase: authUseCaseSpy }),
      new LoginRouter({ authUseCase: authUseCaseSpy, emailValidator: invalid })
    );
    for (const sut of suts) {
      const httpRequest = { body: { email: "any@any.com", password: "any" } };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(new ServerError());
    }
  });
});
