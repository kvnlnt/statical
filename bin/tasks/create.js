const fse = require("fs-extra");
const chalk = require("chalk");
const util = require("../lib/util");

const desiredMode = 0o2775;
const options = {
  mode: 0o2775
};

const createPage = () => {};

const createSite = name => {
  if (name === null) return console.warn("--site must be specified");
  const newFolder = `${process.cwd()}/${name}`;
  const templatesFolder = __dirname + "/../templates";

  fse
    .pathExists(newFolder)
    .then(exists => {
      if (exists) throw `${newFolder} already exists`;
    })
    .then(fse.ensureDir(newFolder, desiredMode))
    .then(fse.copy(templatesFolder, newFolder))
    .then(res => {
      console.log(chalk.green(name, "was created!"));
      console.log(`run: statical compile`);
    })
    .catch(err => {
      console.warn(chalk.red(err));
      process.exit(1);
    });
};

module.exports = kwargs => {
  if (kwargs.site !== null) return createSite(kwargs.site);
};
