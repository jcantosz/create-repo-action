const core = require("@actions/core");
const { createOrgRepo, createRepoFromTemplate, updateRepoVisibility } = require("./githubApi.js");
const { Visibility } = require("./inputHandler.js");
const { clonePushTemplate } = require("./gitShell.js");
const { AuthType } = require("./auth.js");

async function createRepo(octokit, authType, auth, repo, repoTemplate) {
  // if repo_template then create repo, make it private then switch visibility to what the user selected
  const hasRepoTemplate = repoTemplate.org != "" && repoTemplate.repo != "";

  if (repoTemplate.clonePush != true && hasRepoTemplate) {
    core.info(
      `Creating repo "${repo.org}/${repo.repo} from template '${repoTemplate.org}/${repoTemplate.repo}" using API.`
    );
    await createRepoFromTemplate(
      octokit,
      repo.org,
      repo.repo,
      repoTemplate.org,
      repoTemplate.repo,
      repo.description,
      repoTemplate.includeBranches
    );
    // Since we can only set private true/false when creating from template, we always set to private and update it later if needed
    if (repo.visibility != Visibility.PRIVATE) {
      core.info(`Updating repo "${repo.org}/${repo.repo}" visibility to "${repo.visibility}".`);
      await updateRepoVisibility(octokit, repo.org, repo.repo, repo.visibility);
    }
  } else {
    core.info(`Creating repo "${repo.org}/${repo.repo}" as empty repo.`);
    await createOrgRepo(octokit, repo.org, repo.repo, repo.description, repo.visibility);

    if (repoTemplate.clonePush == true) {
      core.info(
        `Pushing contents from template '${repoTemplate.org}/${repoTemplate.repo}" to repo "${repo.org}/${repo.repo}".`
      );
      // get octokit token
      let token = "";
      if (authType == AuthType.APP) {
        //https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app#generating-an-installation-access-token
        token = (await octokit.request(`POST /app/installations/${auth.appInstallationId}/access_tokens`)).data.token;
      } else {
        token = (await octokit.auth()).token;
      }

      clonePushTemplate(
        token,
        auth.githubUrl,
        repo.org,
        repo.repo,
        repoTemplate.org,
        repoTemplate.repo,
        repoTemplate.includeBranches
      );
    }
  }
}

module.exports = { createRepo };
