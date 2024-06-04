const core = require("@actions/core");
const { createOrgRepo, createRepoFromTemplate, updateRepoVisibility } = require("./githubApi.js");
const { Visibility } = require("./inputHandler.js");
const { clonePushTemplate } = require("./gitShell.js");
const { AuthType } = require("./auth.js");

async function createRepo(octokit, authType, githubUrl, repo, repoTemplate) {
  // if repo_template then create repo, make it private then switch visibility to what the user selected
  const hasRepoTemplate = repoTemplate.org != "" && repoTemplate.repo != "";
  if (!repoTemplate.clone_push && hasRepoTemplate) {
    core.info(`Creating repo "${repo.org}/${repo.repo} from template ${repoTemplate.org}/${repoTemplate.repo}"`);
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

    if (repoTemplate.clone_push) {
      // get octokit token
      const type = authType == AuthType.APP ? { type: "app" } : {};
      const token = (await octokit.auth(type)).token;

      clonePushTemplate(
        token,
        githubUrl,
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
