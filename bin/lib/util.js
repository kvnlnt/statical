const util = require("util");
const fs = require("fs");
const chalk = require("chalk");
const fse = require("fs-extra");

const onError = err => {
  console.warn(`${chalk.red("ERROR")} ${err}`);
  process.exit(1);
};

const getConfig = () => {
  const configFile = `${process.cwd()}/src/config.json`;
  if (!fse.existsSync(configFile)) return onError("This isn't a Statical Site.");
  const config = fse.readFileSync(configFile, "utf-8");
  const configParsed = JSON.parse(config);
  return configParsed;
};

const updateConfig = (obj) => {
  const configFile = `${process.cwd()}/src/config.json`;
  if (!fse.existsSync(configFile)) return onError("This isn't a Statical Site.");
  fse.writeFileSync(configFile, JSON.stringify(obj, null, 4));
  return true;
};

const fileExists = async f => {
  return await util.promisify(fs.exists)(f, "utf-8");
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
  fileExists: fileExists,
  log: log,
  onError: onError,
  readFile: readFile,
  readFiles: readFiles,
  toArray: toArray,
  updateConfig: updateConfig,
  writeFile: writeFile
};