const csvModule = require('../utils/jsonToCsv');
let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');

function containsWord(str, word) {
    return str.match(new RegExp("\\b" + word + "\\b")) != null;
}

myModule.observablesInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier)
    let importedCalled = [];
    let importedCalledWithAlias = [];
    let showObservableUsed = [];
    let count = 0;
    let newCount = 0;
    let uniqueAlias = []
    let tempObservableCalled = 0;

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && (p.parentPath.parentPath.node.source.value == "rxjs/Observables" || p.parentPath.parentPath.node.source.value == "rxjs")) {
            console.log(p.parentPath.value.imported.name)
            if(p.parentPath.value.imported.name !== p.parentPath.value.local.name) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            }
        }
    })

    uniqueAlias = [...new Set(importedCalledWithAlias)];

    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showObservableUsed.push({
            observableVar: "Observable variable",
            observableCalled: "Times Used",
            file: "Found in file:"
        })
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        uniqueAlias.forEach(alias => {
            rxjsImportDeclarations.forEach(nodeObservable => {
                // console.log(nodeObservable.parentPath.value.type)
                if(alias == nodeObservable.value.name && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" ) {
                    count++;
                }else if (nodeObservable.value.name == "Observable" && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.value.type == "NewExpression") {
                    newCount++;
                }
            })
            showObservableUsed.push({
                observableVar: alias,
                observableCalled: count,
                file: dir
            })
            showObservableUsed.push({
                observableVar: "Observable_without_variable",
                observableCalled: newCount,
                file: dir
            })
            count = 0;

            newCount =0;
        })
        

        //Push the array of objects for csv export 
        Array.prototype.push.apply(csvRows.rows, showObservableUsed);

        //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
        if (index == (filesArray.length - 1)) {
            
            converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            });

            //iterate into csvRows in order to console log specific results.
            let tempConsoleArray = csvRows.rows
            let res = alasql('SELECT observableVar, SUM(observableCalled) AS observableCalled FROM ? GROUP BY observableVar', [tempConsoleArray]);
            res.shift();
            console.log(res);
        }
        
    } catch (err) {
        console.log(err)
    }

    if (importedCalled.length > 0) {
        console.log(`File has imported : ` + importedCalled.length + "  observable constructor.");
    } else {
        console.log("File doesn't not include  rxjs observables constructors")
    }

};

module.exports = myModule;