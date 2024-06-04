const { createRepo } = require("../src/repoCreator.js");
const { createOrgRepo, createRepoFromTemplate, updateRepoVisibility } = require("../src/githubApi.js");
const { Visibility } = require("../src/inputHandler.js");
const { AuthType } = require("../src/auth.js");
jest.mock("../src/githubApi.js", () => ({
  createOrgRepo: jest.fn(),
  createRepoFromTemplate: jest.fn(),
  updateRepoVisibility: jest.fn(),
}));

describe("createRepo", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    for (env in process.env) {
      if (env.startsWith("INPUT_")) delete process.env[env];
    }
    jest.clearAllMocks();
  });
  // Your tests here
  it("should create a repo from a template", async () => {
    const octokit = "";
    const input = {
      repo: {
        visibility: Visibility.PRIVATE,
        org: "org",
        repo: "repo",
      },
      repoTemplate: {
        org: "testOrg",
        repo: "testRepo",
        clone_push: false,
      },
    };

    await createRepo(octokit, AuthType.APP, "", input.repo, input.repoTemplate);
    expect(createOrgRepo).not.toHaveBeenCalled();
    expect(createRepoFromTemplate).toHaveBeenCalled();
    expect(updateRepoVisibility).not.toHaveBeenCalled();
  });

  it("should create a repo from a template and update its visibility when visibility set to internal", async () => {
    const octokit = "";
    const input = {
      repo: {
        visibility: Visibility.INTERNAL,
        org: "org",
        repo: "repo",
      },
      repoTemplate: {
        org: "testOrg",
        repo: "testRepo",
        clone_push: false,
      },
    };

    await createRepo(octokit, AuthType.APP, "", input.repo, input.repoTemplate);

    expect(createOrgRepo).not.toHaveBeenCalled();
    expect(createRepoFromTemplate).toHaveBeenCalled();
    expect(updateRepoVisibility).toHaveBeenCalled();
  });

  it("should create a repo from a template and update its visibility when visibility set to public", async () => {
    const octokit = "";
    const input = {
      repo: {
        visibility: Visibility.PUBLIC,
        org: "org",
        repo: "repo",
      },
      repoTemplate: {
        org: "testOrg",
        repo: "testRepo",
        clone_push: false,
      },
    };

    await createRepo(octokit, AuthType.APP, "", input.repo, input.repoTemplate);
    expect(createOrgRepo).not.toHaveBeenCalled();
    expect(createRepoFromTemplate).toHaveBeenCalled();
    expect(updateRepoVisibility).toHaveBeenCalled();
  });

  it("should create a repo when template parameters are not set", async () => {
    const octokit = "";
    const input = {
      repo: {
        visibility: Visibility.PRIVATE,
        org: "org",
        repo: "repo",
      },
      repoTemplate: {
        org: "",
        repo: "",
        clone_push: false,
      },
    };

    await createRepo(octokit, AuthType.APP, "", input.repo, input.repoTemplate);
    expect(createOrgRepo).toHaveBeenCalled();
    expect(createRepoFromTemplate).not.toHaveBeenCalled();
    expect(updateRepoVisibility).not.toHaveBeenCalled();
  });
});
