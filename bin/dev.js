// imports
var browserSync = require("browser-sync").create();
var del = require('del');
var frontMatter = require('front-matter');
var fs = require('fs');
var sass = require('node-sass');
var packageJson = require('../package.json');
var swig = require('swig');
var swigPiece = new swig.Swig({ varControls: ['{{@piece', '}}'] });
var swigPart = new swig.Swig({ varControls: ['{{@part', '}}'] });
var swigPage = new swig.Swig({ varControls: ['{{@page', '}}'] });
var swigProperty = new swig.Swig({ varControls: ['{{@property', '}}'] });
var uglifyCss = require("uglifyCss");
var uglifyJs = require("uglify-js");

// property
var property = packageJson.property;


var getFileContents = function(file) {
    return fs.existsSync(file) ? fs.readFileSync(file).toString() : '';
};

var build = function(items, type, path, swigFn, callback) {

    try {

        items.forEach(function(item) {

            var jstFile = getFileContents(path + item + ".jst");
            var ymlFile = getFileContents(path + item + ".yml");
            var htmlFile = path + item + ".html";
            var data = frontMatter(ymlFile);
            var swigCompile = swigFn.compile(jstFile);
            var payload = {};
            payload[type] = data.attributes;
            var compiled = swigCompile(payload);
            fs.writeFileSync(htmlFile, compiled);
            console.log('compile:', htmlFile);

        });

        if(callback) callback();

    } catch (e) {

        console.log(e);

    }

};

var buildParts = function(callback) {
    build(property.parts, 'part', './src/parts/', swigPart);
};

var buildPieces = function() {
    build(property.pieces, 'piece', './src/pieces/', swigPiece, buildParts);
};

var clean = function(callback) {
    del(['./src/**/*.html'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        if(callback) callback();
    });
};

// rebuild on load
clean(buildPieces);

// watch dev to rebuild files on change
// browserSync.watch("./src/**/*.{html,yml}").on("change", buildHtml);
// browserSync.watch("./src/**/*.js").on("change", buildJs);
// browserSync.watch("./src/**/*.{scss,css}").on("change", buildCss);

// // watch build folder to reload on changes
// browserSync.watch("./build/**/*").on("change", browserSync.reload);

// // Now init the Browsersync server
// browserSync.init({ server: "./build/"});