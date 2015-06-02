// Create a Browsersync instance
var bs = require("browser-sync").create();
var UglifyJS = require("uglify-js");
var UglifyCSS = require("uglifycss");
var fs = require('fs');
var fm = require('front-matter');
var swig = require('swig');
var async = require('async');

var buildJs = function() {
    var js = UglifyJS.minify([
        "./src/scripts/app.js",
        "./src/scripts/test.js"
    ], {
        outSourceMap: "scripts.js.map",
        mangle: true,
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
        }
    });

    fs.writeFileSync('./build/scripts.js', js.code);
    fs.writeFileSync('./build/scripts.js.map', js.map);
};

var buildCss = function() {
    var css = UglifyCSS.processFiles([
        "./src/styles/app.css",
        "./src/styles/test.css"
    ], {
        maxLineLen: 500,
        expandVars: true
    });

    fs.writeFileSync('./build/styles.css', css);
};

var buildHtml = function() {

    ["./src/html/index"].forEach(function(file) {
        fs.readFile(file + '.yml', 'utf8', function(err, data) {
            if (err) throw err;
            var content = fm(data);
            var html = swig.renderFile(file + '.html', {
                data: content.attributes,
                body: content.body
            });
            fs.writeFileSync(file.replace('./src/html/', './build/') + '.html', html);
        });
    });

};

var build = function() {
    buildJs();
    buildCss();
    buildHtml();
    bs.reload();
};

// watch dev to rebuild files on change
bs.watch("./src/html/**/*.{html,yml}").on("change", build);
bs.watch("./src/scripts/**/*.js").on("change", build);
bs.watch("./src/styles/**/*.css").on("change", build);

// Now init the Browsersync server
bs.init({
    server: "./build/",
});

build();