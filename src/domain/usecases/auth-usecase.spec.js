const AuthUseCase = require("./auth-usecase");
const { MissingParamError } = require("../../utils/errors");

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth("any@email.com");
    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    class LoadUserByEmailRepositorySpy {
      async load(email) {
        this.email = email;
      }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
    await sut.auth("any@email.com", "any");
    expect(loadUserByEmailRepositorySpy.email).toBe("any@email.com");
  });
});
