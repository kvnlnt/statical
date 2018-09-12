#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const compiler = require("./tasks/compiler");

cli.header(chalk.green("\nSTATICAL"));

cli.command("compile", "build site")
    .callback(compiler.compile);

cli.example("hello --firstName=Fred --lastName=Flinstone", "Print out hello")
    .command("compile:page", "build page")
    .argument("page", "p", "page to build")
    .callback(compiler.compilePage);

cli.command("create", "create site")
    .callback(compiler.compile);

cli.example("build-page --page=home", "compiles home page")
    .command("help", "Prints help")
    .callback(cli.printGuide.bind(cli));

cli.defaultCommand('help')
    .start();