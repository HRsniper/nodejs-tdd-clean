const bcrypt = require("bcrypt");

const Encrypter = require("./encrypter");
const MissingParamError = require("../errors/missing-param-error");

describe("Encrypter", () => {
  function makeSut() {
    const sut = new Encrypter();

    return { sut };
  }

  test("Should return true if bcrypt returns true", async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(true);
  });

  test("Should return false if bcrypt returns false", async () => {
    const { sut } = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "hashed_value");
    expect(isValid).toBe(false);
  });

  test("Should call bcrypt with correct values", async () => {
    const { sut } = makeSut();
    await sut.compare("any_value", "hashed_value");
    expect(bcrypt.value).toBe("any_value");
    expect(bcrypt.hash).toBe("hashed_value");
  });

  test("Should throw if no params is provided", async () => {
    const { sut } = makeSut();
    // const promise = sut.compare();
    await expect(sut.compare()).rejects.toThrow(new MissingParamError("value"));
    await expect(sut.compare("any_value")).rejects.toThrow(new MissingParamError("hash"));
  });
});