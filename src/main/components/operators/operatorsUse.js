let myModule = {};
const operatorDomain = require('./utils/operatorDomain');
let operatorDomainArray = []

/**
 * Rename to operatorsUse
 * Receives as input the src of the files to be scanned
 * returns the object with the operator, its usage and the file we had found it. 
 * 
 * Object 
 * 
 * { operator: operator,
 *    timesUsed: <number>
 *    file: <path of file>
 * }
 */
function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

myModule.operatorsUse = (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    let uniqueOperators = [];
    let uniqueAlias = [];
    let importSpecifier = [];

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && p.parentPath.parentPath.node.source.value == "rxjs/operators") {
            if(p.parentPath.value !== undefined && p.parentPath.value.imported !== undefined) {
                if (p.parentPath.value.imported.name !== p.parentPath.value.local.name) {
                    importedCalledWithAlias.push({ alias: p.parentPath.value.local.name, name: p.parentPath.value.imported.name });
                } else {
                    p.parentPath.parentPath.node.specifiers.forEach(operatorImport => {
                        importSpecifier.push(operatorImport.imported.name);
                    })
                }
            }
        
        }
    })

    uniqueOperators = [...new Set(importSpecifier)];
    uniqueAlias = removeDuplicates(importedCalledWithAlias, "alias");
    //Push the head titles only on first file
    if (index == 0) {
        //Initialize array with columns titles
        operatorDomainArray.push(operatorDomain.createObjectFunc("Alias or name used", "Line", "", "Filename"));
    }
    //iterate the imported identifiers  and scan files for operators
    try {
        rxjsImportDeclarations.forEach(nodeOperator => {

            uniqueOperators.forEach(operator => {
                if (operator == nodeOperator.value.name && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {
                    // newCount++;
                    if (nodeOperator.parentPath.value !== undefined && nodeOperator.parentPath.value.callee !== undefined) {
                        operatorDomainArray.push(operatorDomain.createObjectFunc(operator, nodeOperator.parentPath.value.callee.loc.start.line, nodeOperator, dir));
                    }
                }
            })

            uniqueAlias.forEach(aliasObject => {

                if (nodeOperator.value.name == aliasObject.alias && nodeOperator.parentPath.parentPath.node.type !== "ImportDeclaration") {

                    if (nodeOperator.parentPath.value !== undefined && nodeOperator.parentPath.value.callee !== undefined) {
                        operatorDomainArray.push(operatorDomain.createObjectFunc(`${aliasObject.name} as ${aliasObject.alias}`, nodeOperator.parentPath.value.callee.loc.start.line, nodeOperator, dir));
                    }
                }
            })
        }
        )

    } catch (err) {
        console.log(err)
    }
    operatorDomainArray = removeDuplicates(operatorDomainArray, "line");
    return operatorDomainArray;
};

module.exports = myModule;