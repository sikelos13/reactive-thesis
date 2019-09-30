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
myModule.codeModPipe = function(root, j) {
    //const j = api.jscodeshift;
    //const root = j(file);
    const rxjsCalls = root.find(j.CallExpression, {
        callee: {
            // object: {
            //     name: 'subscribe'
            // },
            property: {
                name: "pipe",
            },
        }
    });
    let tempCalls = 0;
    rxjsCalls.forEach(p => {
        if (p.node.callee.property.name == 'pipe') {
            tempCalls++;
        }
        console.log(p);
        console.log("Pipe called: " + tempCalls + " times.");
    });
    return root.toSource({
        useTabs: true,
        quote: 'single'
    })
};

module.exports = myModule;