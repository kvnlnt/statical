#!/usr/bin/env node

const cli = require("@kvnlnt/spawn-cli");
const chalk = require("chalk");
const clean = require("./tasks/clean");
const compile = require("./tasks/compile");
const create = require("./tasks/create");
const remove = require("./tasks/remove");
const info = require("./tasks/info");
const watch = require("./tasks/watch");
const fse = require("fs-extra");
const isLocalFile = fse.existsSync(`${process.cwd()}/src/config.json`);
const header = `
${chalk.red("Statical")}
${chalk.dim("The Radical Static Site Generator")}`;

// setup
cli.header(header).themeColor("red");

// commands
if (!isLocalFile) {
  cli
    .command("create", "create new site")
    .argument("site", "s", "site name", "mysite.com")
    .callback(create.site);
} else {
  cli
    .command("create", "create new page")
    .argument("page", "p", "page name", "example")
    .callback(create.page);

  cli
    .command("remove", "remove page")
    .argument("page", "p", "page name", "example")
    .callback(remove.page);
}

cli
  .command("compile", "compile site or page")
  .argument("site", "s", "site (default)", false)
  .argument("page", "p", "page name", false)
  .callback(compile);

cli.command("clean", "remove old files").callback(clean);

// cli
// .command("test", "checks for missing stuff")
// .argument("page", "p", "page name", false)
// .callback(compile.site);

cli
  .command("info", "site info")
  .argument("pages", "p", "pages info", false)
  .callback(info);

cli.command("watch", "watch src and autocompile").callback(watch);
cli.command("help", "Prints help").callback(cli.printGuide.bind(cli));

// examples
cli.example("statical new --site=newsite.com", "scaffolds out new site");
cli.example("statical compile", "compiles entire site");
cli.example("statical compile --page=about", "compiles about page");
cli.example("statical test", "tests site for missing data");
cli.example("statical test --page=about", "tests about page for missing data");
cli.example("statical watch", "watch files for changes");

// boot
cli.defaultCommand("help").start();