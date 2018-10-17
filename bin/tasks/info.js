const chalk = require("chalk");
const util = require("../lib/util");

const getPageInfo = () => {
  const config = util.getConfig();
  console.log(chalk.red(`Pages (${Object.keys(config.pages).length})`));
  console.log(Object.keys(config.pages).join('\n'));
};

module.exports = function (kwargs) {
  if (kwargs.help) return this.printCommandGuide("info");
  if (kwargs.pages) getPageInfo();
};