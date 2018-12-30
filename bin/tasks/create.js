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
  const starterFolder = __dirname + "/../starter";

  fse
    .pathExists(newFolder)
    .then(exists => {
      if (exists) throw `${newFolder} already exists`;
    })
    .then(fse.ensureDir(newFolder, desiredMode))
    .then(fse.copy(starterFolder, newFolder))
    .then(res => {
      console.log(chalk.green(name, "was created!"));
      console.log(`run: statical compile`);
    })
    .catch(err => {
      console.warn(chalk.magenta(err));
      process.exit(1);
    });
};

const createPage = (name = "new", dir = "/") => {
  const config = util.getConfig();
  dir = dir || "/";
  const newPage = `${process.cwd()}${dir}${name}.json`;
  const template = {
    output: `${name}.html`,
    layout: "templates/main.html",
    partials: []
  };
  config.pages.push(`${name}.json`);
  fse
    .pathExists(newPage)
    .then(exists => {
      if (exists) throw `${newPage} already exists`;
    })
    .then(fse.writeFile(newPage, JSON.stringify(template, null, 4)))
    .then(util.updateConfig(config))
    .then(res => {
      console.log(chalk.green(name, "was created!"));
      console.log(`run: statical compile`);
    })
    .catch(err => {
      console.warn(chalk.magenta(err));
      process.exit(1);
    });
};

module.exports = {
  site: function(kwargs) {
    if (kwargs.help) return this.printCommandGuide("create");
    if (kwargs.site !== null) return createSite(kwargs.site);
  },
  page: function(kwargs) {
    if (kwargs.help) return this.printCommandGuide("create");
    if (kwargs.page === null || kwargs.page === true)
      return console.warn(
        chalk.magenta("Error"),
        "--page name must be specified"
      );
    if (kwargs.page !== null) return createPage(kwargs.page, kwargs.dir);
  }
};
