const fse = require("fs-extra");
const chalk = require("chalk");
const util = require("../lib/util");

const desiredMode = 0o2775;
const options = {
  mode: 0o2775
};

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

const createPage = name => {
  if (name === null) return console.warn("--page name must be specified");
  const newPage = `${process.cwd()}/src/pages/${name}.json`;
  const template = {
    file: `/${name}.html`,
    layout: "main",
    partials: {},
    data: {}
  };
  const updatedConfig = util.getConfig();
  updatedConfig.pages[name] = name;

  fse
    .pathExists(newPage)
    .then(exists => {
      if (exists) throw `${newPage} already exists`;
    })
    .then(fse.writeFile(newPage, JSON.stringify(template, null, 4)))
    .then(util.updateConfig(updatedConfig))
    .then(res => {
      console.log(chalk.green(name, "was created!"));
      console.log(`run: statical compile`);
    })
    .catch(err => {
      console.warn(chalk.red(err));
      process.exit(1);
    });
};

module.exports = {
  site: function (kwargs) {
    if (kwargs.help) return this.printCommandGuide("create");
    if (kwargs.site !== null) return createSite(kwargs.site);
  },
  page: function (kwargs) {
    if (kwargs.help) return this.printCommandGuide("create");
    if (kwargs.page !== null) return createPage(kwargs.page);
  }
};