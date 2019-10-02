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
    .option('-p, --pizza-type <type>', 'flavour of pizza');
program.parse(process.argv);

if (program.operators) {
    main('src/test/resources', '.js', program.operators, "operators");
} else if (program.ast) {
    main('src/test/resources', '.js', program.ast, "ast");
}

function main(startPath, filter, operatorName, option) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    let files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        let filename = path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.indexOf(filter) >= 0) {
            console.log('Searching for: ', operatorName);
            console.log('Found js file: ', filename);
            ast = parser(fileUtils.readFileSync(filename).trim());
            if (option == "operators") {
                codeModeOperators.findOperators(ast, j, operatorName);
                console.log(codeModeOperators.findOperators(ast, j, operatorName))
            } else if (option == "ast") {
                codeModeAst.consoleAst(ast, j, operatorName);
            }
        };
    };
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
//TODO:  break  app.js into two functions ...{analyze.js file and main file in which we will iterate the directory with js/ts}
//TODO: Implement
//TODO :  Flow parser
//TODO: yeoman for structure