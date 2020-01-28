let myModule = {};
const pipeDomain = require('./utils/pipeDomain');
const pipeDomainArray = []

/**
 * Receives as input the src of the files to be scanned
 * returns the object with the operator, its usage and the file we had found it. 
 * 
 * Object 
 * 
 */
myModule.pipelinesInUse = (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    let importedCalledWithAlias = [];
    // let operatorsInsidePipe = [];
    // let operatorsWithAliasInPipe = []
    // let uniqueOperators = [];
    // let operatorsObject = [];
    // let uniqueAlias = [];
    let importSpecifier = [];
    // let uniqueOperatorsInsidePipeline = [];
    // let uniqueOperatorsWithAliasInPipeline = [];
    let pipeVar = {}

    //Find how many identifiers we import from the rxjs library
    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && p.parentPath.parentPath.node.source.value == "rxjs/operators") {
            if (p.parentPath.value.imported.name !== p.parentPath.value.local.name) {
                importedCalledWithAlias.push(p.parentPath.value.imported.name);
            } else {
                p.parentPath.parentPath.node.specifiers.forEach(operatorImport => {
                    importSpecifier.push(operatorImport.imported.name);
                });
            }
        }
    });

    uniqueOperators = [...new Set(importSpecifier)];
    uniqueAlias = [...new Set(importedCalledWithAlias)];

    if (index == 0) {
        //Initialize array with columns titles
        pipeDomainArray.push(pipeDomain.createObjectFunc("Alias or name used", "Position start", "Position end", "Filename", "Is Pipeline", "Nested Operators", "Pipe is nested to"));
    }
    let object = {}

    rxjsImportDeclarations.forEach(p => {
        const pipeArguments = []
        let pipeInit = []

        if (p.value.name === "pipe") {
            pipeVar = {};

            // console.log(p.parentPath.parentPath.value.arguments)
            p.parentPath.parentPath.value.arguments.forEach(arg => {
                if (p.parentPath.parentPath.name === "init") {
                    object = {
                        name: "pipe",
                        start: arg.loc.start.line,
                        end: arg.loc.end.line
                    }
                    pipeVar = {
                        start: arg.loc.start.line,
                        end: arg.loc.end.line
                    }
                    if (arg && arg.callee) {

                        pipeArguments.push(arg.callee.name);
                        // pipeInit.push(object)
                    }
                } else if (p.parentPath.parentPath.name === "argument") {
                    // console.log(p.parentPath.value)
                    if (p.parentPath.value.property.name === "pipe") {
                        // console.log(p.parentPath.value.property.loc.start)
                        pipeVar = {
                            start: p.parentPath.value.property.loc.start.line,
                            end: p.parentPath.value.property.loc.end.line
                        }
                        if (pipeInit.indexOf(object) === -1) {
                            pipeInit.push(object);
                        }
                    }
                    if (arg && arg.callee) {
                        pipeArguments.push(arg.callee.name);
                    }
                }

            })
            if (p.parentPath.parentPath.name === "init") {
                pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe", pipeVar.start, pipeVar.end, filename, "True", pipeArguments, ''));
            } else {
                pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe", pipeVar.start, pipeVar.end, filename, "True", pipeArguments, `Nested in pipe of lines ${object.start} to ${object.end}`));
            }
        }
    })

    console.log(pipeDomainArray)

    return pipeDomainArray;
};

module.exports = myModule;