module.exports = {
    createObjectFunc: (name, start,end, path, operators,nestedPipeline,initOfPipe) => {
        object = {
            name: name,
            position: {
                start: start,
                end: end
            },
            fileName: path,
            operators: operators,
            nestedPipelines: nestedPipeline,
            initOfPipe: initOfPipe
        };
    
        return object;
    }
};
