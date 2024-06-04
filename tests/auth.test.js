const { AuthType, createOctokitInstance } = require("../src/auth.js");

const { error } = require("../src/errorHandler.js");

jest.mock("../src/errorHandler.js", () => ({
  error: jest.fn(),
}));

describe("Auth", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    for (env in process.env) {
      if (env.startsWith("INPUT_")) delete process.env[env];
    }
    jest.clearAllMocks();
  });

  it("Should return auth type PAT when only pat input is set", () => {
    const auth = createOctokitInstance({ appId: "", appPrivateKey: "", appInstallationId: "", PAT: "ghp" });
    expect(auth.type).toEqual(AuthType.PAT);
  });

  it("Should return auth type App when App parameters set", () => {
    const auth = createOctokitInstance({ appId: "1", appPrivateKey: "bbb", appInstallationId: "2", PAT: "" });
    expect(auth.type).toEqual(AuthType.APP);
  });

  it("Should return auth type App when both App and PAT parameters set", () => {
    const auth = createOctokitInstance({ appId: "1", appPrivateKey: "bbb", appInstallationId: "2", PAT: "ghp" });
    expect(auth.type).toEqual(AuthType.APP);
  });

  it("Should error on incomplete App auth info", () => {
    let auth = createOctokitInstance({ appId: "aaa", appPrivateKey: "", appInstallationId: "", PAT: "" });
    expect(error).toHaveBeenCalled();

    auth = createOctokitInstance({ appId: "", appPrivateKey: "bbb", appInstallationId: "", PAT: "" });
    expect(error).toHaveBeenCalled();

    auth = createOctokitInstance({ appId: "", appPrivateKey: "", appInstallationId: "ccc", PAT: "" });
    expect(error).toHaveBeenCalled();
  });

  it("Should error if neither PAT nor App auth provided", () => {
    const auth = createOctokitInstance({ appId: "", appPrivateKey: "", appInstallationId: "", pat: "" });
    expect(error).toHaveBeenCalled();
  });
});
