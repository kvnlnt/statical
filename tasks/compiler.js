const site = require("../src/site.json");
const util = require('./util');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

const _compilePage = (p) => {
    let template;
    let partials;
    util
        .readFile(`./src/templates/${p.template}`)
        .then(x => JSDOM.fragment(`${x}`))
        // .then(x => x.firstChild.outerHTML)
        .then(x => template = x)
        .then(x => util.readFiles(util.toArray(p.partials).map(i => `./src/partials/${i}`)))
        .then((xs) => {
            return Object.keys(p.partials).reduce((acc, curr, i) => {
                acc[curr] = xs[i]
                return acc;
            }, {});
        })
        .then(xs => partials = xs)
        .then(() => {
            console.log(template);
            console.log(partials);
        });


    // {
    //     let template = f.firstChild.outerHTML;
    //     util.readFiles(util.toArray(p.partials).map(i => `./src/partials/${i}`))
    //     .then(d => {
    //         const partials = Object.keys(p.partials).reduce((acc, curr, i) => {
    //             acc[curr] = d[i]
    //             return acc;
    //         }, {});
    //         console.log(partials);
    //     });
    // }

    //     .then(d => {
    //         util.writeFile(`./public/${p}`, d)
    //     });
    // util.readFiles(util.toArray(p.partials).map(i => `./src/partials/${i}`)).then(d => {
    //     const partials = Object.keys(p.partials).reduce((acc, curr, i) => {
    //         acc[curr] = d[i]
    //         return acc;
    //     }, {});
    //     console.log(partials);
    // });
    // const partials = Object.keys(p.partials).reduce((acc, curr) => {
    //     acc[curr] = util.readFile(curr);
    //     return acc;
    // }, {})
    // console.log(partials);
    // util.readFile()
    //     .then(d => {
    //         util.writeFile(`./public/${p}`, d)
    //     });
};

const compile = () => {
    util.toArray(site.pages).forEach(_compilePage);
};

const compilePage = (kwargs) => {
    console.log("compilePage");
};

module.exports = {
    compile: compile,
    compilePage: compilePage
};