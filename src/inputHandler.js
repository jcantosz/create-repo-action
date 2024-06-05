const core = require("@actions/core");
const { error } = require("./errorHandler.js");

const Visibility = Object.freeze({
  PRIVATE: "private",
  INTERNAL: "internal",
  PUBLIC: "public",
});

function getInputs() {
  const visInput = core.getInput("visibility").trim().toUpperCase();
  const visibility =
    visInput in Visibility ? Visibility[visInput] : error(`Visibility must be one of: ${Object.values(Visibility)}`);

  return {
    auth: {
      PAT: core.getInput("pat") || "",
      appId: core.getInput("app_id") || "",
      appPrivateKey: core.getInput("app_private_key") || "",
      appInstallationId: core.getInput("app_installation_id") || "",
      apiUrl: core.getInput("api_url") || "https://api.github.com",
      githubUrl: core.getInput("github_url") || "https://github.com",
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
      includeBranches: core.getInput("include_all_branches").toLowerCase() == "true",
      clonePush: core.getInput("clone_push").toLowerCase() == "true",
    },
  };
}

module.exports = {
  Visibility,
  getInputs,
};
