class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email) {
      return { statusCode: 400 };
    }
  }
}

describe("login router", () => {
  test("should return 400 id no email is provided", () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: { password: "any" }
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
