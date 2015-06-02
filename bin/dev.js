// Create a Browsersync instance
var bs = require("browser-sync").create();
var colors = require('colors');

var compile = function() {


};

var build = function() {


};

var rebuild = function() {

    compile();
    build();
    bs.reload();

};


// watch
bs.watch("./src/html/*").on("change", rebuild);
bs.watch("./src/scripts/*").on("change", rebuild);
bs.watch("./src/styles/*").on("change", rebuild);

// Now init the Browsersync server
bs.init({
    server: "./build"
});