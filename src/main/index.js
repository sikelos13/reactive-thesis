let path = require('path'),
    fs = require('fs');
const parser = require('./utils/JSCodeshiftWrapper').parser;
const j = require('./utils/JSCodeshiftWrapper').j

//Import codemods
const codeModeAst = require('./components/consoleAst');
const codeModeOperators = require('./components/findOperators');
const codeModeRxjsCalls = require('./components/operatorsUse');
const codeModeRxjsSubject = require('./components/subjectInUse')
const program = require('commander');
const fileUtils = require('..//main/utils/fileutils');
const {
    readdirSync
} = require('fs')
let csvRows = {
    rows: []
}
program
    .option('-f, --findOperator <name>', 'count rxjs operator')
    .option('-o, --operatorsInUse <source>', 'find all operators of rxjs library that are used in the file')
    .option('-s, --subjectInUse <source>', 'find the usage of subject property of rxjs library');
program.parse(process.argv);

if (program.findOperator) {
    main('src/test/resources', program.findOperator, "findOperator");
} else if (program.operatorsInUse) {
    if (program.operatorsInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.operatorsInUse
    main(source, "", "operatorsInUse");
} else if (program.subjectInUse) {
    if (program.subjectInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.subjectInUse
    main(source, "", "subjectInUse");
}

function main(path, operatorName, option) {
    if (!fs.existsSync(path)) {
        console.log("Wrong directory ", path);
        return;
    }

    //Fetch js,jsx,ts,tsx files
    files = fileUtils.getJSFilesSync(path)
    files.map(file => {
        //Read files one by one and trim them
        console.log('Found js file: ', file);
        ast = parser(fileUtils.readFileSync(file).trim());
        let filename = file.replace(/^.*[\\\/]/, '')
        //Run script based on users arguments
        if (option == "findOperator") {
            console.log('Searching for: ', operatorName);
            codeModeOperators.findOperators(ast, j, operatorName);
        } else if (option == "ast") {
            codeModeAst.consoleAst(ast, j, operatorName);
        } else if (option == "operatorsInUse") {
            codeModeRxjsCalls.operatorsUse(ast, j, file, filename, files, files.indexOf(file), csvRows)
        } else if (option == "subjectInUse") {
            codeModeRxjsSubject.subjectInUse(ast, j, file, filename, files, files.indexOf(file), csvRows)
        }
    })
};