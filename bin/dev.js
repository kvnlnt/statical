// imports
var async = require("async");
var browserSync = require("browser-sync").create();
var del = require('del');
var frontMatter = require('front-matter');
var fs = require('fs');
var sass = require('node-sass');
var packageJson = require('../package.json');
var swig = require('swig');
var uglifyCss = require("uglifyCss");
var uglifyJs = require("uglify-js");

// property
var property = packageJson.property;


var build = function(list, path, varControls, callback) {

    try {

        list.forEach(function(item) {

            var jstFile = path + item + ".jst";
            var ymlFile = path + item + ".yml";
            var jsFile = path + item + ".js";
            var sassFile = path + item + ".scss";
            var htmlFile = path + item + ".html";

            // compile
            fs.readFile(ymlFile, 'utf8', function(err, data) {
                if (err) throw err;
                var jsonData = frontMatter(data);
                var compiler = swig.compileFile(jstFile, { varControls: varControls, cache:false });
                var compiled = compiler({
                    property: property,
                    piece: jsonData.attributes
                });
                // console.log(compiled);
                fs.writeFileSync(htmlFile, compiled);
            });
        });

        callback(null, path);
        console.log('BUILD: ' + path);

    } catch (e) {

        console.log(e);

    }

};

var buildPieces = function(callback) {
    build(property.pieces, './src/pieces/', ['{{@piece', '}}'], callback);
};

var buildParts = function(callback) {

    // build(property.parts, './src/parts/', ['{{@part', '}}'], callback);

    try {

        property.parts.forEach(function(part) {

            var path = './src/parts/';
            var jstFile = path + part + ".jst";
            var ymlFile = path + part + ".yml";
            var jsFile = path + part + ".js";
            var sassFile = path + part + ".scss";
            var htmlFile = path + part + ".html";

            // switch var tags
            swig.setDefaults({ varControls: ['{{@part', '}}'], cache:false });

            // compile
            fs.readFile(ymlFile, 'utf8', function(err, data) {
                if (err) throw err;
                var jsonData = frontMatter(data);
                var compiler = swig.compileFile(jstFile);
                var compiled = compiler({
                    property: property,
                    part: jsonData.attributes
                });
                // console.log(compiled);
                fs.writeFileSync(htmlFile, compiled);
            });
        });

        callback(null, 'buildParts');
        console.log('BUILD: parts');

    } catch (e) {

        console.log(e);

    }

};

// // clean build
var clean = function(callback) {
    del(['./src/**/*.html'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        callback(null, 'clean');
    });
};

// rebuild on load
// clean();

var buildProperty = function() {
    async.series([ clean, buildPieces, buildParts ]);
};


// build properties
buildProperty();


// build javascript
// var buildJs = function() {
//     try {
//         var js = uglifyJs.minify(packageJson.config.js.files, { outSourceMap: "scripts.js.map" });
//         fs.writeFileSync(packageJson.config.js.output, js.code);
//         fs.writeFileSync(packageJson.config.js.output + '.map', js.map);
//         console.log('BUILD: javascript');
//     } catch(e) {
//         console.log(e);
//     }
// };

// // build css
// var buildCss = function() {
//     try {
//         var sassed = sass.renderSync({ file: packageJson.config.css.file });
//         var uglified = uglifyCss.processString(sassed.css.toString());
//         fs.writeFileSync(packageJson.config.css.output, uglified);
//         console.log('BUILD: css');
//     } catch(e) {
//         console.log(e);
//     }
// };

// // build html
// var buildHtml = function() {
//     try {
//         packageJson.config.html.files.forEach(function(file) {
//             fs.readFile(file.data, 'utf8', function(err, data) {
//                 if (err) throw err;
//                 var yml = frontMatter(data);
//                 var html = swig.renderFile(file.input, { data: yml.attributes, content: yml.body });
//                 fs.writeFileSync(file.output, html);
//             });
//         });
//         console.log('BUILD: html');
//     } catch(e) {
//         console.log(e);
//     }
// };

// // clean build
// var clean = function(){
//     del(['./build/*'], function (err, paths) {
//         console.log('Deleted files/folders:\n', paths.join('\n'));
//         buildJs();
//         buildCss();
//         buildHtml();
//     });
// };

// rebuild on load
// clean();

// watch dev to rebuild files on change
// browserSync.watch("./src/**/*.{html,yml}").on("change", buildHtml);
// browserSync.watch("./src/**/*.js").on("change", buildJs);
// browserSync.watch("./src/**/*.{scss,css}").on("change", buildCss);

// // watch build folder to reload on changes
// browserSync.watch("./build/**/*").on("change", browserSync.reload);

// // Now init the Browsersync server
// browserSync.init({ server: "./build/"});