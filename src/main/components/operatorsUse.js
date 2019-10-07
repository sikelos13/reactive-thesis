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
myModule.operatorsUse = function (root, j) {

    const rxjsCalls = root.find(j.Identifier)
    let identifierCalled = 0;
    let source = "";
    rxjsCalls.forEach(p => {
        // console.log(p.parentPath.parentPath.node.type)
        if (p.parentPath.parentPath.node.type == "ImportDeclaration") {
            // console.log(p.parentPath.parentPath.node.source.value);
            source = p.parentPath.parentPath.node.source.value
            if (source.includes("rxjs")) {
                identifierCalled++;
            }
        }
        // if (p.node.name == identifierName) {
        //     identifierCalled++;
        // }
    });
    if (identifierCalled > 0) {
        console.log(`File has imported : ` + identifierCalled + "  rxjs items.");
    } else {
        console.log("File doesn't not include  rxjs calls")
    }

    // return root.toSource({
    //     useTabs: true,
    //     quote: 'single'
    // })
    return identifierCalled
};

module.exports = myModule;