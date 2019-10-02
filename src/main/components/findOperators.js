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
myModule.findOperators = function (root, j, operatorName) {
    //const j = api.jscodeshift;
    // const root = j(file);
    // console.log(root)
    const rxjsCalls = root.find(j.Identifier)
    // console.log(rxjsCalls)
    //     callee: {
    //         type: "CallExpression",
    //         object: {
    //             type: "Identifier",
    //             name: operatorName
    //         },
    //         // property: {
    //         //     name: operatorName,
    //         // },
    //     }
    // });
    let operatorCalled = 0;
    rxjsCalls.forEach(p => {
        if (p.node.name == operatorName) {
            operatorCalled++;
        }
    });
    console.log(`${operatorName} called: ` + operatorCalled + " times.");

    // return root.toSource({
    //     useTabs: true,
    //     quote: 'single'
    // })
    return operatorCalled
};

module.exports = myModule;