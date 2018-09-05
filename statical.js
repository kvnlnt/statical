#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const compiler = require("./tasks/compiler.js");

cli
    .header(chalk.green("\nSTATICAL"))
    .command("compile", "build site")
    .callback(compiler.compile)
    .example("hello --firstName=Fred --lastName=Flinstone", "Print out hello")
    .command("compile:page", "build page")
    .argument("page", "p", "page to build")
    .callback(compiler.compilePage)
    .example("build-page --page=home", "compiles home page")
    .command("help", "Prints help")
    .callback(cli.printCompactGuide.bind(cli))
    .defaultCommand('help')
    .start();