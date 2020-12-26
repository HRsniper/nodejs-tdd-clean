const { MissingParamError } = require("../../utils/errors");

const AuthUseCase = require("./auth-usecase");

function makeSut() {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;

      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {};
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
  return { sut, loadUserByEmailRepositorySpy };
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
    const sut = new AuthUseCase();
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
    const { sut } = makeSut();
    const accessToken = await sut.auth("valid@email.com", "invalid");
    expect(accessToken).toBeNull();
  });
});
