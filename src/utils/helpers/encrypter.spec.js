const bcrypt = require("bcrypt");

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

  test("Should return false if bcrypt returns false", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(false);
  });
});
