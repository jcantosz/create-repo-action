const { getInputs, Visibility } = require("../src/inputHandler.js");

const { fail } = require("../src/errorHandler.js");

jest.mock("../src/errorHandler.js", () => ({
  fail: jest.fn(),
}));

describe("getInputs", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    for (env in process.env) {
      if (env.startsWith("INPUT_")) delete process.env[env];
    }
    jest.clearAllMocks();
  });

  it("should return the correct inputs", () => {
    const expected = {
      auth: {
        PAT: "ghp_xyz",
        apiUrl: "https://api.github-server.com",
        appId: "1",
        appInstallationId: "22",
        appPrivateKey: "abc",
      },
      repo: {
        org: "testOrg",
        repo: "testRepo",
        visibility: Visibility.PUBLIC,
        description: "repo created with automation",
      },
      repoTemplate: {
        org: "templateOrg",
        repo: "tempalteRepo",
        includeBranches: "true",
      },
    };

    process.env.INPUT_PAT = expected.auth.PAT;
    process.env.INPUT_API_URL = expected.auth.apiUrl;
    process.env.INPUT_APP_ID = expected.auth.appId;
    process.env.INPUT_APP_PRIVATE_KEY = expected.auth.appPrivateKey;
    process.env.INPUT_APP_INSTALLATION_ID = expected.auth.appInstallationId;

    process.env.INPUT_ORG = expected.repo.org;
    process.env.INPUT_REPO = expected.repo.repo;
    process.env.INPUT_DESCRIPTION = expected.repo.description;
    process.env.INPUT_VISIBILITY = expected.repo.visibility;

    process.env.INPUT_REPO_TEMPLATE_ORG = expected.repoTemplate.org;
    process.env.INPUT_REPO_TEMPLATE_REPO = expected.repoTemplate.repo;
    process.env.INPUT_INCLUDE_ALL_BRANCHES = expected.repoTemplate.includeBranches;

    const inputs = getInputs();

    expect(inputs).toEqual(expected);
  });

  it("should accept each visibility value", () => {
    for (const value of Object.values(Visibility)) {
      process.env.INPUT_VISIBILITY = value;

      expect(getInputs().repo.visibility).toEqual(Visibility[value.toUpperCase()]);
    }
  });

  it("should fail when visibility is not one of the allowed values", () => {
    process.env.INPUT_VISIBILITY = "pub";
    getInputs();
    expect(fail).toHaveBeenCalled();
  });

  // it("should throw an error if a required input is missing", () => {
  //   // Mock the environment variables
  //   process.env.INPUT_REPO_ORG = "";
  //   process.env.INPUT_REPO_NAME = "testRepo";
  //   process.env.INPUT_REPO_VISIBILITY = "public";
  //   // ... add the rest of your inputs here

  //   expect(getInput, { repo: { org: "testOrg", repo: "testRepo", visibility: Visibility.PUBLIC } });
  // });
});

describe("Visibility", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it("should have the correct values", () => {
    expect(Visibility).toEqual({
      PRIVATE: "private",
      INTERNAL: "internal",
      PUBLIC: "public",
    });
  });
});
