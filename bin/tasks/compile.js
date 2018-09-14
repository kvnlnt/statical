const fse = require('fs-extra');
const cheerio = require('cheerio');
const util = require('../lib/util');
const Handlebars = require("handlebars");
const chalk = require("chalk");

const defaultConfig = {
    global:{
        data:[]
    }
};

const siteConfig = `${process.cwd()}/src/config.json`;
const getConfig = () => Object.assign(defaultConfig, JSON.parse(fse.readFileSync(siteConfig, 'utf-8')));

const insertPartialContents = async (template, partials) => {
    for (const p in partials) {
        const file = `${process.cwd()}/src/partials/${partials[p]}`;
        partials[p] = await util.readFile(file);
        template(p).html(partials[p]);
    }
    return template;
};

const concatData = async (dataFiles) => {
    let data = {};
    for (const f in dataFiles) {
        const file = `${process.cwd()}/src/data/${dataFiles[f]}`;
        const d = await util.readFile(file);
        data = Object.assign(data, JSON.parse(d));
    }
    return data;
};

const page = async (o) =>  util
        .readFile(`${process.cwd()}/src/templates/${o.template}`)
        .then(t => cheerio.load(t))
        .then(t => insertPartialContents(t, o.partials))
        .then(t => o._template = t)
        .then(x => concatData(o.data))
        .then(d => o._data = d)
        .then(x => Handlebars.compile(o._template.html())(o._data))
        .then(s => util.writeFile(`${process.cwd()}/public/${o.file}`, s))
        .then(x => util.log("\u2713", `${o.file} compiled`))
        .catch(util.onError);

const site = async () => {
    console.time('\u23F1');
    const config = getConfig();
    for(let k in config.pages){
        const p = config.pages[k];
        p.data = [...config.global.data, ...p.data];
        await page(p);
    }
    console.timeEnd('\u23F1');
}

module.exports = {
    site: site,
    page: page
};