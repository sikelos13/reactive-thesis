module.exports = {
    operatorObjectCalc: (name, astNode, fileName) => {
        operatorObject = {
            name: name,
            // alias: alias,
            // astNode: astNode,
            fileName: fileName
        };
    
        return operatorObject;
    }
};
