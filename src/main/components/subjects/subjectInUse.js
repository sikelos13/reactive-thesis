let myModule = {};
const subjectDomain = require('../../utils/objectGenerator');
const subjectsDomainArray = []

myModule.subjectInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier)
    let importedVariable = [];
    let importedCalledWithAlias = [];
    // let showSubjectUsed = [];
    // let count = 0;
    // let newCount = 0;
    // let variableCount = 0;
    let uniqueAlias = []
    let uniqueVariables = [];

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && p.parentPath.parentPath.node.source.value == "rxjs") {
            // console.log(p)
            if ((p.parentPath.value.imported.name !== p.parentPath.value.local.name) && (p.parentPath.value.local.name == "Subject")) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            }
        }
    })

    uniqueAlias = [...new Set(importedCalledWithAlias)];

    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        subjectsDomainArray.push(subjectDomain.createObjectFunc("Subject variable/alias used", "Position start", "Position end", "", "Filename","Times Used"));
        // showSubjectUsed.push({
        //     subjectVar: "Subject variable/alias used",
        //     subjectCalled: "Times Used",
        //     file: "Found in file:"
        // })
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        if (uniqueAlias.length < 1) {
            rxjsImportDeclarations.forEach(nodeSubject => {

                if (nodeSubject.value.name == "Subject" && nodeSubject.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeSubject.parentPath.value.type == "NewExpression") {
                    // newCount++;
                    subjectsDomainArray.push(subjectDomain.createObjectFunc("Subject", nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir,1));
                }
                if (nodeSubject.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeSubject.parentPath.parentPath.value.type == "AssignmentExpression") {
                    if (nodeSubject.parentPath.parentPath.value.right.type == "NewExpression" && nodeSubject.parentPath.parentPath.value.right.callee.name == "Subject" && nodeSubject.parentPath.parentPath.value.right.callee.type == "Identifier") {
                        // console.log(nodeSubject.parentPath.parentPath.value);
                        if (nodeSubject.parentPath.parentPath.value.left.type == "MemberExpression") {
                            if (nodeSubject.parentPath.parentPath.value.left.property.type == "Identifier") {
                                importedVariable.push(nodeSubject.parentPath.parentPath.value.left.property.name);
                                //continue implementing the idea of variables
                            }
                        }
                    }
                }
            })

        } else {
            uniqueAlias.forEach(alias => {
                rxjsImportDeclarations.forEach(nodeSubject => {
                    if (nodeSubject.value.name == alias && nodeSubject.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeSubject.parentPath.value.type == "NewExpression") {
                        // count++;
                        // console.log(nodeSubject.value.name)
                        subjectsDomainArray.push(subjectDomain.createObjectFunc(nodeSubject.value.name, nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir,1));
                    }
                    if (nodeSubject.parentPath.parentPath.node.type !== "ImportDeclaration" && nodeSubject.parentPath.parentPath.value.type == "AssignmentExpression") {
                        if (nodeSubject.parentPath.parentPath.value.right.type == "NewExpression" && nodeSubject.parentPath.parentPath.value.right.callee.name == alias && nodeSubject.parentPath.parentPath.value.right.callee.type == "Identifier") {
                            if (nodeSubject.parentPath.parentPath.value.left.type == "MemberExpression") {
                                if (nodeSubject.parentPath.parentPath.value.left.property.type == "Identifier") {
                                    importedVariable.push(nodeSubject.parentPath.parentPath.value.left.property.name);
                                }
                            }
                        }
                    }
                })

                // if (count > 0) {
                //     showSubjectUsed.push({
                //         subjectVar: 'Alias: ' + alias,
                //         subjectCalled: count,
                //         file: dir
                //     })
                //     count = 0;
                // }
            })
        }

        uniqueVariables = [...new Set(importedVariable)];

        uniqueVariables.forEach(variable => {
            rxjsImportDeclarations.forEach(nodeSubject => {
                if (variable == nodeSubject.value.name && nodeSubject.parentPath.parentPath.node.type !== "ImportDeclaration") {
                    // console.log(nodeSubject.value)
                    // variableCount++;
                    subjectsDomainArray.push(subjectDomain.createObjectFunc("Variable: "+nodeSubject.value.name, nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir,1));
                }
            })
            // showSubjectUsed.push({
            //     subjectVar: 'Variable: ' + variable,
            //     subjectCalled: variableCount,
            //     file: dir
            // })
            // newCount = 0;
        })

        // if (newCount > 0) {
        //     showSubjectUsed.push({
        //         subjectVar: "Subject_without_variable",
        //         subjectCalled: newCount,
        //         file: dir
        //     })
        //     newCount = 0;

        //Push the array of objects for csv export 
        // Array.prototype.push.apply(csvRows.rows, showSubjectUsed);

        //When we come down to the last file to scan we aggregate all the results in order to export them into a csv file
        // if (index == (filesArray.length - 1)) {

        //     converter.json2csv(csvRows.rows, csvModule.json2csvCallback, {
        //         prependHeader: false // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
        //     });

        //     //iterate into csvRows in order to console log specific results.
        //     let tempConsoleArray = csvRows.rows
        //     let res = alasql('SELECT subjectVar, SUM(subjectCalled) AS subjectCalled FROM ? GROUP BY subjectVar', [tempConsoleArray]);
        //     res.shift();
        //     // console.log(res);
        // }

    } catch (err) {
        console.log(err)
    }
    return subjectsDomainArray;
};

module.exports = myModule;