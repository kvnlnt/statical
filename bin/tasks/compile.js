const fse = require("fs-extra");
const cheerio = require("cheerio");
const util = require("../lib/util");
const Handlebars = require("handlebars");
const chalk = require("chalk");
const glob = require("glob");
const srcDir = `${process.cwd()}/src`;
const includesDir = `${srcDir}/templates/partials/includes`;
const files = glob.sync(`${includesDir}/**/*.*`);

files.forEach(i => {
  const name = i.replace(includesDir + "/", "");
  const src = fse.readFileSync(i, "utf-8");
  Handlebars.registerPartial(name, src);
});

const insertPartialContents = async (template, partials) => {
  for (const p in partials) {
    const file = `${srcDir}/templates/partials/${partials[p]}.html`;
    partials[p] = await util.readFile(file);
    template(p).html(partials[p]);
  }
  return template;
};

const concatData = async page => {
  const globalDataExists = await util.fileExists(`${srcDir}/data/_global.json`);
  const globalData = JSON.parse(
    globalDataExists ? await util.readFile(`${srcDir}/data/_global.json`) : "{}"
  );
  let data = {
    ...globalData,
    ...page.params
  };
  for (const f in page.data) {
    const file = `${srcDir}/data/${page.data[f]}.json`;
    const d = await util.readFile(file);
    data = Object.assign(data, JSON.parse(d));
  }
  return data;
};

const compilePage = async (o, dir = "public") => {
  const tsStart = process.hrtime();
  return util
    .readFile(`${srcDir}/templates/layouts/${o.layout}.html`)
    .then(t => cheerio.load(t, { decodeEntities: false }))
    .then(t => insertPartialContents(t, o.partials))
    .then(t => (o._template = t))
    .then(x => concatData(o))
    .then(d => (o._data = d))
    .then(fse.ensureFile(`${process.cwd()}/${dir}/${o.file}`))
    .then(x => Handlebars.compile(o._template.html())(o._data))
    .then(s => util.writeFile(`${process.cwd()}/${dir}/${o.file}`, s))
    .then(x => process.hrtime(tsStart))
    .then(x => {
      const tsEnd = chalk.grey(`${util.hrTimeToMil(x)}ms`);
      console.info(chalk.green("compiled"), `${dir}/${o.file} ${tsEnd}`);
    })
    .catch(util.onError);
};

const compileSite = async (dir = "public") => {
  const tsStart = process.hrtime();
  await fse.ensureDir(`${process.cwd()}/${dir}`);
  const config = util.getConfig();
  for (let k in config.pages) {
    const p = JSON.parse(
      await util.readFile(`${srcDir}/pages/${config.pages[k]}.json`)
    );
    await compilePage(p, config.buildDir);
  }
  const tsEnd = process.hrtime(tsStart);
  console.info(chalk.grey(`\u23F1 ${util.hrTimeToMil(tsEnd)}ms`));
};

module.exports = function(kwargs = {}) {
  if (kwargs.help) return this.printCommandGuide("compile");
  if (kwargs.site === false && kwargs.page === false) return compileSite();
  if (kwargs.site) return compileSite(config.buildDir);
  if (kwargs.page) {
    const config = util.getConfig();
    const page = config.pages[kwargs.page];
    if (!page) return util.onError(`Page "${kwargs.page}" not found`);
    const p = JSON.parse(
      fse.readFileSync(`${srcDir}/pages/${config.pages[kwargs.page]}.json`)
    );
    return compilePage(p, config.buildDir);
  }
};
