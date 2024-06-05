const core = require("@actions/core");

async function repoExists(octokit, org, repo) {
  return await octokit
    .request("GET /repos/{owner}/{repo}", {
      owner: org,
      repo: repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(() => {
      core.debug(`Repository exists.`);
      return true;
    })
    .catch((error) => {
      core.debug(error);
      if (error.status == 404) {
        core.debug(`Repository does not exist.`);
        return false;
      } else {
        core.info("Some other error occurred when trying to fetch repository");
        throw error;
      }
    });
}

async function createOrgRepo(octokit, org, repo, description, visibility) {
  await octokit.request("POST /orgs/{org}/repos", {
    org: org,
    name: repo,
    description: description,
    visibility: visibility,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function createRepoFromTemplate(octokit, org, repo, templateOrg, templateRepo, description, includeBranches) {
  await octokit.request("POST /repos/{template_owner}/{template_repo}/generate", {
    template_owner: templateOrg,
    template_repo: templateRepo,
    owner: org,
    name: repo,
    description: description,
    include_all_branches: includeBranches,
    private: true,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

async function updateRepoVisibility(octokit, org, repo, visibility) {
  await octokit.request("PATCH /repos/{owner}/{repo}", {
    owner: repo,
    repo: org,
    visibility: visibility,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
}

module.exports = { repoExists, createOrgRepo, createRepoFromTemplate, updateRepoVisibility };
