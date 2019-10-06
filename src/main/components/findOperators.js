var myModule = {};

/**
 * Rename to findOperators
 * Receives as input the ast of the file and
 * returns the number of occurrences for each operator 
 * 
 * Object 
 * 
 * { 'map': 2,
 *    'scan': 3
 * }
 */
myModule.findOperators = function (root, j, identifierName) {

    const rxjsCalls = root.find(j.Identifier)

    let identifierCalled = 0;
    rxjsCalls.forEach(p => {
        if (p.node.name == identifierName) {
            identifierCalled++;
        }
    });
    if (identifierCalled > 0) {
        console.log(`${identifierName} called: ` + identifierCalled + " times.");
    } else {
        console.log("File doesn't not include " + identifierName)
    }

    // return root.toSource({
    //     useTabs: true,
    //     quote: 'single'
    // })
    return identifierCalled
};

module.exports = myModule;