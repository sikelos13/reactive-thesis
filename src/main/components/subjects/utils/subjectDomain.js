module.exports = {
    createObjectFunc: (name, start,end,astNode, path) => {
        object = {
            name: name,
            position: {
                start: start,
                end: end
            },
            // astNode: astNode,
            fileName: path
        };
    
        return object;
    }
};
