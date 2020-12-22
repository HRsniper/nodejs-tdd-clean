class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return { statusCode: 400 };
    }
  }
}

describe("login router", () => {
  test("should return 400 if no email is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: { password: "any" }
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });

  test("should return 400 if no password is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: { email: "any@any.com" }
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
