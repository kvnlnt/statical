const util = require('util');
const fs = require("fs");

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
    toArray: toArray,
    writeFile: writeFile,
    readFile: readFile,
    readFiles: readFiles
}