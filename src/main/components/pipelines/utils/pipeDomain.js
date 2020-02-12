module.exports = {
    createObjectFunc: (name, start,end, path, operators,nestedPipeline) => {
        object = {
            name: name,
            // timesUsed: timesUsed,
            position: {
                start: start,
                end: end
            },
            // astNode: astNode,
            fileName: path,
            // isPipe: isPipe,
            operators: operators,
            nestedPipelines: nestedPipeline
        };
    
        return object;
    }
};
