let csvModule = require('../utils/jsonToCsv');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');

/**
 * Rename to operatorsUse
 * Receives as input the src of the files to be scanned
 * returns the object with the operator, its usage and the file we had found it. 
 * 
 * Object 
 * 
 * { operator: operator,
 *    count: <number>
 *    file: <path of file>
 * }
 */
myModule.operatorsUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    let showOperatorsUsed = [];
    let count = 0;
    let newCount = 0;
    let uniqueOperators = [];
    let uniqueAlias = [];
    let importSpecifier = [];

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && p.parentPath.parentPath.node.source.value == "rxjs/operators") {
            if (p.parentPath.value.imported.name !== p.parentPath.value.local.name) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            }else {
                p.parentPath.parentPath.node.specifiers.forEach(operatorImport => {
                    importSpecifier.push(operatorImport.imported.name);
                })
            }
        }
    })
    uniqueOperators = [...new Set(importSpecifier)];
    uniqueAlias = [...new Set(importedCalledWithAlias)];
    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showOperatorsUsed.push({
            operatorName: "Operator variable/alias used",
            operatorCalled: "Times Used",
            file: "Found in file:"
        })
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        if (uniqueAlias.length < 1) {
        uniqueOperators.forEach(operator => {
            rxjsImportDeclarations.forEach(nodeOperator => {
                // console.log(nodeOperator.value.name)
                if(operator == nodeOperator.value.name && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration" ) {
                    newCount++;
                }
            })
            showOperatorsUsed.push({
                operatorName: operator,
                operatorCalled: newCount,
                file: dir
            })
            newCount = 0;
        })
    }  else {
        uniqueAlias.forEach(alias => {
            rxjsImportDeclarations.forEach(nodeObservable => {
        
                if (nodeObservable.value.name == alias && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" ) {
                    count++;
                } 
            })
           
            if (count > 0) {
                showOperatorsUsed.push({
                    operatorName: 'Alias: '+alias,
                    operatorCalled: count,
                    file: dir
                })
                count = 0;
            }
        })
    }

        //     //Push the array of objects for csv export 
            Array.prototype.push.apply(csvRows.rows, showOperatorsUsed);

        //     //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
            if (index == (filesArray.length - 1)) {
                converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                    prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
                });

                //iterate into csvRows in order to console log specific results.
                let tempConsoleArray = csvRows.rows
                let res = alasql('SELECT operatorName, SUM(operatorCalled) AS operatorCalled FROM ? GROUP BY operatorName', [tempConsoleArray]);
                res.shift();
                // console.log(res);
            }
    } catch (err) {
        console.log(err)
    }

};

module.exports = myModule;