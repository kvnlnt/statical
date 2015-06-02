// imports
var uglifyCss = require("uglifyCss");
var uglifyJs = require("uglify-js");
var browserSync = require("browser-sync").create();
var frontMatter = require('front-matter');
var fs = require('fs');
var packageJson = require('../package.json');
var swig = require('swig');

var buildJs = function() {
    var js = uglifyJs.minify(packageJson.config.js.files, { outSourceMap: "scripts.js.map" });
    fs.writeFileSync(packageJson.config.js.output, js.code);
    fs.writeFileSync(packageJson.config.js.output + '.map', js.map);
};

var buildCss = function() {
    var css = uglifyCss.processFiles(packageJson.config.css.files);
    fs.writeFileSync(packageJson.config.css.output, css);
};

var buildHtml = function() {
    packageJson.config.html.files.forEach(function(file) {
        fs.readFile(file.yml, 'utf8', function(err, data) {
            if (err) throw err;
            var yml = frontMatter(data);
            var html = swig.renderFile(file.html, { data: yml.attributes, body: yml.body });
            fs.writeFileSync(file.html.replace('./src/html/', './build/'), html);
        });
    });
};

var build = function() {
    buildJs();
    buildCss();
    buildHtml();
    browserSync.reload();
};

// watch dev to rebuild files on change
browserSync.watch("./src/html/**/*.{html,yml}").on("change", build);
browserSync.watch("./src/scripts/**/*.js").on("change", build);
browserSync.watch("./src/styles/**/*.css").on("change", build);

// Now init the Browsersync server
browserSync.init({ server: "./build/"});

// build
build();