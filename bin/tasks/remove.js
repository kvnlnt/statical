const chalk = require("chalk");
const util = require("../lib/util");
const fse = require("fs-extra");
const compile = require("./compile");

const removePage = name => {
  if (name === null || name === true)
    return console.warn("--page name must be specified");
  const dataFile = `${process.cwd()}/${name}.json`;
  const updatedConfig = util.getConfig();
  updatedConfig.pages = updatedConfig.pages.filter(i => i != `${name}.json`);

  fse
    .unlink(dataFile)
    .then(util.updateConfig(updatedConfig))
    .then(res => {
      console.log(chalk.green(name, "was removed"));
      console.log(`run: statical compile`);
    })
    .catch(err => {
      console.warn(chalk.magenta(err));
      process.exit(1);
    });
};

module.exports = {
  page: function(kwargs) {
    if (kwargs.help) return this.printCommandGuide("remove");
    if (kwargs.page !== null) return removePage(kwargs.page);
  }
};
