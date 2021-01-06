const { MissingParamError } = require("../../utils/errors");

const AuthUseCase = require("./auth-usecase");

function makeEncrypter() {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return { encrypterSpy };
}
function makeEncrypterWithError() {
  class EncrypterWithErrorSpy {
    async compare() {
      throw new Error();
    }
  }
  const encrypterWithErrorSpy = new EncrypterWithErrorSpy();
  return { encrypterWithErrorSpy };
}

function makeTokenGenerator() {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = "anyToken";
  return { tokenGeneratorSpy };
}

function makeTokenGeneratorWithError() {
  class TokenGeneratorWithErrorSpy {
    async generate() {
      throw new Error();
    }
  }
  const tokenGeneratorWithErrorSpy = new TokenGeneratorWithErrorSpy();
  return { tokenGeneratorWithErrorSpy };
}

function makeUpdateAccessTokenRepository() {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId;
      this.accessToken = accessToken;
    }
  }
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  return { updateAccessTokenRepositorySpy };
}

function makeUpdateAccessTokenRepositoryWithError() {
  class UpdateAccessTokenRepositoryWithErrorSpy {
    async update() {
      throw new Error();
    }
  }
  const updateAccessTokenRepositoryWithErrorSpy = new UpdateAccessTokenRepositoryWithErrorSpy();
  return { updateAccessTokenRepositoryWithErrorSpy };
}

function makeLoadUserByEmailRepository() {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;

      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = { id: "any_id", password: "hashedPassword" };
  return { loadUserByEmailRepositorySpy };
}

function makeLoadUserByEmailRepositoryWithError() {
  class LoadUserByEmailRepositoryWithErrorSpy {
    async load() {
      throw new Error();
    }
  }
  const loadUserByEmailRepositoryWithErrorSpy = new LoadUserByEmailRepositoryWithErrorSpy();
  return { loadUserByEmailRepositoryWithErrorSpy };
}

function makeSut() {
  const { loadUserByEmailRepositorySpy } = makeLoadUserByEmailRepository();
  const { encrypterSpy } = makeEncrypter();
  const { tokenGeneratorSpy } = makeTokenGenerator();
  const { updateAccessTokenRepositorySpy } = makeUpdateAccessTokenRepository();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  });
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  };
}

describe("Auth UseCase", () => {
  test("Should throw if no email is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw if no password is provided", async () => {
    const { sut } = makeSut();
    const promise = sut.auth("any@email.com");
    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("any@email.com", "any");
    expect(loadUserByEmailRepositorySpy.email).toBe("any@email.com");
  });

  test("Should return null if invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth("invalid@email.com", "any");
    expect(accessToken).toBeNull();
  });

  test("Should return null if invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth("valid@email.com", "invalid");
    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("valid@email.com", "any");
    expect(encrypterSpy.password).toBe("any");
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });

  test("Should call TokenGenerator with correct values userId", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("valid@email.com", "valid");
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user._id);
  });

  test("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("valid@email.com", "valid");
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test("Should call UpdateAccessTokenRepository with correct values userId and accessToken", async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy
    } = makeSut();
    await sut.auth("valid@email.com", "valid");
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user._id);
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken);
  });

  test("Should throw if no invalid dependencies is provided", async () => {
    const invalid = {};
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const tokenGenerator = makeTokenGenerator();
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: null }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any@email.com", "any");
      await expect(promise).rejects.toThrow();
    }
  });

  test("Should throw if any dependencies throws", async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const tokenGenerator = makeTokenGenerator();
    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: makeEncrypterWithError() }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    );
    for (const sut of suts) {
      const promise = sut.auth("any@email.com", "any");
      await expect(promise).rejects.toThrow();
    }
  });
});
