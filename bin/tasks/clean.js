const chalk = require("chalk");
const util = require("../lib/util");
const fse = require("fs-extra");

const clean = (dir = "public") => {
  const config = util.getConfig();
  config.pages.forEach(p => {
    const tsStart = process.hrtime();
    const page = JSON.parse(fse.readFileSync(`${process.cwd()}/${p}`)).output;
    if (fse.existsSync(`${process.cwd()}/${dir}/${page}`)) {
      fse.unlinkSync(`${process.cwd()}/${dir}/${page}`);
    }
    const tsEnd = chalk.grey(`${util.hrTimeToMil(process.hrtime(tsStart))}ms`);
    console.log(chalk.magenta("removed"), `${dir}/${page} ${tsEnd}`);
  });
};

module.exports = function(kwargs) {
  if (kwargs.help) return this.printCommandGuide("clean");
  const config = util.getConfig();
  clean(config.build);
};
