let myModule = {};
const operatorDomain = require('../../utils/objectGenerator');
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
myModule.operatorsUse = (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    // let showOperatorsUsed = [];
    // let count = 0;
    // let newCount = 0;
    let uniqueOperators = [];
    let uniqueAlias = [];
    let importSpecifier = [];

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
        operatorDomainArray.push(operatorDomain.createObjectFunc("Alias or name used", "Position start", "Position end", "", "Filename","Times Used"));
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        if (uniqueAlias.length < 1) {
            uniqueOperators.forEach(operator => {
                rxjsImportDeclarations.forEach(nodeOperator => {
                    if (operator == nodeOperator.value.name && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {
                        // newCount++;
                        operatorDomainArray.push(operatorDomain.createObjectFunc(operator, nodeOperator.value.start, nodeOperator.value.end, nodeOperator, dir,1));
                    }
                })
                // showOperatorsUsed.push({
                //     operatorName: operator,
                //     operatorCalled: newCount,
                //     file: dir
                // })
                // newCount = 0;
            })
        } else {
            uniqueAlias.forEach(alias => {
                rxjsImportDeclarations.forEach(nodeOperator => {
                    if (nodeOperator.value.name == alias && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {
                        // count++;
                        operatorDomainArray.push(operatorDomain.createObjectFunc(alias, nodeOperator.value.start, nodeOperator.value.end, nodeOperator, dir,1));
                    }
                })

                // if (count > 0) {
                //     showOperatorsUsed.push({
                //         operatorName: 'Alias: ' + alias,
                //         operatorCalled: count,
                //         file: dir
                //     })
                //     count = 0;
                // }
            })
        }
    } catch (err) {
        console.log(err)
    }

    return operatorDomainArray;
};

module.exports = myModule;