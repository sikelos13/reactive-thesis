const jscodeshift = require('jscodeshift');

class JSCodeshiftWrapper {

    static parse(code) {
        return jscodeshift(code, {
            parser: require("recast/parsers/flow")
        });
    }
}

module.exports = Object.freeze({
    j: jscodeshift,
    parser: JSCodeshiftWrapper.parse
});