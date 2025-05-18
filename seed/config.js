const path = require("path");

function getPathForJson(name) {
  return path.join(__dirname, '..', "SeedData", `${name}.json`);
}

module.exports = {getPathForJson}