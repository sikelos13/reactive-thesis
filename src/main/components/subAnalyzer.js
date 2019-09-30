export default function codeModSubscribe(file, api) {
    const j = api.jscodeshift;
    const root = j(file.source);
    const rxjsCalls = root.find(j.CallExpression, {
        callee: {
            // object: {
            //     name: 'subscribe'
            // },
            property: {
                name: "subscribe",
            },
        }
    });
    let tempCallsSecond = 0;
    rxjsCalls.forEach(p => {
        if (p.node.callee.property.name == 'subscribe') {
            tempCallsSecond++;
        }
        console.log(p);
        console.log("Subscribe called: " + tempCallsSecond + " times.");
    });
    return root.toSource({
        useTabs: true,
        quote: 'single'
    })
};