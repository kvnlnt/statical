const fse = require('fs-extra');
const cheerio = require('cheerio');
const util = require('../lib/util');
const config = JSON.parse(fse.readFileSync(`${process.cwd()}/src/config.json`, 'utf-8'));
const chalk = require("chalk");

const onError = err => {
    console.warn(chalk.red(err));
    process.exit(1);
};

const insertPartialContents = async (template, partials) => {
    for (const p in partials) {
        const file = `${process.cwd()}/src/partials/${partials[p]}`;
        partials[p] = await util.readFile(file);
        template(p).html(partials[p]);
    }
    return template;
};

const page = (p, template = '') => {
    const _page = config.pages[p];
    util
        .readFile(`${process.cwd()}/src/templates/${_page.template}`)
        .then(templateFile => template = cheerio.load(templateFile))
        .then(template => insertPartialContents(template, _page.partials))
        .then(() => util.writeFile(`public/${p}`, template.html()))
        .then((xs) => console.log(templateString(template.html(), _page.data)))
        .catch(onError);
};

const site = () => Object.keys(config.pages).forEach(k => page(k));

module.exports = {
    site: site,
    page: page
};