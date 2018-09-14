const util = require('util');
const fs = require("fs");
const chalk = require("chalk");

const onError = err => {
    console.warn(chalk.red(err));
    process.exit(1);
};

const log = (label, msg) => {
    console.log(chalk.green(label), chalk.white(msg));
};

const readFile = async (f) => {
    return await util.promisify(fs.readFile)(f, 'utf-8');
};

const readFiles = async (list) => {
    return await Promise.all(list.map(readFile));
};

const toArray = (o) => {
    return Object.keys(o).reduce((acc, curr) => {
        acc.push(o[curr]);
        return acc;
    }, []);
};

const writeFile = async (f, d) => {
    return await util.promisify(fs.writeFile)(f, d);
};

module.exports = {
    log: log,
    onError: onError,
    toArray: toArray,
    writeFile: writeFile,
    readFile: readFile,
    readFiles: readFiles
}