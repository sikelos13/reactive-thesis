module.exports = {
    operatorObjectCalc: (name, start,end,astNode, fileName,timesUsed) => {
        operatorObject = {
            name: name,
            timesUsed: timesUsed,
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
