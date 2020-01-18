module.exports = {
    createObjectFunc: (name, start,end,astNode, path,timesUsed) => {
        object = {
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
    
        return object;
    }
};
