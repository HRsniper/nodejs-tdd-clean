const Encrypter = require("./encrypter");

describe("Encrypter", () => {
  function makeSut() {
    const encrypter = new Encrypter();

    return encrypter;
  }

  test("Should return true if bcrypt returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(true);
  });
});
