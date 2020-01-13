module.exports = {
    operatorObjectCalc: (name, start,end,astNode, fileName) => {
        operatorObject = {
            name: name,
            position: {
                start: start,
                end: end
            },
            // alias: alias,
            // astNode: astNode,
            fileName: fileName
        };
    
        return operatorObject;
    }
};
