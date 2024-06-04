const fs = require("fs");
const os = require("os");
const { execFileSync } = require("node:child_process");
const core = require("@actions/core");

// get token from app
// create temp dir
// clone repo into temp dir with app token
// set remote to new repo
// push code to new repo
// remove temp dir

// will have as many commits as the template repo, if we do depth 1 then mirror push wont work
function clonePushTemplate(token, githubUrl, org, repo, repoTemplateOrg, repoTemplateRepo, includeAllBranches) {
  // if we want all branches, use --bare
  const cloneArg = includeAllBranches ? "--bare" : "";

  try {
    // create temp dir
    const tmpdir = fs.mkdtempSync(os.tmpdir());
    // construct clone dir
    const clonedDir = os.path.join(tmpdir, `${repoTemplateRepo}`);

    core.info(`Cloning template repo (${repoTemplateOrg}/${repoTemplateRepo})`);
    // set the output directory to resolve difference between normal and --bare clone (${repoTemplateName} vs ${repoTemplateName}.git)
    execFileSync(
      `git clone ${cloneArg} --no-tags https://x-access-token:${token}@${githubUrl}/${repoTemplateOrg}/${repoTemplateRepo}.git ${repoTemplateRepo}`,
      {
        cwd: tmpdir,
      }
    );

    core.info(`Push template repo to ${org}/${repo}`);
    execFileSync(`git push --mirror https://x-access-token:${token}@${githubUrl}/${org}/${repo}.git`, {
      cwd: clonedDir,
    });
    fs.rmdirSync(tmpdir);
  } catch (error) {
    core.error(error);
  }
}

module.exports = {
  clonePushTemplate,
};
