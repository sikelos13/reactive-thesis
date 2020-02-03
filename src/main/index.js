let fs = require('fs');
const parser = require('./utils/JSCodeshiftWrapper').parser;
const j = require('./utils/JSCodeshiftWrapper').j
let util = require('util');

//Import codemods
const codeModeAst = require('./components/consoleAst');
const codeModeOperators = require('./components/operators/findOperators');
const codeModeRxjsCalls = require('./components/operators/operatorsUse');
const codeModeRxjsSubject = require('./components/subjects/subjectInUse');
const codeModeRxjsObservables = require('./components/observables/observablesInUse');
const codeModeRxjsPipelines = require('./components/pipelines/pipelinesInUse')
const aggregateCalc = require("./utils/aggregateResults")
const program = require('commander');
const fileUtils = require('../main/utils/fileutils');
const converter = require('json-2-csv');
const csvModule = require('./utils/exportToCsv')

let csvRows = {
    rows: []
}

const resultsArray = [];
let aggregationToCsv = [];
let arrayToJson = [];

program
    .option('-f, --findOperator <name>', 'count rxjs operator')
    .option('-o, --operatorsInUse <source>', 'find all operators of rxjs library that are used in the file')
    .option('-s, --subjectInUse <source>', 'find the usage of subject property of rxjs library')
    .option('-v, --observablesInUse <source>', 'find the usage of observable constructors  of rxjs library')
    .option('-e, --exportToCsv', 'export the results from previous calculations')
    .option('-a, --aggregateResults <showResultsInConsole>', 'aggregate the results from previous calculations and (optional) show them in terminal')
    .option('-p, --pipelinesUsage <source> <action>', 'find the pipelines that have been used in your codebase');
program.parse(process.argv);

if (program.findOperator) {
    main('src/test/resources', program.findOperator, "findOperator");
} else if (program.operatorsInUse) {
    if (program.operatorsInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.operatorsInUse;
    main(source, "", "operatorsInUse", "");
} else if (program.subjectInUse) {
    if (program.subjectInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.subjectInUse;
    main(source, "", "subjectInUse", "");
} else if (program.pipelinesUsage) {
    if (program.pipelinesUsage.length < 2) {
        program.help();
        return;
    }
    let action = program.args[0];
    let aggregateAnswer = program.args[1];
    let source = program.pipelinesUsage;
    main(source, "", "pipelinesUsage", "", action,aggregateAnswer);
} else if (program.observablesInUse) {
    if (program.observablesInUse.length < 2) {
        program.help();
        return;
    }
    let source = program.observablesInUse;
    main(source, "", "observablesInUse", "");
} 
// else if (program.exportToCsv) {
//     if (program.exportToCsv.length < 2) {
//         program.help();
//         return;
//     }
//     let source = program.exportToCsv
//     main(source, "", "exportToCsv", "");
// } 
// else if (program.aggregateResults) {
//     if (program.aggregateResults.length < 2) {
//         program.help();
//         return;
//     }
//     let source = ""
//     main(source, "", "aggregateResults", program.aggregateResults);
// }

function main(path, operatorName, option, action,aggregateAnswer) {
    arrayToJson = [];
    if (!fs.existsSync(path) && option !== "exportToCsv" && option !== "aggregateResults") {
        console.log("Wrong directory ", path);
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
            arrayToJson = [...resultsArray, ...codeModeRxjsCalls.operatorsUse(ast, j, file, filename, files, files.indexOf(file), csvRows)]
        } else if (option == "subjectInUse") {
            arrayToJson = [...resultsArray, ...codeModeRxjsSubject.subjectInUse(ast, j, file, filename, files, files.indexOf(file), csvRows)];
        } else if (option == "observablesInUse") {
            arrayToJson = [...resultsArray, ...codeModeRxjsObservables.observablesInUse(ast, j, file, filename, files, files.indexOf(file), csvRows)];
        } else if (option == "pipelinesUsage") {
            arrayToJson = [...resultsArray, ...codeModeRxjsPipelines.pipelinesInUse(ast, j, file, filename, files, files.indexOf(file), csvRows)];
        }
    })
    fs.writeFileSync('./resultsArray.json', util.inspect(arrayToJson, { maxArrayLength: null }));
    if (action === "e") {
        handleActions("exportToCsv");
    } else if (action === "a") {
        handleActions("aggregateResults",aggregateAnswer);
    }
};

function handleActions(option,aggregateAnswer) {
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
            aggregationToCsv = aggregateCalc.aggregateCalc(results, aggregateAnswer);
        }
        return;
    }
}