const core = require("@actions/core");

function error(message = "Unhandled exception", err = "") {
  // Your existing fail function code
  if (err) core.error(err);
  core.setFailed(message);

  throw new Error(err || message);
}

module.exports = { error };
