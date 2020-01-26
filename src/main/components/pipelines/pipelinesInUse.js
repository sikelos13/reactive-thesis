let myModule = {};
const pipeDomain = require('./utils/pipeDomain');
const pipeDomainArray = []

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
myModule.pipelinesInUse = (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    let operatorsInsidePipe = [];
    let operatorsWithAliasInPipe = []
    let uniqueOperators = [];
    let operatorsObject = [];
    let uniqueAlias = [];
    let importSpecifier = [];
    let uniqueOperatorsInsidePipeline = [];
    let uniqueOperatorsWithAliasInPipeline = [];
    let pipeVar = {}

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

    if (index == 0) {
        //Initialize array with columns titles
        pipeDomainArray.push(pipeDomain.createObjectFunc("Alias or name used", "Position start", "Position end", "Filename", "Is Pipeline", "Nested Operators"));
    }
    // let argumentVar = {}
    // let pipeArray = [];
    // let pipeArguments = [];

    // rxjsImportDeclarations.forEach(p => {
    //     // p.parentPath.parentPath.node.arguments.forEach(arg => {
    //     //     console.log(arg.callee.name)
    //     // })

    //     if (p.parentPath.parentPath.node.type == "CallExpression" && p.parentPath.parentPath.node.callee.property && p.parentPath.parentPath.node.callee.property.name === "pipe") {
    //         argumentVar = p.value
    //         pipeVar = p.parentPath.parentPath.node

    //     }
    // })
    rxjsImportDeclarations.forEach(p => {
        const pipeArguments = []

        if (p.value.name === "pipe") {
            // console.log("test")
            pipeVar = p.value;
            console.log(p.value)
            // console.log(p.parentPath.parentPath.node.arguments)
            p.parentPath.parentPath.__childCache.arguments.value.forEach(arg => {
                pipeArguments.push(arg.callee.name)
            })
            pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe", pipeVar.start, pipeVar.end, filename, "True", pipeArguments));
        }
    })
    console.log(pipeDomainArray)
    //     pipeArguments.forEach(argument => {
    //         if (uniqueOperators.indexOf(argument.name) > -1){
    //             operatorsInsidePipe.push(argument.name)

    //             pipeDomainArray.push(pipeDomain.createObjectFunc(argument.name, argument.start, argument.end, filename, "False",""));

    //         } else if (uniqueAlias.indexOf(argument.name) > -1) {
    //             operatorsInsidePipe.push(argument.name)
    //             pipeDomainArray.push(pipeDomain.createObjectFunc(argument.name, argument.start, argument.end, filename, "False",""));
    //         }
    //    })

    return pipeDomainArray;
};

module.exports = myModule;