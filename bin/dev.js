// imports
var uglifyCss   = require("uglifyCss");
var uglifyJs    = require("uglify-js");
var browserSync = require("browser-sync").create();
var frontMatter = require('front-matter');
var fs          = require('fs');
var packageJson = require('../package.json');
var swig        = require('swig');
var del         = require('del');

// configs
swig.setDefaults({ cache: false });


// build javascript
var buildJs = function() {

    // compile scripts in order
    var js = uglifyJs.minify(packageJson.config.js.files, { outSourceMap: "scripts.js.map" });
    fs.writeFileSync(packageJson.config.js.output, js.code);
    fs.writeFileSync(packageJson.config.js.output + '.map', js.map);

    // build vendor files if they exist
    if(packageJson.config.js.vendorFiles.length){
        var vendor = uglifyJs.minify(packageJson.config.js.vendorFiles);
        fs.writeFileSync(packageJson.config.js.output, vendor.code);
    }

    console.log('BUILD: javascript');
};

// build css
var buildCss = function() {

    // compile css in order
    var css = uglifyCss.processFiles(packageJson.config.css.files);
    fs.writeFileSync(packageJson.config.css.output, css);

     // build vendor files if they exist
    if(packageJson.config.css.vendorFiles.length){
        var vendor = uglifyCss.processFiles(packageJson.config.css.vendorFiles);
        fs.writeFileSync(packageJson.config.css.output, vendor);
    }

    console.log('BUILD: css');
};

// build html
var buildHtml = function() {
    // compile all html files
    packageJson.config.html.files.forEach(function(file) {
        fs.readFile(file.data, 'utf8', function(err, data) {
            if (err) throw err;
            var yml = frontMatter(data);
            var html = swig.renderFile(file.input, { data: yml.attributes, content: yml.body });
            fs.writeFileSync(file.output, html);
        });
    });

    console.log('BUILD: html');
};

// clean build
var clean = function(){
    del(['./build/*'], function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
        buildJs();
        buildCss();
        buildHtml();
    });
};

// rebuild on load
clean();

// watch dev to rebuild files on change
browserSync.watch("./src/html/**/*.{html,yml}").on("change", buildHtml);
browserSync.watch("./src/scripts/**/*.js").on("change", buildJs);
browserSync.watch("./src/styles/**/*.css").on("change", buildCss);

// watch build folder to reload on changes
browserSync.watch("./build/**/*").on("change", browserSync.reload);

// Now init the Browsersync server
browserSync.init({ server: "./build/"});

