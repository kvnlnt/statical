const chalk = require("chalk");
const util = require("../lib/util");
const fse = require("fs-extra");
const compile = require("./compile");

const clean = (dir = "public") => {
  const config = util.getConfig();
  Object.keys(config.pages).forEach(p => {
    const page = config.pages[p].file;
    if (fse.existsSync(`${process.cwd()}/${dir}/${page}`)) {
      fse.unlinkSync(`${process.cwd()}/${dir}/${page}`);
      console.log(`${dir}/${page} removed`);
    }
  });
};

module.exports = kwargs => {
  const config = util.getConfig();
  clean(config.buildDir);
};
