const core = require("@actions/core");
const { fail } = require("./errorHandler.js");

const Visibility = Object.freeze({
  PRIVATE: "private",
  INTERNAL: "internal",
  PUBLIC: "public",
});

function getInputs() {
  const visInput = core.getInput("visibility").trim().toUpperCase();
  const visibility =
    visInput in Visibility ? Visibility[visInput] : fail(`Visibility must be one of: ${Object.values(Visibility)}`);

  return {
    auth: {
      PAT: core.getInput("pat") || "",
      appId: core.getInput("app_id") || "",
      appPrivateKey: core.getInput("app_private_key") || "",
      appInstallationId: core.getInput("app_installation_id") || "",
      apiUrl: core.getInput("api_url") || "https://api.github.com",
    },
    repo: {
      org: core.getInput("org") || "",
      repo: core.getInput("repo") || "",
      description: core.getInput("description") || "",
      visibility: visibility,
    },
    repoTemplate: {
      org: core.getInput("repo_template_org") || "",
      repo: core.getInput("repo_template_repo") || "",
      includeBranches: core.getInput("include_all_branches") || "",
      clonePush: core.getInput("clone_push").toLower() === "true",
    },
  };
}

module.exports = {
  Visibility,
  getInputs,
};
