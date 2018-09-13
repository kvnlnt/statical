#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const compiler = require("./tasks/compiler");

const header = `
${chalk.red("STATICAL")}
${chalk.italic("The Radical Static Site Generator")}`;

cli
    .header(header)
    .themeColor("red");

cli.command("compile", "build site")
    .callback(compiler.compile);

cli.command("compile:page", "build page")
    .argument("page", "p", "page to build")
    .callback(compiler.compilePage);

cli.command("createSite", "create new site")
    .callback(compiler.compile);

cli.command("createPage", "create new page")
    .callback(compiler.compile);

cli.example("build-page --page=home", "compiles home page")
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

cli.defaultCommand('help')
    .start();