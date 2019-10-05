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
myModule.consoleAst = function (root, j, operatorName) {
    // const j = api.jscodeshift;
    // const root = j(file.source);
    // const rxjsCalls = root.find(j.CallExpression, {
    //     callee: {
    //         // object: {
    //         //     name: 'subscribe'
    //         // },
    //         property: {
    //             name: "subscribe",
    //         },
    //     }
    // });
    // let tempCallsSecond = 0;
    // rxjsCalls.forEach(p => {
    //     if (p.node.callee.property.name == 'subscribe') {
    //         tempCallsSecond++;
    //     }
    //     console.log(p);
    //     console.log("Subscribe called: " + tempCallsSecond + " times.");
    // });
    return root.toSource({
        useTabs: true,
        quote: 'single'
    })
};

module.exports = myModule;