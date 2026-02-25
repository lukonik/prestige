const { fs } = require("memfs");
const path = require("path");

function outputFile(file, data) {
  return new Promise((resolve, reject) => {
    try {
      outputFileSync(file, data);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function outputFileSync(file, data) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, data);
}

function pathExists(file) {
  return Promise.resolve(fs.existsSync(file));
}

function pathExistsSync(file) {
  return fs.existsSync(file);
}

function remove(file) {
  return new Promise((resolve) => {
    try {
      fs.rmSync(file, { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
    resolve();
  });
}

function mkdir(file, opts) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(file, opts);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  ...fs,
  outputFile,
  outputFileSync,
  pathExists,
  pathExistsSync,
  remove,
  mkdir
};
