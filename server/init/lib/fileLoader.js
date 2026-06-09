const fs = require("fs");

function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function loadJsonFile(filePath) {
  return JSON.parse(readTextFile(filePath));
}

module.exports = {
  loadJsonFile,
  readTextFile,
};
