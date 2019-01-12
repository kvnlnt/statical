const fse = require("fs-extra");
const Handlebars = require("handlebars");
const cheerio = require("cheerio");
const util = require("../lib/util");
const chalk = require("chalk");
const srcDir = `${process.cwd()}`;
const config = util.getConfig();

const compilePartials = async (template, partials, data = {}) => {
  for (let i = 0; i < partials.length; i++) {
    let partial = partials[i];
    data = Object.assign(data, partial.data);
    partial.source = await util.readFile(`${srcDir}/${partial.source}`);
    let html = Handlebars.compile(partial.source)(data);
    template(partial.element).append(html);
  }
  return template;
};

const concatData = async page => {
  let data = {
    ...(config.data || {}),
    ...page.params
  };
  for (const f in page.data) {
    const file = `${srcDir}/data/${page.data[f]}.json`;
    const d = await util.readFile(file);
    data = Object.assign(data, JSON.parse(d));
  }
  return data;
};

const compilePage = async (o, dir = config.build) => {
  const tsStart = process.hrtime();
  const output = `${process.cwd()}/${dir}/${o.output}`;
  const data = {
    global: config.data
  };
  return util
    .readFile(`${srcDir}/${o.layout}`)
    .then(fse.ensureFile(output))
    .then(t => cheerio.load(t, { decodeEntities: false }))
    .then(t => compilePartials(t, o.partials, data))
    .then(t => (o._template = t))
    .then(x => Handlebars.compile(o._template.html())(data))
    .then(x => util.writeFile(output, o._template.html()))
    .then(x => process.hrtime(tsStart))
    .then(x => {
      const tsEnd = chalk.grey(`${util.hrTimeToMil(x)}ms`);
      console.info(chalk.green("compiled"), `${dir}/${o.output} ${tsEnd}`);
    })
    .catch(util.onError);
};

const compileSite = async (dir = "public") => {
  const tsStart = process.hrtime();
  await fse.ensureDir(`${process.cwd()}/${dir}`);
  for (let i = 0; i < config.pages.length; i++) {
    const page = config.pages[i];
    const p = JSON.parse(await util.readFile(`${srcDir}/${page}`));
    await compilePage(p);
  }
  const tsEnd = process.hrtime(tsStart);
  console.info(chalk.grey(`\u23F1 ${util.hrTimeToMil(tsEnd)}ms`));
};

module.exports = function(kwargs = {}) {
  if (kwargs.help) return this.printCommandGuide("compile");
  if (kwargs.site === false && kwargs.page === false) return compileSite();
  if (kwargs.site) return compileSite(config.build);
  if (kwargs.page) {
    const page = config.pages.filter(i => i === `${kwargs.page}.json`);
    if (!page) return util.onError(`Page "${kwargs.page}" not found`);
    const p = JSON.parse(fse.readFileSync(`${srcDir}/${page}`));
    return compilePage(p, config.build);
  }
};
