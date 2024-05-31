const core = require("@actions/core");
const { createOrgRepo, createRepoFromTemplate, updateRepoVisibility } = require("./githubApi.js");
const { Visibility } = require("./inputHandler.js");

async function createRepo(octokit, repo, repoTemplate) {
  // if repo_template then create repo, make it private then switch visibility to what the user selected
  if (repoTemplate.org != "" && repoTemplate.repo != "") {
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
  }
}

module.exports = { createRepo };
