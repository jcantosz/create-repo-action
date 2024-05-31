const core = require("@actions/core");
const { getInputs, Visibility } = require("./src/inputHandler.js");
const { repoExists } = require("./src/githubApi.js");
const { createRepo } = require("./src/repoCreator.js");
const { fail } = require("./src/errorHandler.js");
const Auth = require("./src/auth.js");

function isAuthTypeCompatibleWithRepoTemplate(authType, repoTemplate) {
  return !(authType == Auth.AuthType.APP && repoTemplate.org != "") && repoTemplate.repo != "";
}

async function main() {
  const inputs = getInputs();
  core.debug(`inputs: ${JSON.stringify(inputs)}`);

  const auth = Auth.createOctokitInstance(inputs.auth);

  // API doesnt allow us to create repos from templates with an App. Fail early if this is the case
  if (!isAuthTypeCompatibleWithRepoTemplate(auth.type, inputs.repoTemplate)) {
    fail(
      `Cannot create a repo "${inputs.repoOrg}/${inputs.repoName}" from template "${inputs.repoTemplate}" using a GitHub App. Please provide a personal access token`
    );
  }
  // Both repo template org and repo must be set or unset
  if ((repoTemplate.org == "") ^ (repoTemplate.repo == "")) {
    fail(`Must set both "repo_template_org" and "repo_template_repo" if creating a repository from a template`);
  }

  if (await repoExists(auth.octokit, inputs.repo.org, inputs.repo.repo)) {
    fail(`Cannot create a repo "${inputs.repoOrg}/${inputs.repoName}", repo already exists.`);
  }

  await createRepo(octokit, inputs.repo, inputs.repoTemplate);
  core.info("");
}

// Only run main if called directly
if (require.main === module) {
  main().catch((error) => fail("Unhandled exception", error));
}
