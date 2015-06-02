// Create a Browsersync instance
var bs = require("browser-sync").create();
var UglifyJS = require("uglify-js");
var fs = require('fs');


var build = function() {

    // javascript
    var js = UglifyJS.minify([
        "./src/scripts/app.js",
        "./src/scripts/test.js"
    ], {
        outSourceMap: "./build/scripts.js.map",
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

    // output
    fs.writeFileSync('./build/scripts.js', js.code);

    // reload browser
    bs.reload();

};


// // watch
// bs.watch("./src/html/*").on("change", rebuild);
// bs.watch("./src/scripts/*").on("change", rebuild);
// bs.watch("./src/styles/*").on("change", rebuild);

// // Now init the Browsersync server
// bs.init({
//     server: "./build"
// });

build();