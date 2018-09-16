const fse = require("fs-extra");
const cheerio = require("cheerio");
const util = require("../lib/util");
const Handlebars = require("handlebars");
const chalk = require("chalk");

const insertPartialContents = async (template, partials) => {
  for (const p in partials) {
    const file = `${process.cwd()}/src/partials/${partials[p]}`;
    partials[p] = await util.readFile(file);
    template(p).html(partials[p]);
  }
  return template;
};

const concatData = async dataFiles => {
  let data = {};
  for (const f in dataFiles) {
    const file = `${process.cwd()}/src/data/${dataFiles[f]}`;
    const d = await util.readFile(file);
    data = Object.assign(data, JSON.parse(d));
  }
  return data;
};

const compilePage = async (o, dir = util.getConfig().buildDir) => {
  const tsStart = process.hrtime();
  return util
    .readFile(`${process.cwd()}/src/templates/${o.template}`)
    .then(t => cheerio.load(t))
    .then(t => insertPartialContents(t, o.partials))
    .then(t => (o._template = t))
    .then(x => concatData(o.data))
    .then(d => (o._data = d))
    .then(fse.ensureFile(`${process.cwd()}/${dir}/${o.file}`))
    .then(x => Handlebars.compile(o._template.html())(o._data))
    .then(s => util.writeFile(`${process.cwd()}/${dir}/${o.file}`, s))
    .then(x => process.hrtime(tsStart))
    .then(x => {
      const tsEnd = chalk.grey(`${util.hrTimeToMil(x)}ms`);
      console.info(`${o.file} ${tsEnd}`);
    })
    .catch(util.onError);
};

const compileSite = async () => {
  const tsStart = process.hrtime();
  await fse.ensureDir(`${process.cwd()}/public`);
  const config = util.getConfig();
  for (let k in config.pages) {
    const p = config.pages[k];
    p.data = [...config.global.data, ...p.data];
    await compilePage(p);
  }
  const tsEnd = process.hrtime(tsStart);
  console.info(chalk.grey(`\u23F1 ${util.hrTimeToMil(tsEnd)}ms`));
};

module.exports = (kwargs = {}) => {
  if (kwargs.site === false && kwargs.page === false) return compileSite();
  if (kwargs.site) return compileSite();
  if (kwargs.page) {
    const config = util.getConfig();
    const page = config.pages[kwargs.page];
    if (!page) return util.onError(`Page "${kwargs.page}" not found`);
    return compilePage(page);
  }
};
