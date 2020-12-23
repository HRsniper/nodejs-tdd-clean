const validator = require("validator");

const EmailValidator = require("./email-validator");
const MissingParamError = require("../errors/missing-param-error");

function makeSut() {
  const sut = new EmailValidator();

  return { sut };
}

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    const { sut } = makeSut();
    const isEmailValid = sut.isValid("valid@email.com");
    expect(isEmailValid).toBe(true);
  });

  test("Should return true if validator returns false", () => {
    validator.isEmailValid = false;
    const { sut } = makeSut();
    const isEmailValid = sut.isValid("invalid@email.com");
    expect(isEmailValid).toBe(false);
  });

  test("Should call validator with correct email", () => {
    const { sut } = makeSut();
    sut.isValid("any@email.com");
    expect(validator.email).toBe("any@email.com");
  });

  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError("email"));
  });
});
