const fse = require('fs-extra');
const chalk = require("chalk");

const desiredMode = 0o2775;
const options = {
    mode: 0o2775
};

const site = (kwargs) => {
    if (kwargs.name === null) return console.warn("Name is required");
    const newFolder = `${process.cwd()}/${kwargs.name}`;
    const templatesFolder = __dirname + '/../templates';

    fse
        .pathExists(newFolder)
        .then(exists => {
            if (exists) {
                throw (`${newFolder} already exists`);
            }
        })
        .then(fse.ensureDir(newFolder, desiredMode))
        .then(fse.copy(templatesFolder, newFolder))
        .then(res => {
            console.log(chalk.green(kwargs.name, "was created!"));
            console.log(`run: statical compile`);
        })
        .catch(err => {
            console.warn(chalk.red(err));
            process.exit(1);
        });

};

module.exports = {
    site: site
};