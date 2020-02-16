let myModule = {};
const pipeDomain = require('./utils/pipeDomain');
const codeModeRxjsCallsOperators = require('../operators/operatorsUse');
const pipeDomainArray = []

/**
 * Receives as input the src of the files to be scanned
 * returns the object with the  pipeline and its nested operators or pipes, its usage and the file we had found it. 
 * 
 * Object 
 * 
 */
myModule.pipelinesInUse = (root, j, dir, filename, filesArray, index, csvRows) => {
    const rxjsImportDeclarations = root.find(j.Identifier);
    const operatorsArray = codeModeRxjsCallsOperators.operatorsUse(root, j, dir, filename, filesArray, index, csvRows);
    const importedFromRxjs = [];
    let pipeVar = {};
    let object = {}
    let uniqueImportations = [];

    rxjsImportDeclarations.forEach(p => {
        if (p.parentPath.parentPath.node.type == "ImportDeclaration" && (p.parentPath.parentPath.node.source.value == "rxjs/Observables" || p.parentPath.parentPath.node.source.value == "rxjs")) {
            importedFromRxjs.push(p.parentPath.value.local.name);
        }
    })
    uniqueImportations = [...new Set(importedFromRxjs)];

    // console.log(uniqueImportations)

    if (index == 0) {
        pipeDomainArray.push(pipeDomain.createObjectFunc("Alias or name used", "Line start", "Line end", "Filename", "Nested Operators", "Pipe is nested to", "Initializing Pipeline"));
    }
    try {

        rxjsImportDeclarations.forEach(p => {
            const pipeArguments = []
            let pipeInit = []
            let initOfPipe = "";
            if (p.value.name === "pipe") {
                let firstRoot = p.parentPath.parentPath.parentPath.parentPath;
                let secRoot = p.parentPath.parentPath;
                let thirdRoot = p.parentPath.parentPath.parentPath;
                let fourthRoot = p.parentPath.parentPath.parentPath.parentPath.parentPath;
                pipeVar = {};

                if (p.parentPath.parentPath.value.arguments !== undefined) {
                    p.parentPath.parentPath.value.arguments.forEach(arg => {
                        initOfPipe = ""
                        if (secRoot.name === "init" || firstRoot.name === "init" || thirdRoot.name === "init") {

                            object = {
                                name: "pipe",
                                start: arg.loc.start.line,
                                end: arg.loc.end.line,
                            }

                            pipeVar = {
                                start: arg.loc.start.line,
                                end: arg.loc.end.line,
                            }

                            operatorsArray.map(operator => {
                                if (arg && arg.callee) {
                                    if (operator.line === arg.callee.loc.start.line) {
                                        pipeArguments.push(arg.callee.name);
                                    }
                                }
                            })
                            uniqueImportations.map(importName => {

                                if (firstRoot.value.callee !== undefined && firstRoot.value.callee.name === importName) {
                                    initOfPipe = firstRoot.value.callee.name;
                                } else if (secRoot.value.callee.object.callee !== undefined && secRoot.value.callee.object.callee.name === importName) {
                                    initOfPipe = secRoot.value.callee.object.callee.name;
                                } else {
                                    initOfPipe = "Random function"
                                }
                            })

                        } else if (thirdRoot.name === "expression" || secRoot.name === "argument" || fourthRoot.name === "arguments" || firstRoot.name === "argument" || thirdRoot.name === "arguments" || thirdRoot.name === "argument" || firstRoot.name === "expression" || secRoot.name === "body" || firstRoot.name === "body") {
                            if (p.parentPath.value.property.name === "pipe") {

                                pipeVar = {
                                    start: p.parentPath.value.property.loc.start.line,
                                    end: p.parentPath.value.property.loc.end.line
                                }

                                operatorsArray.map(operator => {
                                    if (arg && arg.callee) {
                                        if (operator.line === arg.callee.loc.start.line) {
                                            pipeArguments.push(arg.callee.name);
                                        }
                                    }
                                })

                                uniqueImportations.map(importName => {

                                    if (firstRoot.value.callee !== undefined && firstRoot.value.callee.name === importName) {
                                        initOfPipe = firstRoot.value.callee.name;
                                    } else if (secRoot.value.callee.object.callee !== undefined && secRoot.value.callee.object.callee.name === importName) {
                                        initOfPipe = secRoot.value.callee.object.callee.name;
                                    } else {
                                        initOfPipe = "Random function"
                                    }
                                })

                                if (pipeInit.indexOf(object) === -1) {
                                    pipeInit.push(object);
                                }

                            }
                        }
                    })
                }
                if (secRoot.name === "init" || firstRoot.name === "init" || thirdRoot.name === "init") {
                    pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe", pipeVar.start, pipeVar.end, filename, pipeArguments, '', initOfPipe));
                } else if (object.start && object.end && pipeVar.start && pipeVar.end && initOfPipe) {
                    pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe", pipeVar.start, pipeVar.end, filename, pipeArguments, `Nested in pipe of lines ${object.start} to ${object.end}`, initOfPipe));
                } else if (thirdRoot.name === "expression" || secRoot.name === "argument" || fourthRoot.name === "arguments" || firstRoot.name === "argument" || thirdRoot.name === "argument" || thirdRoot.name === "arguments" || firstRoot.name === "expression" || secRoot.name === "body" || firstRoot.name === "body") {
                    pipeDomainArray.push(pipeDomain.createObjectFunc("Pipe as argument", pipeVar.start, pipeVar.end, filename, pipeArguments, `Nested in object or function`, initOfPipe));
                }
            }
        })
    } catch (error) {
        return
    }
    return pipeDomainArray;
};

module.exports = myModule;