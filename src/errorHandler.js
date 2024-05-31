const core = require("@actions/core");

function fail(message, error) {
  // Your existing fail function code
  if (error) core.error(error);
  core.setFailed(message);
  process.exit();
}

module.exports = { fail };
