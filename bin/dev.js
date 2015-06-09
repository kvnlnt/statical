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

var buildHtml = function(items, path, swigFn, callback) {
    try {

        items.forEach(function(item) {

            var jstFile = getFileContents(path + item + ".jst");
            var ymlFile = getFileContents(path + item + ".yml");
            var htmlFile = path + item + ".html";
            var data = frontMatter(ymlFile);
            var swigCompile = swigFn.compile(jstFile);
            var compiled = swigCompile(data.attributes);
            fs.writeFileSync(htmlFile, compiled);
            console.log('compile:', htmlFile);

        });

        if(callback) callback();

    } catch (e) {

        console.log(e);

    }
};

var buildJs = function(){
    var propertyScripts = property.scripts.map(function(script){
        return './src/property/' + script + ".js";
    });

    var pageScripts = property.pages.map(function(script){
        return './src/pages/' + script + ".js";
    });

    var partScripts = property.parts.map(function(script){
        return './src/parts/' + script + ".js";
    });

    var pieceScripts = property.scripts.map(function(script){
        return './src/pieces/' + script + ".js";
    });

    var scripts = propertyScripts
        .concat(pageScripts)
        .concat(partScripts)
        .concat(pieceScripts)
        .filter(function(script){
            return fs.existsSync(script);
        });

    var js = uglifyJs.minify(scripts, { outSourceMap: "scripts.js.map" });
    fs.writeFileSync('./build/scripts.js', js.code);
};

var buildSass = function(){
    var propertyStyles = property.styles.map(function(style){
        return './src/property/' + style + ".scss";
    });

    var pageStyles = property.pages.map(function(style){
        return './src/pages/' + style + ".scss";
    });

    var partStyles = property.parts.map(function(style){
        return './src/parts/' + style + ".scss";
    });

    var pieceStyles = property.scripts.map(function(style){
        return './src/pieces/' + style + ".scss";
    });

    var styles = propertyStyles
        .concat(pageStyles)
        .concat(partStyles)
        .concat(pieceStyles)
        .filter(function(style){
            return fs.existsSync(style);
        });

    var css = uglifyCss.processFiles(styles);
    fs.writeFileSync('./build/styles.css', css);
};

var buildHtmlProperty = function(){
    // swig and copy all pages
    property.pages.forEach(function(page){
        var htmlFile = './src/pages/' + page + ".html";
        var targetFile = './build/' + page + ".html";
        var htmlContents = getFileContents(htmlFile);
        var swigCompile = swigProperty.compile(htmlContents);
        var compiled = swigCompile(property);
        fs.writeFileSync(targetFile, compiled);
    });

    buildJs();
    buildSass();
};

var buildHtmlPages = function(callback) {
    buildHtml(property.pages, './src/pages/', swigPage, buildHtmlProperty);
};

var buildHtmlParts = function(callback) {
    buildHtml(property.parts, './src/parts/', swigPart, buildHtmlPages);
};

var buildHtmlPieces = function() {
    buildHtml(property.pieces, './src/pieces/', swigPiece, buildHtmlParts);
};

var clean = function(callback) {
    del(['./src/**/*.html', './build/*'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        if(callback) callback();
    });
};

// rebuild on load
clean(buildHtmlPieces);

// watch dev to rebuild files on change
// browserSync.watch("./src/**/*.{html,yml}").on("change", buildHtml);
// browserSync.watch("./src/**/*.js").on("change", buildJs);
// browserSync.watch("./src/**/*.{scss,css}").on("change", buildCss);

// // watch build folder to reload on changes
// browserSync.watch("./build/**/*").on("change", browserSync.reload);

// // Now init the Browsersync server
// browserSync.init({ server: "./build/"});