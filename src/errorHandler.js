const core = require("@actions/core");

function error(message, error) {
  // Your existing fail function code
  if (error) core.error(error);
  core.setFailed(message);

  throw new Error(error || message);
}

module.exports = { error };
