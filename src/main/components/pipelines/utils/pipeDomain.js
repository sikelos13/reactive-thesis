module.exports = {
    createObjectFunc: (name, start,end, path, isPipe, operators) => {
        object = {
            name: name,
            // timesUsed: timesUsed,
            position: {
                start: start,
                end: end
            },
            // astNode: astNode,
            fileName: path,
            isPipe: isPipe,
            operators: operators
        };
    
        return object;
    }
};
