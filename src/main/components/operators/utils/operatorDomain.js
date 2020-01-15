module.exports = {
    operatorObjectCalc: (name, start,end,astNode, path,timesUsed) => {
        operatorObject = {
            name: name,
            timesUsed: timesUsed,
            position: {
                start: start,
                end: end
            },
            // alias: alias,
            // astNode: astNode,
            fileName: path
        };
    
        return operatorObject;
    }
};
