const chalk = require("chalk");
const util = require("../lib/util");
const fs = require("fs");
const compile = require("./compile");

const handleFileChange = (evt, filename) => {
  compile({ site: true });
  console.log(evt, filename);
};

module.exports = kwargs => {
  fs.watch(`${process.cwd()}/src`, { recursive: true }, handleFileChange);
};
