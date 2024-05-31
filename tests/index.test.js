const { getInputs, Visibility } = require("../src/inputHandler.js");
const { createRepo } = require("../src/repoCreator.js");
const { fail } = require("../src/errorHandler.js");
const Auth = require("../src/auth.js");
const { isAuthTypeCompatibleWithRepoTemplate, main } = require("../index.js");

describe("isAuthTypeCompatibleWithRepoTemplate", () => {
  // Your tests here
  it("check", () => {
    expect(true);
  });
});

// describe("main", () => {
//   // Your tests here
// });

// const core = require("@actions/core");
// const Auth = require("./src/auth.js");
// const index = require("./index.js");

// jest.mock("@actions/core");

// describe("getInputs", () => {
//   it("should return correct inputs", () => {
//     core.getInput.mockImplementation((input) => {
//       switch (input) {
//         case "visibility":
//           return "public";
//         case "PAT":
//           return "testPAT";
//         case "app_id":
//           return "testAppId";
//         case "app_private_key":
//           return "testPrivateKey";
//         case "app_installation_id":
//           return "testInstallationId";
//         case "api_url":
//           return "https://api.github.com";
//         case "org":
//           return "testOrg";
//         case "repo":
//           return "testRepo";
//         case "description":
//           return "testDescription";
//         case "repo_template_org":
//           return "testTemplateOrg";
//         case "repo_template_repo":
//           return "testTemplateRepo";
//         case "include_all_branches":
//           return "testIncludeBranches";
//         default:
//           return "";
//       }
//     });

//     const inputs = index.getInputs();

//     expect(inputs).toEqual({
//       auth: {
//         PAT: "testPAT",
//         appId: "testAppId",
//         appPrivateKey: "testPrivateKey",
//         appInstallationId: "testInstallationId",
//         apiUrl: "https://api.github.com",
//       },
//       repo: {
//         org: "testOrg",
//         repo: "testRepo",
//         description: "testDescription",
//         visibility: "public",
//       },
//       repoTemplate: {
//         org: "testTemplateOrg",
//         repo: "testTemplateRepo",
//         includeBranches: "testIncludeBranches",
//       },
//     });
//   });
// });

// describe("authCompatibleWithAction", () => {
//   it("should return true when authType is not APP and repoTemplate.org is not empty", () => {
//     const authType = Auth.AuthType.PAT;
//     const repoTemplate = { org: "testOrg", repo: "testRepo" };

//     const result = index.authCompatibleWithAction(authType, repoTemplate);

//     expect(result).toBe(true);
//   });

//   it("should return false when authType is APP and repoTemplate.org is not empty", () => {
//     const authType = Auth.AuthType.APP;
//     const repoTemplate = { org: "testOrg", repo: "testRepo" };

//     const result = index.authCompatibleWithAction(authType, repoTemplate);

//     expect(result).toBe(false);
//   });
// });
