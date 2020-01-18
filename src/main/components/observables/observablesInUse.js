let myModule = {};
const observableDomain = require('../../utils/objectGenerator');
const observableDomainArray = []

myModule.observablesInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier)
    let importedVariable = [];
    let importedCalledWithAlias = [];
    let variableCount = 0;
    let uniqueAlias = []
    let uniqueVariables = [];

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && (p.parentPath.parentPath.node.source.value == "rxjs/Observables" || p.parentPath.parentPath.node.source.value == "rxjs")) {
            if ((p.parentPath.value.imported.name !== p.parentPath.value.local.name) && (p.parentPath.value.local.name == "Observable")) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            }
        }
    })

    uniqueAlias = [...new Set(importedCalledWithAlias)];

    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        observableDomainArray.push(observableDomain.createObjectFunc("Observable variable/alias used", "Position start", "Position end", "", "Filename","Times Used"));

        // showObservableUsed.push({
        //     subjectVar: "Observable variable/alias used",
        //     subjectCalled: "Times Used",
        //     file: "Found in file:"
        // })
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        if (uniqueAlias.length < 1) {
            rxjsImportDeclarations.forEach(nodeObservable => {

                if (nodeObservable.value.name == "Observable" && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeObservable.parentPath.value.type == "NewExpression") {
                    // newCount++;
                    observableDomainArray.push(observableDomain.createObjectFunc("Observable", nodeObservable.value.start, nodeObservable.value.end, nodeObservable, dir,1));

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
                        // count++;
                        // console.log(nodeObservable.value.name )
                        observableDomainArray.push(observableDomain.createObjectFunc(nodeObservable.value.name , nodeObservable.value.start, nodeObservable.value.end, nodeObservable, dir,1));

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
               
                // if (count > 0) {
                //     showObservableUsed.push({
                //         subjectVar: 'Alias: '+alias,
                //         subjectCalled: count,
                //         file: dir
                //     })
                //     count = 0;
                // }
            })
        }

        uniqueVariables = [...new Set(importedVariable)];

        uniqueVariables.forEach(variable => {
            rxjsImportDeclarations.forEach(nodeObservable => {
                if (variable == nodeObservable.value.name && nodeObservable.parentPath.parentPath.node.type !== "ImportDeclaration") {
                    // console.log(nodeObservable.value)
                    // variableCount++;
                    observableDomainArray.push(nodeObservable.value.name.createObjectFunc(nodeObservable.value.name , nodeObservable.value.start, nodeObservable.value.end, nodeObservable, dir,1));

                }
            })
            // showObservableUsed.push({
            //     subjectVar: 'Variable: '+variable,
            //     subjectCalled: variableCount,
            //     file: dir
            // })
            // newCount = 0;
        })

        // if (newCount > 0) {
        //     showObservableUsed.push({
        //         subjectVar: "Observable_without_variable",
        //         subjectCalled: newCount,
        //         file: dir
        //     })
        //     newCount = 0;
        // }

    } catch (err) {
        console.log(err)
    }

    return observableDomainArray;
};

module.exports = myModule;