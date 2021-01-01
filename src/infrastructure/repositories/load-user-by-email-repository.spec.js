const LoadUserByEmailRepository = require("./load-user-by-email-repository");

const makeSut = () => {
  const sut = new LoadUserByEmailRepository();
  return { sut };
};

describe("LoadUserByEmail Repository", () => {
  test("Should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid@email.com");
    expect(user).toBeNull();
  });
});
