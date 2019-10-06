let path = require('path'),
    fs = require('fs');
const parser = require('../main/components/JSCodeshiftWrapper').parser;
const j = require('../main/components/JSCodeshiftWrapper').j
//Import codemods
const codeModeAst = require('./components/consoleAst');
const codeModeOperators = require('./components/findOperators');
const program = require('commander');
const fileUtils = require('..//main/utils/fileutils');

program
    .option('-o, --operators <name>', 'count rxjs operator')
    .option('-a, --ast', 'output file ast tree')
    .option('-d, --debug <type>', 'debug rxjs library');
program.parse(process.argv);

if (program.operators) {
    main('src/test/resources', '.js', program.operators, "operators");
} else if (program.ast) {
    main('src/test/resources', '.js', program.ast, "ast");
}

function main(path, filter, operatorName, option) {
    if (!fs.existsSync(path)) {
        console.log("no dir ", path);
        return;
    }
    //Fetch js,jsx,ts,tsx files
    files = fileUtils.getJSFilesSync(path)
    files.forEach(file => {
        //Read files one by one and trim them
        console.log('Found js file: ', file);

        ast = parser(fileUtils.readFileSync(file).trim());
        //Run script based on users arguments

        if (option == "operators") {
            console.log('Searching for: ', operatorName);
            codeModeOperators.findOperators(ast, j, operatorName);
        } else if (option == "ast") {
            codeModeAst.consoleAst(ast, j, operatorName);
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