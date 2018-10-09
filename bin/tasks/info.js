const chalk = require("chalk");
const util = require("../lib/util");

const getPageInfo = () => {
  const config = util.getConfig();
  console.log(chalk.red(`Pages (${Object.keys(config.pages).length})`));
  console.log(Object.keys(config.pages).join('\n'));
};

module.exports = kwargs => {
  if (kwargs.pages) getPageInfo();
};