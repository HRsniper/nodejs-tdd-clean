const { MissingParamError } = require("../../utils/errors");

const AuthUseCase = require("./auth-usecase");

function makeEncrypter() {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return { encrypterSpy };
}

function makeTokenGenerator() {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = "anyToken";
  return { tokenGeneratorSpy };
}

function makeLoadUserByEmailRepository() {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;

      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = { id: "any_id", password: "hashedPassword" };
  return { loadUserByEmailRepositorySpy };
}

function makeSut() {
  const { loadUserByEmailRepositorySpy } = makeLoadUserByEmailRepository();
  const { encrypterSpy } = makeEncrypter();
  const { tokenGeneratorSpy } = makeTokenGenerator();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  });
  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy };
}

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth("any@email.com");
    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("any@email.com", "any");
    expect(loadUserByEmailRepositorySpy.email).toBe("any@email.com");
  });

  test("Should throw if no LoadUserByEmailRepository is provided", async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth("any@email.com", "any");
    await expect(promise).rejects.toThrow();
  });

  test("Should throw if LoadUserByEmailRepository is no load method", async () => {
    class LoadUserByEmailRepositorySpyNoLoadMethod {}
    const loadUserByEmailRepositorySpyNoLoadMethod = new LoadUserByEmailRepositorySpyNoLoadMethod();
    const sut = new AuthUseCase(loadUserByEmailRepositorySpyNoLoadMethod);
    const promise = sut.auth("any@email.com", "any");
    await expect(promise).rejects.toThrow();
  });

  test("Should return null if invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth("invalid@email.com", "any");
    expect(accessToken).toBeNull();
  });

  test("Should return null if invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth("valid@email.com", "invalid");
    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("valid@email.com", "any");
    expect(encrypterSpy.password).toBe("any");
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });

  test("Should call TokenGenerator with correct values userId", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("valid@email.com", "valid");
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  test("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("valid@email.com", "valid");
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });
});
