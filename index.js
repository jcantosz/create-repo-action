const Auth = require("./src/auth.js");
const core = require("@actions/core");
const { getInputs } = require("./src/inputHandler.js");
const { createRepo } = require("./src/repoCreator.js");
const { repoExists } = require("./src/githubApi.js");
const { error } = require("./src/errorHandler.js");

function isAuthTypeCompatibleWithRepoTemplate(authType, repoTemplate) {
  const isAppAuth = authType == Auth.AuthType.APP;
  const usingRepoTemplate = repoTemplate.org != "" && repoTemplate.repo != "";
  return !(isAppAuth && usingRepoTemplate) || repoTemplate.clonePush;
}

async function main() {
  const inputs = getInputs();
  core.debug(`inputs: ${JSON.stringify(inputs)}`);

  const auth = Auth.createOctokitInstance(inputs.auth);

  // API doesnt allow us to create repos from templates with an App. Fail early if this is the case
  if (!isAuthTypeCompatibleWithRepoTemplate(auth.type, inputs.repoTemplate)) {
    error(
      `Cannot create a repo "${inputs.repoOrg}/${inputs.repoName}" from template "${inputs.repoTemplate}" using a GitHub App. Please provide a personal access token`
    );
  }
  // Both repo template org and repo must be set or unset
  if ((repoTemplate.org == "") ^ (repoTemplate.repo == "")) {
    error(`Must set both "repo_template_org" and "repo_template_repo" if creating a repository from a template`);
  }

  if (await repoExists(auth.octokit, inputs.repo.org, inputs.repo.repo)) {
    error(`Cannot create a repo "${inputs.repoOrg}/${inputs.repoName}", repo already exists.`);
  }

  await createRepo(auth.octokit, auth.type, auth.githubUrl, inputs.repo, inputs.repoTemplate);
  core.info("");
}

// Only run main if called directly
if (require.main === module) {
  main();
}

if (process.env["NODE_DEV"] == "TEST") {
  module.exports = {
    isAuthTypeCompatibleWithRepoTemplate,
  };
}
