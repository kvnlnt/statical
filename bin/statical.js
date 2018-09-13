#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const compiler = require("./tasks/compiler");
const createSite = require("./tasks/createSite");

const header = `
${chalk.red("STATICAL")}
${chalk.italic("The Radical Static Site Generator")}`;

cli
    .header(header)
    .themeColor("red");

cli.command("createSite", "create new site")
    .argument("name", "n", "site name")
    .callback(createSite);

// cli.command("compile", "build site")
//     .callback(compiler.compile);

// cli.command("compile:page", "build page")
//     .argument("page", "p", "page to build")
//     .callback(compiler.compilePage);



// cli.command("createPage", "create new page")
//     .callback(compiler.compile);

cli
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

cli.defaultCommand('help')
    .start();