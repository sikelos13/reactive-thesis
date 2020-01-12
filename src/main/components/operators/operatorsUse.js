let csvModule = require('../../utils/exportToCsv');
let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');
const operatorDomain = require('./utils/operatorDomain');
const operatorDomainArray = []
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
myModule.operatorsUse =  (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    let showOperatorsUsed = [];
    let count = 0;
    let newCount = 0;
    let uniqueOperators = [];
    let uniqueAlias = [];
    let importSpecifier = [];
    let operatorObject = {}

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && p.parentPath.parentPath.node.source.value == "rxjs/operators") {
            if (p.parentPath.value.imported.name !== p.parentPath.value.local.name) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            } else {
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
                    if (operator == nodeOperator.value.name && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {
                        newCount++;
                        operatorDomainArray.push(operatorDomain.operatorObjectCalc(operator, nodeOperator,filename));
                    }
                })
                showOperatorsUsed.push({
                    operatorName: operator,
                    operatorCalled: newCount,
                    file: dir
                })
                newCount = 0;
            })
        } else {
            uniqueAlias.forEach(alias => {
                rxjsImportDeclarations.forEach(nodeOperator => {

                    if (nodeOperator.value.name == alias && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {
                        count++;
                        operatorDomainArray.push(operatorDomain.operatorObjectCalc(alias, nodeOperator,filename));
                    }
                })

                if (count > 0) {
                    showOperatorsUsed.push({
                        operatorName: 'Alias: ' + alias,
                        operatorCalled: count,
                        file: dir
                    })
                    count = 0;
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
    // console.log(operatorDomainArray);
    // fs.writeFile('resultsArray.json', JSON.stringify(operatorObject))
    return operatorDomainArray;
};

module.exports = myModule;