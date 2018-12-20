#!/usr/bin/env node

const cli = require("@kvnlnt/spawn");
const chalk = require("chalk");
const clean = require("./tasks/clean");
const compile = require("./tasks/compile");
const create = require("./tasks/create");
const remove = require("./tasks/remove");
const info = require("./tasks/info");
const watch = require("./tasks/watch");
const fse = require("fs-extra");
const isLocalFile = fse.existsSync(`${process.cwd()}/src/statical.json`);
const header = `
${chalk.magenta("STATICAL")}
${chalk.dim("The Radical Static Site Generator")}`;

cli.header(header).themeColor("magenta");

if (!isLocalFile) {
  cli
    .command("create", "create new site")
    .argument("site", "s", "site name", "mysite.com")
    .argument("help", "h", "help", false)
    .callback(create.site)
    .example("statical create --s=newsite.com", "scaffolds new site");
} else {
  cli
    .command("create", "create new page")
    .argument("page", "p", "page name", "example")
    .argument("help", "h", "help", false)
    .callback(create.page)
    .example("statical create --p=newpage", "scaffolds new page");

  cli
    .command("remove", "remove page")
    .argument("page", "p", "page name", "example")
    .argument("help", "h", "help", false)
    .callback(remove.page)
    .example("statical remove --p=newpage", "removes page");
}

cli
  .command("compile", "compile site or page")
  .argument("site", "s", "site (default)", false)
  .argument("page", "p", "page name", false)
  .argument("help", "h", "help", false)
  .callback(compile)
  .example("statical compile --p=newpage", "compiles page");

cli
  .command("clean", "remove old files")
  .argument("help", "h", "help", false)
  .callback(clean)
  .example("statical clean");

cli
  .command("info", "site info")
  .argument("pages", "p", "pages info", false)
  .argument("help", "h", "help", false)
  .callback(info);

cli
  .command("watch", "watch src and autocompile")
  .argument("help", "h", "help", false)
  .callback(watch)
  .example("statical watch", "watch files for changes");

cli.command("help", "Prints help").callback(cli.printGuide);

// boot
cli.defaultCommand("help").run();
