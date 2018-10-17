const chalk = require("chalk");
const util = require("../lib/util");
const fse = require("fs-extra");
const compile = require("./compile");

const clean = (dir = "public") => {
  const config = util.getConfig();
  Object.keys(config.pages).forEach(p => {
    const tsStart = process.hrtime();
    const page = JSON.parse(fse.readFileSync(`${process.cwd()}/src/pages/${config.pages[p]}.json`)).file;
    if (fse.existsSync(`${process.cwd()}/${dir}/${page}`)) {
      fse.unlinkSync(`${process.cwd()}/${dir}/${page}`);
      const tsEnd = chalk.grey(`${util.hrTimeToMil(process.hrtime(tsStart))}ms`);
      console.log(chalk.red('removed'), `${dir}/${page} ${tsEnd}`);
    }
  });
  compile({
    site: false,
    page: false
  });
};

module.exports = function (kwargs) {
  if (kwargs.help) return this.printCommandGuide("clean");
  const config = util.getConfig();
  clean(config.buildDir);
};