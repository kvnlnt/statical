const util = require("util");
const fs = require("fs");
const chalk = require("chalk");
const fse = require("fs-extra");

const onError = err => {
  console.warn(chalk.red(err));
  process.exit(1);
};

const getConfig = () => {
  const defConf = {};
  defConf.global = {};
  defConf.global.data = [];
  const configFile = `${process.cwd()}/src/config.json`;
  const config = fse.readFileSync(configFile, "utf-8");
  const configParsed = JSON.parse(config);
  const configFix = Object.assign(defConf, configParsed);
  return configFix;
};

const log = (label, msg) => {
  console.log(chalk.green(label), chalk.white(msg));
};

const readFile = async f => {
  return await util.promisify(fs.readFile)(f, "utf-8");
};

const readFiles = async list => {
  return await Promise.all(list.map(readFile));
};

const toArray = o => {
  return Object.keys(o).reduce((acc, curr) => {
    acc.push(o[curr]);
    return acc;
  }, []);
};

const hrTimeToMil = (hrTime, precision = 2) => {
  const secondsToMil = hrTime[0] * 1000;
  const milToMil = hrTime[1] / 1000000;
  return (secondsToMil + milToMil).toFixed(precision);
};

const writeFile = async (f, d) => {
  return await util.promisify(fs.writeFile)(f, d);
};

module.exports = {
  getConfig: getConfig,
  hrTimeToMil: hrTimeToMil,
  log: log,
  onError: onError,
  readFile: readFile,
  readFiles: readFiles,
  toArray: toArray,
  writeFile: writeFile
};
