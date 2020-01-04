var operatorDomain = {};

operatorDomain.operator = function (name, alias, astNode) {
    global.operatorObject = {
        name: name,
        alias: alias,
        astNode: astNode
    };
    operatorsArray.push(operatorObject)
};

module.exports = operatorDomain;