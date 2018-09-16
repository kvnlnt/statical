const chalk = require("chalk");
const util = require("../lib/util");
const fs = require("fs");
const compile = require("./compile");

const handleFileChange = (evt, filename) => {
  const config = util.getConfig();
  const templateChanged = filename.indexOf("templates/") === 0;
  const partialsChanged = filename.indexOf("partials/") === 0;
  const dataChanged = filename.indexOf("data/") === 0;

  // individual pages
  Object.keys(config.pages).forEach(p => {
    if (templateChanged) {
      if (config.pages[p].template === filename.replace("templates/", "")) {
        compile({ page: p });
      }
    }
    if (partialsChanged) {
      Object.keys(config.pages[p].partials).forEach(pp => {
        if (
          config.pages[p].partials[pp] === filename.replace("partials/", "")
        ) {
          compile({ page: p });
        }
      });
    }
    if (dataChanged) {
      if (config.pages[p].data.indexOf(filename.replace("data/", "")) > -1) {
        compile({ page: p });
      }
    }
  });

  // if global data is updated, recompile site
  if (config.global.data.indexOf(filename.replace("data/", "")) > -1) {
    compile({ site: true });
  }
};

module.exports = kwargs => {
  fs.watch(`${process.cwd()}/src`, { recursive: true }, handleFileChange);
};
