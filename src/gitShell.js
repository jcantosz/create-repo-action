const fs = require("fs");
const os = require("os");
const { execSync } = require("node:child_process");
const path = require("node:path");
const core = require("@actions/core");
const { error } = require("./errorHandler.js");

function isHttpUrl(url) {
  return url.protocol === "http:" || url.protocol === "https:";
}

function isValidPathValue(value) {
  // The repository name can only contain ASCII letters, digits, and the characters ., -, and _.
  // Organizations may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.
  // using the more permissive of the two
  return value.match(/^[a-zA-Z0-9_.-]+$/) != null;
}

// handle git clone
function gitClone(host, repo, includeAllBranches, workingDir, outputDir) {
  // if we want all branches, use --bare
  const cloneArg = includeAllBranches ? "--bare" : "";
  const url = new URL(`${repo.org}/${repo.repo}.git`, host);

  core.info(`Cloning repo (${repo.org}/${repo.repo})`);
  // set the output directory to resolve difference between normal and --bare clone (${repoTemplateName} vs ${repoTemplateName}.git)
  execSync(`git clone ${cloneArg} --no-tags ${url.href} ${outputDir}`, {
    cwd: workingDir,
  });
}

// handle git push
function gitPush(host, repo, workingDir) {
  const url = new URL(`${repo.org}/${repo.repo}.git`, host);

  core.info(`Push template repo to ${repo.org}/${repo.repo}`);
  execSync(`git push --mirror ${url.href}`, {
    cwd: workingDir,
  });
}

function clonePush(token, url, sourceRepo, destRepo, includeAllBranches) {
  try {
    const runnerTemp = process.env["RUNNER_TEMP"] || os.tmpdir();
    core.debug(`Runner temp set to ${runnerTemp}, OS temp: ${os.tmpdir()}`);
    const tmpdir = fs.mkdtempSync(runnerTemp);
    const clonedDir = path.join(tmpdir, `${sourceRepo.repo}`);
    // Should we add the pathname back in? If they have a reverse proxy and do path based routing, maybe. For now, not worrying about it
    const hostWithAuth = `${url.protocol}//x-access-token:${token}@${url.host}`;

    core.info(`Cloning template repo`);
    gitClone(hostWithAuth, sourceRepo, includeAllBranches, tmpdir, clonedDir);
    core.info(`Pushing to empty repo`);
    gitPush(hostWithAuth, destRepo, clonedDir);

    fs.rmSync(tmpdir, { recursive: true, force: true });
  } catch (err) {
    error(err);
  }
}

// will have as many commits as the template repo, if we do depth 1 then mirror push wont work
function clonePushTemplate(token, githubUrl, org, repo, repoTemplateOrg, repoTemplateRepo, includeAllBranches) {
  // Will error if not a valid url
  core.debug("Preparing to clone, validating inputs.");
  const url = new URL(githubUrl);

  let validPaths = true;
  for (const pathValue of [org, repo, repoTemplateOrg, repoTemplateRepo]) {
    const validPath = isValidPathValue(pathValue);
    core.debug(`Validating path component ${pathValue} (valid: ${validPath})`);
    validPaths = validPaths && validPath;
  }

  core.debug(`Validing if URL ${url} is http/https (valid: ${isHttpUrl(url)})`);
  if (!isHttpUrl(url) || !validPaths) {
    error("Please enter a valid url and org/repo names");
  } else {
    const sourceRepo = { org: repoTemplateOrg, repo: repoTemplateRepo };
    const destRepo = { org: org, repo: repo };
    clonePush(token, url, sourceRepo, destRepo, includeAllBranches);
  }
}

module.exports = {
  clonePushTemplate,
};
