const AuthUseCase = require("./auth-usecase");

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrow();
  });
});
