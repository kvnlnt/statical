// const site = require("../src/site.json");
// const util = require('./util');
// const cheerio = require('cheerio');

// const _compilePage = (page, p) => {
//     let template;
//     let partials;

//     const reifyPartials = (xs) => {
//         const files = util.readFiles(xs.map(x => x[1]));
//         return xs.map(x => [x[0], files[x]]);
//     };

//     const concat = () => {
//         Object.keys(partials).forEach(p => {
//             template(p).html(partials[p]);
//         });
//     };

//     const save = () => {
//         return util.writeFile(page, template.html());
//     };

//     const log = () => {
//         console.log(page, template.html());
//     };

//     util
//         .readFile(`./src/templates/${p.template}`)
//         .then(x => template = cheerio.load(x))
//         .then(xs => partials = reifyPartials(p.partials));
//     // .then(concat)
//     // .then(save)
//     // .then(log);
// };

// const compile = () => {
//     Object.keys(site.pages).forEach((k) => {
//         _compilePage(k, site.pages[k]);
//     });
// };

// const compilePage = (kwargs) => {
//     console.log("compilePage");
// };

// module.exports = {
//     compile: compile,
//     compilePage: compilePage
// };