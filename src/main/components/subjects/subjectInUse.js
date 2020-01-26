let myModule = {};
const subjectDomain = require('./utils/subjectDomain');
const subjectsDomainArray = []

myModule.subjectInUse = function (root, j, dir, filename, filesArray, index, csvRows) {
    const rxjsImportDeclarations = root.find(j.Identifier)
    let importedVariable = [];
    let importedCalledWithAlias = [];
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
        subjectsDomainArray.push(subjectDomain.createObjectFunc("Subject variable/alias used", "Position start", "Position end", "", "Filename"));
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
                    subjectsDomainArray.push(subjectDomain.createObjectFunc("Subject", nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir));
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
                        subjectsDomainArray.push(subjectDomain.createObjectFunc(nodeSubject.value.name, nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir));
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
                    subjectsDomainArray.push(subjectDomain.createObjectFunc("Variable: "+nodeSubject.value.name, nodeSubject.value.start, nodeSubject.value.end, nodeSubject, dir));
                }
            });
        });

    } catch (err) {
        console.log(err)
    }
    return subjectsDomainArray;
};

module.exports = myModule;