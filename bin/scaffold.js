// MODULES
var inquirer = require("inquirer");
var fs = require('fs');
var util = require('./lib/util.js');

var questions = [
    {
        name: 'type',
        type: 'list',
        message: 'What would you like to scaffold?',
        choices: ['PIECE', 'PART', 'PAGE','EXIT'],
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
            var root = 'piece';
            break;
        case 'PART':
            var root = 'parts';
            break;
        case 'PAGE':
            var root = 'page';
            break;
        case 'EXIT':
            return false;
            break;
    }

    var jst = './src/'+root+'/' + answers.entity + '.jst';
    var js  = './src/'+root+'/' +answers.entity + '.js';
    var css = './src/'+root+'/' +answers.entity + '.css';

    console.log(jst, answers);

    if (!fs.existsSync(jst)) {
        util.ensureFilePath(jst, 0);
        fs.writeFileSync(jst,'');
        fs.writeFileSync(js,'');
        fs.writeFileSync(css,'');
    } else {
        util.cliMessage('ALERT', answers.entity + ' already exist', 'red');
    }
});