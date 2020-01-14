let path = require('path'),
    fs = require('fs');
const parser = require('./utils/JSCodeshiftWrapper').parser;
const j = require('./utils/JSCodeshiftWrapper').j
var util = require('util');

//Import codemods
const codeModeAst = require('./components/consoleAst');
const codeModeOperators = require('./components/operators/findOperators');
const codeModeRxjsCalls = require('./components/operators/operatorsUse');
const codeModeRxjsSubject = require('./components/subjects/subjectInUse');
const codeModeRxjsObservables = require('./components/observables/observablesInUse');
const aggregateCalc = require("./utils/aggregateResults")
const program = require('commander');
const fileUtils = require('../main/utils/fileutils');
const converter = require('json-2-csv');
const csvModule = require('./utils/exportToCsv')

const {
    readdirSync
} = require('fs')
let csvRows = {
    rows: []
}

const aggregationResults = [];
const resultsArray = [];

program
    .option('-f, --findOperator <name>', 'count rxjs operator')
    .option('-o, --operatorsInUse <source>', 'find all operators of rxjs library that are used in the file')
    .option('-s, --subjectInUse <source>', 'find the usage of subject property of rxjs library')
    .option('-v, --observablesInUse <source>', 'find the usage of observable constructors  of rxjs library')
    .option('-e, --exportToCsv', 'export the results from previous calculations')
    .option('-a, --aggregateResults <aggregateType>', 'aggregate the results from previous calculations');
program.parse(process.argv);

if (program.findOperator) {
    main('src/test/resources', program.findOperator, "findOperator");
} else if (program.operatorsInUse) {
    if (program.operatorsInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.operatorsInUse;
    let aggregateType = "";
    main(source, "", "operatorsInUse");
} else if (program.subjectInUse) {
    if (program.subjectInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.subjectInUse;
    let aggregateType = "";
    main(source, "", "subjectInUse");
} else if (program.observablesInUse) {
    if (program.observablesInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.observablesInUse;
    let aggregateType = "";
    main(source, "", "observablesInUse");
} else if (program.exportToCsv) {
    if (program.exportToCsv.length < 2) {
        program.help();
        return;
    }
    let source = program.exportToCsv
    let aggregateType = ""
    main(source, "", "exportToCsv");
} else if (program.aggregateResults) {
    if (program.aggregateResults.length < 2) {
        program.help();
        return;
    }
    let aggregateType = program.aggregateResults
    let source = ""
    main(source, "", "aggregateResults",aggregateType);
}

function main(path, operatorName, option, aggregateType) {
    if (!fs.existsSync(path) && option !== "exportToCsv" && option !== "aggregateResults") {
        console.log("Wrong directory ", path);
        return;
    }

    if (option == "exportToCsv") {
        let tempResults = fs.readFileSync('./resultsArray.json');
        let results = eval('(' + tempResults.toString() + ')');

        //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
        if (results.length > 0) {
            converter.json2csv(results, csvModule.json2csvCallback, {
                prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            });
        }
        return;
        
    } else if (option == "aggregateResults") {
        let tempResults = fs.readFileSync('./resultsArray.json');
        let results = eval('(' + tempResults.toString() + ')');

        if (results.length > 0) {
            aggregateCalc.aggregateCalc(results,aggregateType);
        }
        return;
    }

    files = fileUtils.getJSFilesSync(path)

    //Fetch js,jsx,ts,tsx files
    files.map(file => {

        //Read files one by one and trim them
        console.log('Found file: ', file);
        ast = parser(fileUtils.readFileSync(file).trim());
        let filename = file.replace(/^.*[\\\/]/, '')
        //Run script based on users arguments
        if (option == "findOperator") {
            console.log('Searching for: ', operatorName);
            codeModeOperators.findOperators(ast, j, operatorName);
        } else if (option == "ast") {
            codeModeAst.consoleAst(ast, j, operatorName);
        } else if (option == "operatorsInUse") {
            resultsArray.push.apply(resultsArray, codeModeRxjsCalls.operatorsUse(ast, j, file, filename, files, files.indexOf(file), csvRows));
        } else if (option == "subjectInUse") {
            codeModeRxjsSubject.subjectInUse(ast, j, file, filename, files, files.indexOf(file), csvRows);
        } else if (option == "observablesInUse") {
            codeModeRxjsObservables.observablesInUse(ast, j, file, filename, files, files.indexOf(file), csvRows);
        } 
        // else if (option == "aggregateResults") {
        //     if (resultsArray.length > 0) {
        //         aggregationResults = aggregateCalc.aggregateCalc(resultsArray, csvRows);
        //         console.log(aggregationResults);
        //     }
        // }
    })
    fs.writeFileSync('./resultsArray.json', util.inspect(resultsArray, { maxArrayLength: null }));
};