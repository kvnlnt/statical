const chalk = require("chalk");
const util = require("../lib/util");
const fs = require("fs");
const compile = require("./compile");

const getPageInfo = () => {
  const config = util.getConfig();
  console.log(`Pages (${Object.keys(config.pages).length})`);
  Object.keys(config.pages).forEach(p => {
    const pageConfig = config.pages[p];
    console.log(p);
  });
};

module.exports = kwargs => {
  if (kwargs.pages) getPageInfo();
};
