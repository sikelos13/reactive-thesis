let path = require('path'),
    fs = require('fs');
const parser = require('../main/components/JSCodeshiftWrapper').parser;
const j = require('../main/components/JSCodeshiftWrapper').j
//Import codemods
const codeModeAst = require('./components/consoleAst');
const codeModeOperators = require('./components/findOperators');
const codeModeRxjsCalls = require('./components/operatorsUse');

const program = require('commander');
const fileUtils = require('..//main/utils/fileutils');
const {
    readdirSync
} = require('fs')

program
    .option('-f, --findOperator <name>', 'count rxjs operator')
    // .option('-a, --ast', 'output file ast tree')
    .option('-o, --operatorsInUse <source>', 'find all operators of rxjs library that are used in the file');
program.parse(process.argv);
console.log(program.operatorsInUse)

if (program.findOperator) {
    main('src/test/resources', program.findOperator, "findOperator");
} else if (program.ast) {
    main('src/test/resources', program.ast, "ast");
} else if (program.operatorsInUse) {
    if (program.operatorsInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.operatorsInUse
    main(source, "", "operatorsInUse");
}

function main(path, operatorName, option) {
    if (!fs.existsSync(path)) {
        console.log("Wrong directory ", path);
        return;
    }
    //Fetch js,jsx,ts,tsx files
    files = fileUtils.getJSFilesSync(path)
    files.forEach(file => {
        //Read files one by one and trim them
        console.log('Found js file: ', file);

        ast = parser(fileUtils.readFileSync(file).trim());
        //Run script based on users arguments

        if (option == "findOperator") {
            console.log('Searching for: ', operatorName);
            codeModeOperators.findOperators(ast, j, operatorName);
        } else if (option == "ast") {
            codeModeAst.consoleAst(ast, j, operatorName);
        } else if (option == "operatorsInUse") {
            codeModeRxjsCalls.operatorsUse(ast, j, file);
        }
    })
};


// fromDir('../thesis-projects-container', 'js');
// readline.question(`What's  your files directory?`, file => {
//     readline.question(`What' type of files should we search?`, type => {
//         fromDir(file, type)
//         readline.close()
//     })
//     // readline.close()
// })

// sh(`jscodeshift ${filename} -t ../reactive-thesis/src/components/subAnalyzer.js -dp -v 2 --parser flow`);
//TODO: user should import his own src 
// Project should only read one repo at a time.
//TODO : implement Jscodeshift to wrap parser and read the js/ts files
//TODO: Implement
//TODO :  Flow parser
//TODO: yeoman for structure