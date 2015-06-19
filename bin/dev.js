// TOC
// -----------------------
// MODULES
// SHORTCUTS
// CLEANERS
// WATCHERS
// MENU

// MODULES
var terminalMenu = require('terminal-menu');
var browserSync = require("browser-sync").create();
var del = require('del');
var frontMatter = require('front-matter');
var fs = require('fs');
var packageJson = require('../package.json');
var swig = require('swig');
var swigPiece = new swig.Swig({ varControls: ['{{@piece', '}}'], cache:false });
var swigPart = new swig.Swig({ varControls: ['{{@part', '}}'], cache:false });
var swigPage = new swig.Swig({ varControls: ['{{@page', '}}'], cache:false });
var swigProperty = new swig.Swig({ varControls: ['{{@property', '}}'], cache:false });
var babel = require("babel-core");
var postcss = require('postcss');
var customMedia = require("postcss-custom-media")
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var csswring = require('csswring');
var util = require('./util.js');


// SHORTCUTS
var patterns = packageJson.build.patterns;
var property = packageJson.build.property;
var pages = packageJson.build.pages;
var parts = packageJson.build.parts;
var pieces = packageJson.build.pieces;

// BUILDERS
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

    var files = patternScripts
        .concat(propertyScripts)
        .concat(pageScripts)
        .concat(partScripts)
        .concat(pieceScripts)
        .filter(function(script){
            return fs.existsSync(script);
        });

    var concatedFiles = files.map(function(file){
        return util.getFileContents(file);
    }).join('');

    var result = babel.transform(concatedFiles,{ 
        compact:true,
        sourceMaps:true,
        sourceFileName:"maps/scripts.js",
        sourceMapTarget:'scripts.js'
    });

    // hackily add in sourceMappingUrl due to babel js api not supporting it
    var compiledCode = result.code + '\n//# sourceMappingURL=' + 'scripts.js.map';

    util.cliMessage("BUILT", "./build/scripts.js");
    util.cliMessage("BUILT", "./build/scripts.js.map");
    fs.writeFileSync('./build/scripts.js', compiledCode);
    fs.writeFileSync('./build/scripts.js.map', JSON.stringify(result.map));
};

var buildCss = function(){
    var patternStyles = patterns.styles.map(function(style){
        return './src/patterns/styles/' + style + ".css";
    });

    var propertyStyles = property.styles.map(function(style){
        return './src/property/' + style + ".css";
    });

    var pageStyles = pages.map(function(style){
        return './src/pages/' + style + ".css";
    });

    var partStyles = parts.map(function(style){
        return './src/parts/' + style + ".css";
    });

    var pieceStyles = pieces.map(function(style){
        return './src/pieces/' + style + ".css";
    });

    var files = patternStyles
        .concat(propertyStyles)
        .concat(pageStyles)
        .concat(partStyles)
        .concat(pieceStyles)
        .filter(function(style){
            return fs.existsSync(style);
        });

    var concatedFiles = files.map(function(file){
        return util.getFileContents(file);
    }).join('');

    postcss([customMedia(), autoprefixer(), cssnext(), csswring()])
    .process(concatedFiles, { from:'maps/styles.css', to:'styles.css', map:{inline:false} })
    .then(function (result) {
        util.cliMessage('BUILT', './build/styles.css');
        util.cliMessage('BUILT', './build/styles.css.map');
        fs.writeFileSync('./build/styles.css', result.css);
        fs.writeFileSync('./build/styles.css.map', result.map);
    });
};

var buildHtml = function(items, path, swigFn, callback) {
    try {

        items.forEach(function(item) {
            var jstFile = util.getFileContents(path + item + ".jst");
            var ymlFile = util.getFileContents(path + item + ".yml");
            var htmlFile = path + item + ".html";
            var data = frontMatter(ymlFile);
            var swigCompile = swigFn.compile(jstFile);
            data.attributes.content = data.body;
            var compiled = swigCompile(data.attributes);
            fs.writeFileSync(htmlFile, compiled);
            util.cliMessage('BUILT', htmlFile);
        });

        if(callback) callback();

    } catch (e) {
        util.cliMessage(e);
    }
};

var buildHtmlProperty = function(){

    // swig and copy all pages
    pages.forEach(function(page){
        var htmlFile = './src/pages/' + page + ".html";
        var targetFile = './build/' + page + ".html";
        var htmlContents = util.getFileContents(htmlFile);
        var swigCompile = swigProperty.compile(htmlContents);
        var compiled = swigCompile(property);
        var dir = targetFile.split('/');
        util.ensureFilePath(targetFile,1);
        fs.writeFileSync(targetFile, compiled);
        util.cliMessage('BUILT', targetFile);
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

// CLEANERS
var cleanHtml = function(andBuild) {
    del(['./src/**/*.html', './build/**/*.html'], function(err, paths) {
        for(path in paths){
            util.cliMessage('DELETED', paths[path], 'yellow');
        }
        if(andBuild) buildHtmlPieces();
    });
};

var cleanJs = function(andBuild){
    del(['./build/*.{js,js.map}'], function(err, paths) {
        for(path in paths){
            util.cliMessage('DELETED', paths[path], 'yellow');
        }
        if(andBuild) buildJs();
    });
};

var cleanCss = function(andBuild){
    del(['./build/*.{css,css.map}'], function(err, paths) {
        for(path in paths){
            util.cliMessage('DELETED', paths[path], 'yellow');
        }
        if(andBuild) buildCss();
    });
};

var cleanAll = function(andBuild){
    cleanHtml(andBuild);
    cleanJs(andBuild);
    cleanCss(andBuild);
};

// WATCHERS
var watchAll = function(){
    // watch dev to rebuild files on change
    browserSync.watch("./src/property/**/*.{jst,yml,layout}").on("change", buildHtmlProperty);
    browserSync.watch("./src/patterns/**/*.{layout}").on("change", buildHtmlPages);
    browserSync.watch("./src/pages/**/*.{jst,yml}").on("change", buildHtmlPages);
    browserSync.watch("./src/parts/**/*.{jst,yml}").on("change", buildHtmlParts);
    browserSync.watch("./src/pieces/**/*.{jst,yml}").on("change", buildHtmlPieces);
    browserSync.watch("./src/+(patterns|property|pages|parts|pieces)/**/*.js").on("change", buildJs);
    browserSync.watch("./src/+(patterns|property|pages|parts|pieces)/**/*.css").on("change", buildCss);
    browserSync.watch("package.json").on("change", cleanAll);

    // watch build folder to reload on changes
    browserSync.watch("./build/**/*").on("change", browserSync.reload);

    // launch it
    browserSync.init({ server: "./build/"});
};

// MENU
var menu = terminalMenu({ width: 29, x: 4, y: 2 });
menu.reset();
menu.write('STATICAL\n');
menu.write('-------------------------\n');
menu.add('LAUNCH');
menu.add('BUILD');
menu.add('CLEAN');
menu.add('EXIT');

menu.on('select', function (label) {
    switch(label) {
        case 'LAUNCH':
            util.cliMessage('DEV', "Launching", "yellow");
            cleanAll(true);
            watchAll();
            menu.close();
            break;
        case 'BUILD':
            util.cliMessage('DEV', "Building", "yellow");
            buildHtmlPieces(); // this kicks of build hierarchy
            buildJs();
            buildCss();
            break;
        case 'CLEAN':
            util.cliMessage('DEV', "Cleaning", "yellow");
            cleanAll(false);
            break;
        case 'EXIT':
            util.cliMessage('MENU', "Exited", "yellow");
            menu.close();
            break;
    }
});

process.stdin.pipe(menu.createStream()).pipe(process.stdout);
 
process.stdin.setRawMode(true);
menu.on('close', function () {
    process.stdin.setRawMode(false);
    process.stdin.end();
});