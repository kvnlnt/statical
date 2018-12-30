const chalk = require("chalk");
const util = require("../lib/util");
const fse = require("fs-extra");

const getPageInfo = () => {
  const config = util.getConfig();
  console.log(chalk.magenta(`Pages (${config.pages.length})`));
  config.pages.forEach(i => {
    const pageConfig = JSON.parse(fse.readFileSync(`${process.cwd()}/${i}`));
    console.log(chalk.magenta("-"), i, chalk.magenta(">"), pageConfig.output);
  });
};

module.exports = function(kwargs) {
  if (kwargs.help) return this.printCommandGuide("info");
  if (kwargs.pages) getPageInfo();
};
