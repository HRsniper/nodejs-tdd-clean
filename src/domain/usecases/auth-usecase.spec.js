const AuthUseCase = require("./auth-usecase");
const { MissingParamError, InvalidParamError } = require("../../utils/errors");

function makeSut() {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
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
    await expect(promise).rejects.toThrow(new MissingParamError("loadUserByEmailRepository"));
  });

  test("Should throw if LoadUserByEmailRepository is no load method", async () => {
    class LoadUserByEmailRepositorySpyNoLoadMethod {}
    const loadUserByEmailRepositorySpyNoLoadMethod = new LoadUserByEmailRepositorySpyNoLoadMethod();
    const sut = new AuthUseCase(loadUserByEmailRepositorySpyNoLoadMethod);
    const promise = sut.auth("any@email.com", "any");
    await expect(promise).rejects.toThrow(new InvalidParamError("loadUserByEmailRepository"));
  });

  test("Should return null if LoadUserByEmailRepository is return null", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth("invalid@email.com", "any");
    expect(accessToken).toBeNull();
  });
});
