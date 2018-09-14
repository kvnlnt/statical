#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const compile = require("./tasks/compile");
const create = require("./tasks/create");
const fse = require('fs-extra');
const isLocalFile = fse.existsSync(`${process.cwd()}/src/config.json`);
const header = `
${chalk.red("STATICAL")}
${chalk.italic("The Radical Static Site Generator")}`;


cli
    .header(header)
    .themeColor("red");

if(!isLocalFile) {
    cli.command("create:site", "create new site")
    .argument("name", "n", "site name")
    .callback(create.site);
}

cli.command("compile:site", "compile entire site")
    .callback(compile.site);

// cli.command("compile:page", "build page")
//     .argument("page", "p", "page to build")
//     .callback(compile.compilePage);

// cli.command("createPage", "create new page")
//     .callback(compile.compile);

cli
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

cli.defaultCommand('help')
    .start();