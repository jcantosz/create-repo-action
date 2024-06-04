const Auth = require("../src/auth.js");
const { isAuthTypeCompatibleWithRepoTemplate } = require("../index.js");

describe("isAuthTypeCompatibleWithRepoTemplate", () => {
  it("Check doesnt allow app auth with template", () => {
    expect(!isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "test", repo: "test", clonePush: false }));
    expect(!isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "", repo: "test", clonePush: false }));
    expect(!isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "test", repo: "", clonePush: false }));
  });

  it("Check allows app auth without template", () => {
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "", repo: "" }));
  });

  it("Check allows app auth without template if clonePush is set", () => {
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "test", repo: "test", clonePush: true }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "", repo: "test", clonePush: true }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.APP, { org: "test", repo: "", clonePush: true }));
  });

  it("Check always allows app auth if using pat", () => {
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "test", repo: "test", clonePush: false }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "", repo: "test", clonePush: false }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "test", repo: "", clonePush: false }));

    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "", repo: "" }));

    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "test", repo: "test", clonePush: true }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "", repo: "test", clonePush: true }));
    expect(isAuthTypeCompatibleWithRepoTemplate(Auth.AuthType.PAT, { org: "test", repo: "", clonePush: true }));
  });
});
