const Auth = require("./src/auth.js");
const core = require("@actions/core");
const { getInputs } = require("./src/inputHandler.js");
const { createRepo } = require("./src/repoCreator.js");
const { repoExists } = require("./src/githubApi.js");
const { error } = require("./src/errorHandler.js");

async function main() {
  const inputs = getInputs();
  core.debug(`inputs: ${JSON.stringify(inputs)}`);

  const auth = Auth.createOctokitInstance(inputs.auth);

  // Both repo template org and repo must be set or unset
  if ((inputs.repoTemplate.org == "") ^ (inputs.repoTemplate.repo == "")) {
    error(`Must set both "repo_template_org" and "repo_template_repo" if creating a repository from a template`);
  }

  if (await repoExists(auth.octokit, inputs.repo.org, inputs.repo.repo)) {
    error(`Cannot create a repo "${inputs.repo.org}/${inputs.repo.repo}", repo already exists.`);
  }

  await createRepo(auth.octokit, auth.type, inputs.auth, inputs.repo, inputs.repoTemplate);
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
