const csvModule = require('../../utils/jsonToCsv');
let fs = require('fs');
var myModule = {};
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const converter = require('json-2-csv');
const alasql = require('alasql');

myModule.observablesInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier)
    let importedVariable = [];
    let importedCalledWithAlias = [];
    let showObservableUsed = [];
    let count = 0;
    let newCount = 0;
    let variableCount = 0;
    let uniqueAlias = []
    let uniqueVariables = [];

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && (p.parentPath.parentPath.node.source.value == "rxjs/Observables" || p.parentPath.parentPath.node.source.value == "rxjs")) {
            // console.log(p)
            if ((p.parentPath.value.imported.name !== p.parentPath.value.local.name) && (p.parentPath.value.local.name == "Observable")) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            }
        }
    })

    uniqueAlias = [...new Set(importedCalledWithAlias)];

    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        showObservableUsed.push({
            subjectVar: "Observable variable/alias used",
            subjectCalled: "Times Used",
            file: "Found in file:"
        })
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        if (uniqueAlias.length < 1) {
            rxjsImportDeclarations.forEach(nodeObservable => {

                if (nodeObservable.value.name == "Observable" && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.value.type == "NewExpression") {
                    newCount++;
                } 
                 if (nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.parentPath.value.type == "AssignmentExpression") {

                    if(nodeObservable.parentPath.parentPath.value.right.type == "NewExpression" && nodeObservable.parentPath.parentPath.value.right.callee.name== "Observable" && nodeObservable.parentPath.parentPath.value.right.callee.type== "Identifier") {

                        if (nodeObservable.parentPath.parentPath.value.left.type == "MemberExpression") {
                            if (nodeObservable.parentPath.parentPath.value.left.property.type == "Identifier") {
                                importedVariable.push(nodeObservable.parentPath.parentPath.value.left.property.name);
                            //continue implementing the idea of variables
                            }
                        }
                    }
                }
            })

        } else {
            uniqueAlias.forEach(alias => {
                rxjsImportDeclarations.forEach(nodeObservable => {
                    if (nodeObservable.value.name == alias && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.value.type == "NewExpression") {
                        count++;
                        console.log(nodeObservable.value.name )
                    } 
                    if (nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.parentPath.value.type == "AssignmentExpression") {
    
                        if(nodeObservable.parentPath.parentPath.value.right.type == "NewExpression" && nodeObservable.parentPath.parentPath.value.right.callee.name== alias && nodeObservable.parentPath.parentPath.value.right.callee.type== "Identifier") {
    
                            if (nodeObservable.parentPath.parentPath.value.left.type == "MemberExpression") {
                                if (nodeObservable.parentPath.parentPath.value.left.property.type == "Identifier") {
                                // console.log(nodeObservable.parentPath.parentPath.value.left.property.name);
                                    importedVariable.push(nodeObservable.parentPath.parentPath.value.left.property.name);
                                //continue implementing the idea of varaibles
                                }
                            }
                        }
                    }
                })
               
                if (count > 0) {
                    showObservableUsed.push({
                        subjectVar: 'Alias: '+alias,
                        subjectCalled: count,
                        file: dir
                    })
                    count = 0;
                }
            })
        }

        uniqueVariables = [...new Set(importedVariable)];

        uniqueVariables.forEach(variable => {
            rxjsImportDeclarations.forEach(nodeObservable => {
                if (variable == nodeObservable.value.name && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration") {
                    // console.log(nodeObservable.value)
                    variableCount++;
                }
            })
            showObservableUsed.push({
                subjectVar: 'Variable: '+variable,
                subjectCalled: variableCount,
                file: dir
            })
            newCount = 0;
        })

        if (newCount > 0) {
            showObservableUsed.push({
                subjectVar: "Observable_without_variable",
                subjectCalled: newCount,
                file: dir
            })
            newCount = 0;
        }

        //Push the array of objects for csv export 
        Array.prototype.push.apply(csvRows.rows, showObservableUsed);

        //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
        if (index == (filesArray.length - 1)) {

            converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
                prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            });

            //iterate into csvRows in order to console log specific results.
            let tempConsoleArray = csvRows.rows
            global.observableResults = tempConsoleArray;
            let res = alasql('SELECT subjectVar, SUM(subjectCalled) AS subjectCalled FROM ? GROUP BY subjectVar', [tempConsoleArray]);
            res.shift();
            // console.log(res);
        }

    } catch (err) {
        console.log(err)
    }

};

module.exports = myModule;