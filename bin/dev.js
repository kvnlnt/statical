// modules
var browserSync = require("browser-sync").create();
var del = require('del');
var frontMatter = require('front-matter');
var fs = require('fs');
var sass = require('node-sass');
var packageJson = require('../package.json');
var swig = require('swig');
var swigPiece = new swig.Swig({ varControls: ['{{@piece', '}}'], cache:false });
var swigPart = new swig.Swig({ varControls: ['{{@part', '}}'], cache:false });
var swigPage = new swig.Swig({ varControls: ['{{@page', '}}'], cache:false });
var swigProperty = new swig.Swig({ varControls: ['{{@property', '}}'], cache:false });
var uglifyCss = require("uglifyCss");
var uglifyJs = require("uglify-js");

// TOC
// -----------------------
// SHORTCUTS
// HELPERS 
// BUILD SCRIPTS

// SHORTCUTS
var patterns = packageJson.build.patterns;
var property = packageJson.build.property;
var pages = packageJson.build.pages;
var parts = packageJson.build.parts;
var pieces = packageJson.build.pieces;

// HELPERS
var getFileContents = function(file) {
    return fs.existsSync(file) ? fs.readFileSync(file).toString() : '';
};

var ensureFilePath = function(file, index){

    var path = file.split('/'); path.pop();
    var len = path.length-1;
    var directory = path.splice(0, index+1).join('/');

    // if folder not exists, create it
    var exists = fs.existsSync(directory);
    if (!exists) {
        console.log('create directory: ', directory);
        fs.mkdirSync(directory);
    }

    // if not last element, increment and recurse
    if(index < len){
        index += 1;
        ensureFilePath(file, index);
    }
};

// BUILD SCRIPTS 
var buildJs = function(){
    var patternScripts = patterns.scripts.map(function(script){
        return './src/patterns/scripts/' + script + ".js";
    });

    var propertyScripts = property.scripts.map(function(script){
        return './src/property/' + script + ".js";
    });

    var pageScripts = pages.map(function(script){
        return './src/pages/' + script + ".js";
    });

    var partScripts = parts.map(function(script){
        return './src/parts/' + script + ".js";
    });

    var pieceScripts = pieces.map(function(script){
        return './src/pieces/' + script + ".js";
    });

    var scripts = patternScripts
        .concat(propertyScripts)
        .concat(pageScripts)
        .concat(partScripts)
        .concat(pieceScripts)
        .filter(function(script){
            return fs.existsSync(script);
        });

    var js = uglifyJs.minify(scripts, { outSourceMap: "scripts.js.map" });
    fs.writeFileSync('./build/scripts.js', js.code);
};

var buildCss = function(){
    var patternStyles = patterns.styles.map(function(style){
        return './src/patterns/styles/' + style + ".scss";
    });

    var propertyStyles = property.styles.map(function(style){
        return './src/property/' + style + ".scss";
    });

    var pageStyles = pages.map(function(style){
        return './src/pages/' + style + ".scss";
    });

    var partStyles = parts.map(function(style){
        return './src/parts/' + style + ".scss";
    });

    var pieceStyles = pieces.map(function(style){
        return './src/pieces/' + style + ".scss";
    });

    var styles = patternStyles
        .concat(propertyStyles)
        .concat(pageStyles)
        .concat(partStyles)
        .concat(pieceStyles)
        .filter(function(style){
            return fs.existsSync(style);
        });

    var concatedFiles = styles.map(function(file){
        return getFileContents(file);
    }).join('');

    var sassCompiled = sass.renderSync({data: concatedFiles});
    var css = uglifyCss.processString(sassCompiled.css.toString());
    fs.writeFileSync('./build/styles.css', css);
};

var buildHtml = function(items, path, swigFn, callback) {
    try {

        items.forEach(function(item) {
            var jstFile = getFileContents(path + item + ".jst");
            var ymlFile = getFileContents(path + item + ".yml");
            var htmlFile = path + item + ".html";
            var data = frontMatter(ymlFile);
            var swigCompile = swigFn.compile(jstFile);
            data.attributes.content = data.body;
            var compiled = swigCompile(data.attributes);
            fs.writeFileSync(htmlFile, compiled);
            console.log('compile:', htmlFile);
        });

        if(callback) callback();

    } catch (e) {
        console.log(e);
    }
};

var buildHtmlProperty = function(){

    // swig and copy all pages
    pages.forEach(function(page){
        var htmlFile = './src/pages/' + page + ".html";
        var targetFile = './build/' + page + ".html";
        var htmlContents = getFileContents(htmlFile);
        var swigCompile = swigProperty.compile(htmlContents);
        var compiled = swigCompile(property);
        var dir = targetFile.split('/');
        ensureFilePath(targetFile,1);
        fs.writeFileSync(targetFile, compiled);
        console.log('build:', targetFile);
    });
};

var buildHtmlPages = function(callback) {
    buildHtml(pages, './src/pages/', swigPage, buildHtmlProperty);
};

var buildHtmlParts = function(callback) {
    buildHtml(parts, './src/parts/', swigPart, buildHtmlPages);
};

var buildHtmlPieces = function() {
    buildHtml(pieces, './src/pieces/', swigPiece, buildHtmlParts);
};

var cleanHtml = function() {
    del(['./src/**/*.html', './build/**/*.html'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        buildHtmlPieces();
    });
};

var cleanJs = function(){
    del(['./build/*.js'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        buildJs();
    });
};

var cleanCss = function(){
    del(['./build/*.css'], function(err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        buildCss();
    });
};

var cleanAll = function(){
    cleanHtml();
    cleanJs();
    cleanCss();
};

cleanAll();

// watch dev to rebuild files on change
browserSync.watch("./src/property/**/*.{jst,yml,layout}").on("change", buildHtmlProperty);
browserSync.watch("./src/patterns/**/*.{layout}").on("change", buildHtmlPages);
browserSync.watch("./src/pages/**/*.{jst,yml}").on("change", buildHtmlPages);
browserSync.watch("./src/parts/**/*.{jst,yml}").on("change", buildHtmlParts);
browserSync.watch("./src/pieces/**/*.{jst,yml}").on("change", buildHtmlPieces);
browserSync.watch("./src/+(patterns|property|pages|parts|pieces)/**/*.js").on("change", buildJs);
browserSync.watch("./src/+(patterns|property|pages|parts|pieces)/**/*.{scss,css}").on("change", buildCss);
browserSync.watch("package.json").on("change", cleanAll);

// watch build folder to reload on changes
browserSync.watch("./build/**/*").on("change", browserSync.reload);

// Now init the Browsersync server
browserSync.init({ server: "./build/"});