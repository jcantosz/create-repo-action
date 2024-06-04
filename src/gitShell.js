const fs = require("fs");
const os = require("os");
const { execSync } = require("node:child_process");
const core = require("@actions/core");
const { error } = require("./errorHandler.js");

function isHttpUrl(url) {
  return url.protocol === "http:" || url.protocol === "https:";
}

function isValidPathValue(value) {
  // The repository name can only contain ASCII letters, digits, and the characters ., -, and _.
  // Organizations may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
  // using the more permissive of the two
  return value.match(/^[a-zA-Z_.-]+$/) != null;
}

// handle git clone
function gitClone(host, org, repo, includeAllBranches, workingDir, outputDir) {
  // if we want all branches, use --bare
  const cloneArg = includeAllBranches ? "--bare" : "";
  const url = new URL(`${org}/${repo}.git`, host);

  core.info(`Cloning template repo (${repoTemplateOrg}/${repoTemplateRepo})`);
  // set the output directory to resolve difference between normal and --bare clone (${repoTemplateName} vs ${repoTemplateName}.git)
  execSync(`git clone ${cloneArg} --no-tags ${url.href} ${outputDir}`, {
    cwd: workingDir,
  });
}

// handle git push
function gitPush(host, org, repo, workingDir) {
  const url = new URL(`${org}/${repo}.git`, host);

  core.info(`Push template repo to ${org}/${repo}`);
  execSync(`git push --mirror ${url.href}`, {
    cwd: workingDir,
  });
}

function clonePush(token, url, org, repo, repoTemplateOrg, repoTemplateRepo, includeAllBranches) {
  try {
    const tmpdir = fs.mkdtempSync(os.tmpdir());
    const clonedDir = os.path.join(tmpdir, `${repoTemplateRepo}`);
    // Should we add the pathname back in? If they have a reverse proxy and do path based routing, maybe. For now, not worrying about it
    const hostWithAuth = `${url.protocol}//x-access-token:${token}@${url.host}`;

    core.info(`Cloning template repo (${repoTemplateOrg}/${repoTemplateRepo})`);
    gitClone(hostWithAuth, repoTemplateOrg, repoTemplateRepo, includeAllBranches, workingDir, clonedDir);
    gitPush(hostWithAuth, org, repo, clonedDir);

    fs.rmdirSync(tmpdir);
  } catch (error) {
    error(error);
  }
}

// will have as many commits as the template repo, if we do depth 1 then mirror push wont work
function clonePushTemplate(token, githubUrl, org, repo, repoTemplateOrg, repoTemplateRepo, includeAllBranches) {
  // Will error if not a valid url
  const url = new URL(githubUrl);

  let validPaths = true;
  for (const pathValue of [org, repo, repoTemplateOrg, repoTemplateRepo]) {
    validPaths = validPaths && isValidPathValue(pathValue);
  }

  if (!isHttpUrl(url) || !validPaths) {
    error("Please enter a valid url and org/repo names");
  } else {
    clonePush(token, url, org, repo, repoTemplateOrg, repoTemplateRepo, includeAllBranches);
  }
}

module.exports = {
  clonePushTemplate,
};
