const site = require("../src/site.json");
const util = require('./util');
const cheerio = require('cheerio');

const _compilePage = (page, p) => {
    let template;
    let partials;

    const serializePartials = (xs) => {
        return Object.keys(p.partials).reduce((acc, curr, i) => {
            acc[curr] = `${xs[i]}`;
            return acc;
        }, {});
    };

    const interpolate = () => {
        Object.keys(partials).forEach(p => {
            template(p).html(partials[p]);
        });
    };

    const save = () => {
        return util.writeFile(page, template.html());
    };

    const log = () => {
        console.log(page, template.html());
    };

    util
        .readFile(`./src/templates/${p.template}`)
        .then(x => template = cheerio.load(x))
        .then(x => util.readFiles(util.toArray(p.partials).map(i => `./src/partials/${i}`)))
        .then(xs => partials = serializePartials(xs))
        .then(interpolate)
        .then(save)
        .then(log);
};

const compile = () => {
    Object.keys(site.pages).forEach((k) => {
        _compilePage(k, site.pages[k]);
    });
};

const compilePage = (kwargs) => {
    console.log("compilePage");
};

module.exports = {
    compile: compile,
    compilePage: compilePage
};