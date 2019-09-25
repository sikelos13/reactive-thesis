export default function codeModPipe(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
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