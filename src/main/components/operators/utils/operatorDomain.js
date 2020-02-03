module.exports = {
    createObjectFunc: (name, line,astNode, path) => {
        object = {
            name: name,
            line: line,
            // astNode: astNode,
            fileName: path
        };
    
        return object;
    }
};
