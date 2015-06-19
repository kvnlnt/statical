// MODULES
var colors = require('colors');
var fs = require('fs');

// UTILITY
var util = {};

util.getFileContents = function(file) {
    return fs.existsSync(file) ? fs.readFileSync(file).toString() : '';
};

util.ensureFilePath = function(file, index){

    var path = file.split('/'); path.pop();
    var len = path.length-1;
    var directory = path.splice(0, index+1).join('/');

    // if folder not exists, create it
    var exists = fs.existsSync(directory);
    if (!exists) {
        util.cliMessage('create directory: ', directory);
        fs.mkdirSync(directory);
    }

    // if not last element, increment and recurse
    if(index < len){
        index += 1;
        util.ensureFilePath(file, index);
    }
};

util.cliMessage = function(action, msg, color){
    var color = color || 'green';
    console.log(
        colors.blue('STATICAL'),
        ':',
        eval('colors.'+color)(action),
        ':',
        msg);
};

module.exports = util;