const EmailValidator = require("./email-validator");

describe("Email Validator", () => {
  test("Should return true if validator returns true", () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid("valid@email.com");
    expect(isEmailValid).toBe(true);
  });
});
