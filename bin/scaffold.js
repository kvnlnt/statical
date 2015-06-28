// MODULES
var inquirer = require("inquirer");
var fs = require('fs');
var util = require('./lib/util.js');

var questions = [
    {
        name: 'type',
        type: 'list',
        message: 'What would you like to scaffold?',
        choices: ['PIECE', 'PART', 'PAGE', 'EXIT'],
        default: 'PIECE',
        filter: function(input) {
            if(input === 'EXIT') {
                process.exit();
            } else {
                return input;
            }
        }
    },

    {
        name:'entity',
        type: 'input',
        message: "What's the name of this object?",
        default: ''
    }
];

inquirer.prompt(questions, function( answers ) {
    switch(answers.type) {
        case 'PIECE':
            var root = 'pieces';
            break;
        case 'PART':
            var root = 'parts';
            break;
        case 'PAGE':
            var root = 'pages';
            break;
    }

    // create vars
    var jst = './src/' + root + '/' + answers.entity + '.jst';
    var js  = './src/' + root + '/' + answers.entity + '.js';
    var css = './src/' + root + '/' + answers.entity + '.css';
    var yml = './src/' + root + '/' + answers.entity + '.yml';

    // get package.json and update it
    var packageJson = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
    packageJson.build[root].elements.push(answers.entity);
    var updates = {}; 
    updates.build = {};
    updates.build[root] = packageJson.build[root].elements;
    util.updateJSONpreserveFormat('./package.json', updates);

    // create files
    if (!fs.existsSync(jst)) {
        util.ensureFilePath(jst, 0);
        fs.writeFileSync(jst,'');
        fs.writeFileSync(js,'');
        fs.writeFileSync(css,'');
        fs.writeFileSync(yml,'');
    } else {
        util.cliMessage('ALERT', answers.entity + ' already exist', 'red');
    }
});