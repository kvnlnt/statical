const chalk = require("chalk");
const util = require("../lib/util");
const fs = require("fs");
const compile = require("./compile");
const chokidar = require("chokidar");

const normalizePath = p => p.replace(/[\/\\]/g, "/");

const createWatchFileList = () => {
  const fileAssembly = [];
  const config = util.getConfig();
  Object.keys(config.pages).forEach(i => {
    const pageConfig = util.getPageConfig(config.pages[i]);
    const pageFiles = [
      `${process.cwd()}/data/_global.json`,
      `${process.cwd()}/pages/${i}.json`,
      ...Object.keys(pageConfig.partials).map(
        i =>
          `${process.cwd()}/templates/partials/${pageConfig.partials[i]}.html`
      ),
      `${process.cwd()}/templates/layouts/${pageConfig.layout}.html`,
      ...pageConfig.data.map(i => `${process.cwd()}/data/${i}.json`)
    ];
    fileAssembly.push({
      page: i,
      files: pageFiles.map(i => normalizePath(i))
    });
  });
  return fileAssembly;
};

const handleFileChange = (fa, config, filename) => {
  const normalizedPathing = filename.replace(/[\/\\]/g, "/");
  console.log(chalk.magenta("changed"), filename);
  fa.forEach(i => {
    if (i.files.indexOf(normalizedPathing) > -1)
      compile({
        page: i.page
      });
  });
};

module.exports = function(kwargs) {
  if (kwargs.help) return this.printCommandGuide("watch");
  const wfl = createWatchFileList();
  const config = util.getConfig();
  var watcher = chokidar.watch(`${process.cwd()}`);
  watcher.on("change", handleFileChange.bind(this, wfl, config));
};
